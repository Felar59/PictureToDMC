"""The panel's data: SQLite and the systemd journal.

Everything is read-only except `set_role` and `set_ban` — the panel's only two
writes, and the only places in the whole project that touch `users.role` or
`users.banned_at`. No HTTP route in `PythonDCA/api/` writes either column, so
nobody can promote themselves from the site whatever they send to it.

The database runs in WAL mode, so reading while the app writes blocks nobody.

Every query is guarded against a schema older than this file: the panel is
installed by hand and the app is deployed by CI, so the two can be out of step
for a few minutes, and "the column isn't there yet" must not be a crash.
"""

from __future__ import annotations

import os
import sqlite3
import subprocess
import time

DB_PATH = os.environ.get("PTD_DB", "/var/lib/picturetodmc/db.sqlite")
SERVICE = os.environ.get("PTD_SERVICE", "picturetodmc")

DAY_MS = 24 * 60 * 60 * 1000


class Refused(Exception):
    """Action refused by a guard rail — not a technical error."""


def connect() -> sqlite3.Connection:
    """Open the database read/write. Fails early if the file is missing."""
    if not os.path.exists(DB_PATH):
        raise SystemExit(f"base introuvable : {DB_PATH}")
    con = sqlite3.connect(f"file:{DB_PATH}?mode=rw", uri=True, timeout=5)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA busy_timeout = 4000")
    return con


def columns(con: sqlite3.Connection, table: str) -> set:
    """Which columns a table actually has."""
    return {c["name"] for c in con.execute(f"PRAGMA table_info({table})")}


def stats(con: sqlite3.Connection) -> dict:
    """The header's counters, in one query."""
    day = int(time.time() * 1000) - DAY_MS
    row = con.execute(
        """
        SELECT (SELECT COUNT(*) FROM users)                          AS users,
               (SELECT COUNT(*) FROM users WHERE role = 'admin')     AS admins,
               (SELECT COUNT(*) FROM users WHERE banned_at IS NOT NULL) AS banned,
               (SELECT COUNT(*) FROM users WHERE created_at > ?)     AS users_24h,
               (SELECT COUNT(*) FROM posts)                          AS posts,
               (SELECT COUNT(*) FROM posts WHERE created_at > ?)     AS posts_24h,
               (SELECT COUNT(*) FROM comments)                       AS comments
        """,
        (day, day),
    ).fetchone()
    return dict(row)


def recent_users(con: sqlite3.Connection, limit: int = 300) -> list[sqlite3.Row]:
    """Accounts, newest first, with what it takes to decide on a ban.

    `today` is the piece count inside the rolling 24 hours the publish limit uses,
    so a flood shows up as "5/5" against a cap of five rather than as a total that
    says nothing about pace.
    """
    setup = "u.setup_at" if "setup_at" in columns(con, "users") else "NULL"
    return con.execute(
        f"""
        SELECT u.id, u.display_name, u.email, u.role, u.banned_at, u.created_at,
               {setup} AS setup_at,
               (SELECT COUNT(*) FROM posts p    WHERE p.author_id = u.id) AS posts,
               (SELECT COUNT(*) FROM posts p    WHERE p.author_id = u.id
                                                  AND p.created_at > ?)   AS today,
               (SELECT COUNT(*) FROM comments c WHERE c.author_id = u.id) AS coms
        FROM users u
        ORDER BY u.created_at DESC
        LIMIT ?
        """,
        (int(time.time() * 1000) - DAY_MS, limit),
    ).fetchall()


def recent_posts(con: sqlite3.Connection, limit: int = 200) -> list[sqlite3.Row]:
    """The gallery, newest first — what has just been published, and by whom.

    Read-only on purpose. Deleting a piece is something the site itself does well
    for an admin, on the page where you can see what you are deleting; a ✕ in a
    list of titles is the same power with the picture taken away.
    """
    return con.execute(
        """
        SELECT p.id, p.title, p.category, p.width, p.height, p.like_count,
               p.created_at, p.photo IS NOT NULL AS has_photo,
               u.display_name, u.role,
               (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS coms
        FROM posts p LEFT JOIN users u ON u.id = p.author_id
        ORDER BY p.created_at DESC
        LIMIT ?
        """,
        (limit,),
    ).fetchall()


def set_role(con: sqlite3.Connection, uid: int, role: str) -> str:
    """Promote or demote an account. Refuses to remove the last admin.

    Without that guard, one keystroke too many on your own account locks
    moderation shut, and the only way back in is raw SQL.
    """
    row = con.execute("SELECT display_name, role FROM users WHERE id = ?", (uid,)).fetchone()
    if row is None:
        raise Refused("compte introuvable")
    if row["role"] == "admin" and role != "admin":
        left = con.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'").fetchone()[0]
        if left <= 1:
            raise Refused("dernier admin : rétrogradation refusée")
    con.execute("UPDATE users SET role = ? WHERE id = ?", (role, uid))
    con.commit()
    verb = "promu admin" if role == "admin" else "rétrogradé"
    return f"{row['display_name']} {verb}"


def set_ban(con: sqlite3.Connection, uid: int, banned: bool) -> str:
    """Ban or reinstate an account, and cut its sessions there and then.

    The app already filters `banned_at IS NULL` on every authenticated request, so
    the ban itself is enough — but deleting the sessions means it takes effect on
    the next click rather than whenever a 180-day cookie happens to expire.

    Banning an admin is refused. Not for their sake: a banned admin still wears
    the flower on every card they published, and the honest order is to demote
    first, which also makes the last-admin guard above do its job.
    """
    row = con.execute("SELECT display_name, role FROM users WHERE id = ?", (uid,)).fetchone()
    if row is None:
        raise Refused("compte introuvable")
    if banned and row["role"] == "admin":
        raise Refused("rétrograde-le d'abord (a), puis bannis-le")
    con.execute(
        "UPDATE users SET banned_at = ? WHERE id = ?",
        (int(time.time() * 1000) if banned else None, uid),
    )
    if banned:
        con.execute("DELETE FROM sessions WHERE user_id = ?", (uid,))
    con.commit()
    return f"{row['display_name']} {'banni' if banned else 'réhabilité'}"


def space(con: sqlite3.Connection) -> dict:
    """What the gallery takes up, and what is left on the disk.

    The three parts are worth telling apart: a hoop photo is a few hundred kB, a
    pattern thumbnail a few kB, and the grid itself — the thing that makes a piece
    reusable — is base64 text at one byte per stitch. Knowing which of the three is
    growing is the difference between "stop accepting photos" and "nothing to do".

    WAL matters here: `db.sqlite` can look tiny while recent writes are still in
    `db.sqlite-wal`, so the three files are summed.
    """
    cols = columns(con, "posts")
    photo = "COALESCE(SUM(LENGTH(photo)), 0)" if "photo" in cols else "0"
    photos = "COALESCE(SUM(photo IS NOT NULL), 0)" if "photo" in cols else "0"
    thumb = "COALESCE(SUM(LENGTH(thumb_png)), 0)" if "thumb_png" in cols else "0"
    row = con.execute(
        f"""
        SELECT COUNT(*) AS posts, {photos} AS photos,
               {photo} AS photo_b, {thumb} AS thumb_b,
               COALESCE(SUM(LENGTH(cells)), 0) AS cells_b
        FROM posts
        """
    ).fetchone()
    out = dict(row)

    dbdir = os.path.dirname(DB_PATH) or "."
    for key, path in (("db", DB_PATH), ("wal", DB_PATH + "-wal"), ("shm", DB_PATH + "-shm")):
        out[key] = os.path.getsize(path) if os.path.exists(path) else 0
    out["db_total"] = out["db"] + out["wal"] + out["shm"]
    backups = os.path.join(dbdir, "backups")
    out["backups"] = (
        sum(e.stat().st_size for e in os.scandir(backups) if e.is_file())
        if os.path.isdir(backups)
        else 0
    )

    st = os.statvfs(dbdir)
    out["disk_total"] = st.f_frsize * st.f_blocks
    out["disk_free"] = st.f_frsize * st.f_bavail  # what a non-root process may use
    out["disk_used"] = out["disk_total"] - st.f_frsize * st.f_bfree
    return out


def recent_logs(lines: int = 300) -> list[str]:
    """The service's last journal lines (empty if journalctl is unavailable)."""
    cmd = ["journalctl", "-u", SERVICE, "-n", str(lines), "--no-pager", "-o", "short-iso"]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=6)
    except (OSError, subprocess.TimeoutExpired) as err:
        return [f"journalctl indisponible : {err}"]
    if out.returncode != 0:
        return [(out.stderr or "journalctl a échoué").strip()]
    return [ln for ln in out.stdout.splitlines() if ln.strip()]
