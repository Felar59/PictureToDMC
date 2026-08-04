"""Picture to DMC admin panel — four panes.

    ┌ JOURNAL ──────────────┬ COMPTES ──────────────┐
    │ dernières lignes      │ du plus récent,       │
    │ du service            │ promotion / ban ici   │
    ├ PIÈCES ───────────────┼ ESPACE ───────────────┤
    │ la galerie, la plus   │ place prise par les   │
    │ récente en haut       │ photos et les grilles │
    └───────────────────────┴───────────────────────┘

Tab pour changer de volet, flèches pour défiler. Sur COMPTES : `a` promeut ou
rétrograde, `b` bannit ou réhabilite, avec confirmation. `r` recharge, `q` quitte.

The panel writes straight to SQLite, and it is the ONLY path to the admin role.
No HTTP route in `PythonDCA/api/` writes `users.role`, so nobody can promote
themselves from the site whatever they send to it. Banning is the same story: the
column has been in the schema since the first release and nothing has ever set it
— this is what sets it.

Run it with `sudo ptd-panel` (it needs the database and the systemd journal).

Same shape and the same keys as emoji-art's `ea-panel` on this box, on purpose:
two panels on one server should not need two sets of habits.
"""

from __future__ import annotations

import curses
import sys

import data
import ui
import views

REFRESH_MS = 5000
PANES = ("JOURNAL", "COMPTES", "PIÈCES", "ESPACE")
HELP = " Tab volet · ↑↓ défiler · a admin · b ban · r recharger · q quitter "

# The two panes you point at a row of, rather than just scroll.
SELECTABLE = (1, 2)


class Panel:
    def __init__(self, scr, con):
        self.scr, self.con = scr, con
        self.focus = 1  # start on COMPTES, the only pane that acts
        self.sel = [0, 0, 0, 0]
        self.off = [0, 0, 0, 0]
        self.lines: list[list[tuple[str, int]]] = [[], [], [], []]
        self.users: list = []
        self.message = ""
        self.pending: tuple[str, str, object] | None = None
        self.reload()

    def reload(self) -> None:
        """Re-read everything. Fast enough to run every 5 s on this database."""
        self.stats = data.stats(self.con)
        self.users = data.recent_users(self.con)
        self.lines[0] = views.log_lines(data.recent_logs())
        self.lines[1] = views.user_lines(self.users)
        self.lines[2] = views.piece_lines(data.recent_posts(self.con))
        self.lines[3] = views.space_lines(data.space(self.con))
        # The journal is interesting at its end: stick to the bottom on reload.
        self.off[0] = max(0, len(self.lines[0]) - 1)
        for i in range(4):
            self.sel[i] = min(self.sel[i], max(0, len(self.lines[i]) - 1))

    def geometry(self) -> list[tuple[int, int, int, int]]:
        """The four rectangles (top, left, height, width)."""
        rows, cols = self.scr.getmaxyx()
        body = rows - 2  # one header line, one footer
        half_h, half_w = body // 2, cols // 2
        return [
            (1, 0, half_h, half_w),
            (1, half_w, half_h, cols - half_w),
            (1 + half_h, 0, body - half_h, half_w),
            (1 + half_h, half_w, body - half_h, cols - half_w),
        ]

    def draw(self) -> None:
        self.scr.erase()
        rows, cols = self.scr.getmaxyx()
        if rows < 14 or cols < 60:
            ui.put(self.scr, 0, 0, "Fenêtre trop petite (min. 60x14).", curses.A_BOLD)
            self.scr.refresh()
            return
        ui.put(self.scr, 0, 0, views.header(self.stats), curses.A_BOLD)
        for i, (top, left, height, width) in enumerate(self.geometry()):
            focused = i == self.focus
            title = f"{PANES[1]} ({len(self.users)})" if i == 1 else PANES[i]
            ui.box(self.scr, top, left, height, width, title, focused)
            # The two list panes get a frozen column header: the list scrolls under
            # it, and the selection stays aligned with the rows behind it.
            head = views.USER_HEADER if i == 1 else views.PIECE_HEADER if i == 2 else None
            top_pad = 1 if head else 0
            if head:
                ui.put(
                    self.scr,
                    top + 1,
                    left + 2,
                    head,
                    curses.color_pair(ui.C_DIM) | curses.A_UNDERLINE,
                )
            inner_h, count = height - 2 - top_pad, len(self.lines[i])
            sel = self.sel[i] if focused and i in SELECTABLE else -1
            anchor = sel if sel >= 0 else self.off[i]
            self.off[i] = ui.scroll_window(count, anchor, self.off[i], inner_h)
            ui.draw_list(
                self.scr, top + 1 + top_pad, left, inner_h, width, self.lines[i], sel, self.off[i]
            )
            ui.draw_scrollbar(
                self.scr, top + 1 + top_pad, left + width - 1, inner_h, count, self.off[i]
            )
        self.draw_footer(rows, cols)
        self.scr.refresh()

    def draw_footer(self, rows: int, cols: int) -> None:
        if self.pending:
            text = f" {self.pending[1]}  [o/n] "
            ui.put(
                self.scr,
                rows - 1,
                0,
                text.ljust(cols - 1),
                curses.color_pair(ui.C_WARN) | curses.A_REVERSE,
            )
            return
        ui.put(self.scr, rows - 1, 0, HELP, curses.color_pair(ui.C_DIM))
        if self.message:
            ui.put(
                self.scr,
                rows - 1,
                min(len(HELP) + 2, cols - 2),
                self.message,
                curses.color_pair(ui.C_OK),
            )

    def move(self, step: int) -> None:
        """Move the selection (list panes) or the scroll anchor (the others)."""
        i = self.focus
        if i in SELECTABLE:
            self.sel[i] = max(0, min(len(self.lines[i]) - 1, self.sel[i] + step))
        else:
            self.off[i] = max(0, min(max(0, len(self.lines[i]) - 1), self.off[i] + step))

    def ask(self, kind: str) -> None:
        """Line up an action on the selected account and ask for confirmation."""
        if self.focus != 1 or not self.users:
            self.message = "action réservée au volet COMPTES"
            return
        user = self.users[min(self.sel[1], len(self.users) - 1)]
        name = user["display_name"]
        if kind == "role":
            role = "user" if user["role"] == "admin" else "admin"
            verb = "Rétrograder" if role == "user" else "Promouvoir admin"
            self.pending = ("role", f"{verb} {name} ?", (user["id"], role))
        else:
            banned = user["banned_at"] is None
            verb = "Bannir" if banned else "Réhabiliter"
            self.pending = ("ban", f"{verb} {name} ?", (user["id"], banned))

    def apply(self) -> None:
        kind, _, args = self.pending  # type: ignore[misc]
        self.pending = None
        try:
            uid, value = args  # type: ignore[misc]
            self.message = (
                data.set_role(self.con, uid, value)
                if kind == "role"
                else data.set_ban(self.con, uid, value)
            )
        except Exception as err:  # a refused guard rail, a locked database… show it, don't crash
            self.message = f"refusé : {err}"
        self.reload()

    def key(self, ch: int) -> bool:
        """Handle one keypress. Returns False to quit."""
        if self.pending:
            if ch in (ord("o"), ord("y"), ord("O"), ord("Y"), curses.KEY_ENTER, 10):
                self.apply()
            elif ch != -1:
                self.pending, self.message = None, "annulé"
            return True
        rows = self.scr.getmaxyx()[0]
        page = max(1, (rows - 2) // 2 - 3)
        if ch in (ord("q"), 27):
            return False
        if ch == ord("\t"):
            self.focus = (self.focus + 1) % 4
        elif ch == curses.KEY_BTAB:
            self.focus = (self.focus - 1) % 4
        elif ch in (curses.KEY_DOWN, ord("j")):
            self.move(1)
        elif ch in (curses.KEY_UP, ord("k")):
            self.move(-1)
        elif ch == curses.KEY_NPAGE:
            self.move(page)
        elif ch == curses.KEY_PPAGE:
            self.move(-page)
        elif ch in (curses.KEY_HOME, ord("g")):
            self.sel[self.focus] = self.off[self.focus] = 0
        elif ch in (ord("a"), ord("b")):
            self.ask("role" if ch == ord("a") else "ban")
        elif ch == ord("r"):
            self.reload()
            self.message = "rechargé"
        return True

    def run(self) -> None:
        self.scr.timeout(REFRESH_MS)
        while True:
            self.draw()
            ch = self.scr.getch()
            if ch == -1:  # timed out: automatic refresh
                if not self.pending:
                    self.reload()
                continue
            self.message = ""
            if not self.key(ch):
                return


def main() -> int:
    con = data.connect()
    try:
        curses.wrapper(lambda scr: _boot(scr, con))
    except KeyboardInterrupt:
        pass
    finally:
        con.close()
    return 0


def _boot(scr, con) -> None:
    curses.curs_set(0)
    if curses.has_colors():
        ui.init_colors()
    scr.keypad(True)
    Panel(scr, con).run()


if __name__ == "__main__":
    sys.exit(main())
