"""Pane contents: (text, attribute) lines ready to paint."""

from __future__ import annotations

import curses
import datetime as dt
import re

from ui import C_BAD, C_DIM, C_OK, C_WARN

# The publish limit in routes_gallery.py. Only used to colour a count that has
# reached it — the rule itself lives in one place, and it is not here.
POSTS_PER_DAY = 5


def size(octets: float) -> str:
    """Readable size. Base 1024, one decimal from Mo up."""
    for unit in ("o", "Ko", "Mo", "Go", "To"):
        if octets < 1024 or unit == "To":
            return f"{octets:.0f} {unit}" if unit in ("o", "Ko") else f"{octets:.1f} {unit}"
        octets /= 1024
    return ""


def when(ms: int | None) -> str:
    """Short local timestamp ('—' when absent)."""
    if not ms:
        return "—"
    return dt.datetime.fromtimestamp(ms / 1000).strftime("%d/%m %H:%M")


# Column header for the ACCOUNTS pane, aligned to the letter with user_lines()
# below — without it, "5 3" means nothing to anyone who did not write the format.
USER_HEADER = f"{'id':>4} {'nom':<18} ét. {'pcs':>4} {'24h':>4} {'com':>4}  inscrit le"


def user_lines(rows) -> list[tuple[str, int]]:
    """One account per line: id, name, state, activity, sign-up date.

    The state flag carries the only three things worth a colour: banned, admin,
    and "still using the name Google gave them" — that last one is what a brand
    new account looks like, which is what you are looking at when you are deciding
    whether a flood is a person or a script.
    """
    out = []
    for u in rows:
        if u["banned_at"] is not None:
            flag, attr = "BAN", curses.color_pair(C_BAD)
        elif u["role"] == "admin":
            flag, attr = "ADM", curses.color_pair(C_OK)
        elif u["setup_at"] is None:
            flag, attr = "  ?", curses.color_pair(C_DIM)
        else:
            flag, attr = "   ", 0
        today = f"{u['today']}"
        if u["today"] >= POSTS_PER_DAY:
            today = f"{u['today']}!"
        text = (
            f"{u['id']:>4} {u['display_name'][:18]:<18} {flag} "
            f"{u['posts']:>4} {today:>4} {u['coms']:>4}  {when(u['created_at'])}"
        )
        out.append((text, attr))
    return out or [("aucun compte", curses.color_pair(C_DIM))]


PIECE_HEADER = f"{' ':<1}{'id':>4} {'titre':<20} {'par':<13} {'points':>9} {'♥':>4} {'com':>4}  publié"


def piece_lines(rows) -> list[tuple[str, int]]:
    """The gallery, newest first. 'P' marks a piece with a hoop photo."""
    out = []
    for p in rows:
        grid = f"{p['width']}×{p['height']}"
        text = (
            f"{'P' if p['has_photo'] else ' '}{p['id']:>4} {(p['title'] or '')[:20]:<20} "
            f"{(p['display_name'] or '?')[:13]:<13} {grid:>9} "
            f"{p['like_count']:>4} {p['coms']:>4}  {when(p['created_at'])}"
        )
        out.append((text, curses.color_pair(C_OK) if p["role"] == "admin" else 0))
    return out or [("aucune pièce", curses.color_pair(C_DIM))]


# uvicorn's access line: `INFO:     127.0.0.1:53000 - "GET /api/posts HTTP/1.1" 200 OK`
ACCESS = re.compile(r'^(\w+):\s+\S+ - "([A-Z]+) (\S+) HTTP/[\d.]+" (\d{3})')
LEVELLED = re.compile(r"^(TRACE|DEBUG|INFO|WARNING|ERROR|CRITICAL):\s*(.*)$")


def uvicorn_line(payload: str) -> tuple[str, int] | None:
    """Condense one journal payload from the app.

    This is uvicorn, not a JSON logger, so there is no structure to parse — but an
    access line still spends half a quarter-screen on the client address and the
    HTTP version, and neither has ever answered a question. What is left is the
    method, the path and the status, which is the whole of what you scan a log for.

    Returns None for lines worth hiding.
    """
    hit = ACCESS.match(payload)
    if hit:
        _, method, path, code = hit.groups()
        status = int(code)
        attr = (
            curses.color_pair(C_BAD)
            if status >= 500
            else curses.color_pair(C_WARN)
            if status >= 400
            else 0
        )
        # A static asset answering 200 is noise; a static asset answering 404 is
        # a deploy that went out half-built, so those stay.
        if status < 400 and not path.startswith("/api/"):
            return None
        return (f"{method} {path} → {status}", attr)

    hit = LEVELLED.match(payload)
    if hit:
        level, rest = hit.groups()
        if level in ("TRACE", "DEBUG"):
            return None
        attr = (
            curses.color_pair(C_BAD)
            if level in ("ERROR", "CRITICAL")
            else curses.color_pair(C_WARN)
            if level == "WARNING"
            else 0
        )
        label = "" if level == "INFO" else f"{level} "
        return (f"{label}{rest}".strip(), attr)

    # Anything else is most likely a traceback frame, and those are the lines you
    # actually came here for. Kept whole, in red.
    return (payload, curses.color_pair(C_BAD) if payload.startswith(("  ", "Traceback")) else 0)


def log_lines(lines: list[str]) -> list[tuple[str, int]]:
    """The service journal, newest at the bottom, tinted by severity."""
    out: list[tuple[str, int]] = []
    for raw in lines:
        # Drop the systemd header (timestamp, host, unit[pid]:) — three fields of
        # noise that would eat half of a quarter-screen.
        parts = raw.split(" ", 3)
        payload = parts[3] if len(parts) == 4 else raw
        stamp = parts[0][11:19] if len(parts[0]) >= 19 and parts[0][4:5] == "-" else ""
        shown = uvicorn_line(payload)
        if shown is None:
            continue
        text, attr = shown
        out.append((f"{stamp} {text}" if stamp else text, attr))
    return out or [("journal vide", curses.color_pair(C_DIM))]


def space_lines(sp: dict) -> list[tuple[str, int]]:
    """What the gallery takes up, split three ways, and what is left."""
    dim, ok = curses.color_pair(C_DIM), curses.color_pair(C_OK)
    content = sp["photo_b"] + sp["thumb_b"] + sp["cells_b"]
    rows: list[tuple[str, int]] = [
        (f"CONTENU  {size(content)}", curses.A_BOLD),
        (f"  photos d'ouvrage {size(sp['photo_b']):>10}   {sp['photos']} pièce(s)", 0),
        (f"  vignettes PNG    {size(sp['thumb_b']):>10}", 0),
        (f"  grilles (points) {size(sp['cells_b']):>10}   {sp['posts']} pièce(s)", 0),
    ]
    if sp["photos"]:
        rows.append((f"  moyenne / photo  {size(sp['photo_b'] / sp['photos']):>10}", dim))
    if sp["posts"]:
        # The grid is the piece: one byte per stitch, base64'd. This is the number
        # that says whether the gallery could hold ten thousand patterns.
        rows.append((f"  moyenne / grille {size(sp['cells_b'] / sp['posts']):>10}", dim))
    rows += [
        ("", 0),
        (f"BASE  {size(sp['db_total'])}", curses.A_BOLD),
        (f"  db.sqlite        {size(sp['db']):>10}", 0),
        (f"  -wal / -shm      {size(sp['wal'] + sp['shm']):>10}", dim),
        (f"  sauvegardes      {size(sp['backups']):>10}", 0),
        ("", 0),
    ]

    used, total, free = sp["disk_used"], sp["disk_total"], sp["disk_free"]
    pct = 100 * used / total if total else 0
    full = round(pct / 5)
    rows += [
        (f"DISQUE  {size(total)} · libre {size(free)}", curses.A_BOLD),
        (
            "  [" + "█" * full + "·" * (20 - full) + f"]  {pct:.0f}% utilisé",
            ok if pct < 80 else curses.color_pair(C_BAD),
        ),
    ]
    if sp["photos"] and sp["photo_b"]:
        # Deliberately rough: at the average photo weight, ignoring that backups
        # grow with the database.
        per = sp["photo_b"] / sp["photos"]
        rows.append((f"  de quoi tenir ~{free / per:,.0f} photos".replace(",", " "), dim))
    return rows


def plural(count: int, one: str, many: str | None = None) -> str:
    """`3 pièces`, `1 pièce`. The panel is read by two people, in French."""
    return f"{count} {one if count <= 1 else (many or one + 's')}"


def header(st: dict) -> str:
    """The counter line, top of the screen."""
    return (
        f" PICTURE TO DMC · {plural(st['users'], 'compte')} (+{st['users_24h']}/24h) · "
        f"{plural(st['admins'], 'admin')} · {plural(st['banned'], 'banni')} · "
        f"{plural(st['posts'], 'pièce')} (+{st['posts_24h']}/24h) · "
        f"{plural(st['comments'], 'commentaire')}"
    )
