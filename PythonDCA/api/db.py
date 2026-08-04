"""SQLite access and schema.

One connection per request thread (sqlite3 objects aren't shareable across
threads), WAL so a reader never blocks the writer.

Schema notes worth keeping:

  * `oauth_accounts` is a separate table rather than a `google_sub` column on
    users. Sign-in is Google-only today; when e-mail or another provider is
    added, that is a new row, not a migration.

  * `sessions` is keyed by the *hash* of the cookie token. A leaked database
    backup therefore contains no usable session.

  * `users.role` is never written by any HTTP route in this package. Promoting
    an admin means an UPDATE from a shell on the box. That is deliberate: no
    request body can escalate a privilege that no handler touches.

  * `display_name` is NOT unique. Names come from Google, and real people
    collide; identity is the id.
"""

import base64
import binascii
import json
import os
import sqlite3
import threading
import time

from . import config

# 5 added posts.palette: the thread references ordered by how much of each the
#   piece uses, so a gallery card can show what it is actually made of.
# 4 added app_meta, which holds the post id high-water mark.
# 3 added users.bio, users.icon and users.setup_at.
# 2 added `comments`. Every statement in SCHEMA is IF NOT EXISTS and init() runs
# on boot, so a new table needs no migration step of its own.
SCHEMA_VERSION = 5

_local = threading.local()


def now_ms() -> int:
    return int(time.time() * 1000)


def connect() -> sqlite3.Connection:
    """Per-thread connection, created on first use."""
    conn = getattr(_local, "conn", None)
    if conn is not None:
        return conn

    os.makedirs(os.path.dirname(config.DB_PATH) or ".", exist_ok=True)
    conn = sqlite3.connect(config.DB_PATH, timeout=10, isolation_level=None)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 5000")
    conn.execute("PRAGMA synchronous = NORMAL")
    _local.conn = conn
    return conn


SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY,
    display_name TEXT    NOT NULL,
    email        TEXT,
    avatar_url   TEXT,
    role         TEXT    NOT NULL DEFAULT 'user',
    created_at   INTEGER NOT NULL,
    banned_at    INTEGER,
    bio          TEXT,
    -- Which of the built-in marks the member chose. NULL means the one derived
    -- from their id, which is what everyone starts with.
    icon         TEXT,
    -- When they last confirmed their own name. NULL means never: the account was
    -- created from a Google sign-in and still carries whatever Google reported,
    -- which is what the client uses to offer the choice once.
    setup_at     INTEGER
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
    provider     TEXT    NOT NULL,
    provider_uid TEXT    NOT NULL,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (provider, provider_uid)
);

CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT    PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS posts (
    id           INTEGER PRIMARY KEY,
    author_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        TEXT    NOT NULL,
    category     TEXT    NOT NULL DEFAULT 'other',
    width        INTEGER NOT NULL,
    height       INTEGER NOT NULL,
    -- base64 of one byte per stitch (thread index + 1, 0 = empty).
    cells        TEXT    NOT NULL,
    -- JSON array of DMC references, indexed by the byte values above.
    thread_codes TEXT    NOT NULL,
    -- Small PNG of the pattern, for gallery cards. Full cells are only sent
    -- when a single post is opened.
    thumb_png    BLOB,
    -- Optional photo of the finished piece in the hoop.
    photo        BLOB,
    photo_mime   TEXT,
    like_count   INTEGER NOT NULL DEFAULT 0,
    created_at   INTEGER NOT NULL,
    -- JSON array of thread references, most-stitched first. Derived from `cells`
    -- at publish time so the gallery query never has to read the grid.
    palette      TEXT
);
CREATE INDEX IF NOT EXISTS idx_posts_new    ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_top    ON posts(like_count DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_cat    ON posts(category, created_at DESC);

CREATE TABLE IF NOT EXISTS post_likes (
    post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (post_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_likes_user ON post_likes(user_id);

-- Small key/value store. Today it holds one thing: the highest post id ever
-- used, so a deleted post's id is never handed to a new one. SQLite's
-- INTEGER PRIMARY KEY recycles the id of the highest deleted row, which made a
-- shared link quietly point at someone else's piece and let a browser serve the
-- deleted post's cached thumbnail under the new post's id.
CREATE TABLE IF NOT EXISTS app_meta (
    key   TEXT PRIMARY KEY,
    value INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY,
    post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body       TEXT    NOT NULL,
    created_at INTEGER NOT NULL
);
-- Oldest first is how a conversation reads, and it is the only order this is
-- ever queried in.
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at);
"""


def init() -> None:
    conn = connect()
    conn.executescript(SCHEMA)
    conn.execute(f"PRAGMA user_version = {SCHEMA_VERSION}")
    # Nothing reads `avatar_url` any more: members are shown a stitched mark
    # drawn from their id. Holding on to a Google profile photo we never display
    # would be keeping a face for no reason, so it goes. Matches no rows once it
    # has run, and the column itself stays — dropping one in SQLite means
    # rebuilding the table, for nothing.
    conn.execute("UPDATE users SET avatar_url = NULL WHERE avatar_url IS NOT NULL")

    # CREATE TABLE IF NOT EXISTS does nothing to a table that already exists, so
    # columns added after the first release need adding by hand. SQLite has no
    # ADD COLUMN IF NOT EXISTS and executescript cannot branch, hence the loop.
    have = {row["name"] for row in conn.execute("PRAGMA table_info(users)")}
    for column, decl in (("bio", "TEXT"), ("icon", "TEXT"), ("setup_at", "INTEGER")):
        if column not in have:
            conn.execute(f"ALTER TABLE users ADD COLUMN {column} {decl}")

    have_posts = {row["name"] for row in conn.execute("PRAGMA table_info(posts)")}
    if "palette" not in have_posts:
        conn.execute("ALTER TABLE posts ADD COLUMN palette TEXT")
    _backfill_palettes(conn)


def usage_order(cells_b64: str, codes: list[str]) -> list[str]:
    """Thread references, most-stitched first.

    The grid holds one byte per stitch: the index into `codes`, plus one, with
    zero for bare cloth. Counting is a 256-bucket histogram over that, which is
    why this is cheap enough to do at publish time and store.
    """
    try:
        raw = base64.b64decode(cells_b64, validate=True)
    except (binascii.Error, ValueError):
        return list(codes)

    counts = [0] * (len(codes) + 1)
    for byte in raw:
        if byte and byte <= len(codes):
            counts[byte] += 1

    order = sorted(range(1, len(codes) + 1), key=lambda i: -counts[i])
    # Threads with no stitches at all keep their place at the end rather than
    # being dropped: the count beside the strip is the palette's real size.
    return [codes[i - 1] for i in order]


def _backfill_palettes(conn: sqlite3.Connection) -> None:
    """Fills `palette` for pieces published before the column existed."""
    rows = conn.execute(
        "SELECT id, cells, thread_codes FROM posts WHERE palette IS NULL"
    ).fetchall()
    for row in rows:
        try:
            codes = json.loads(row["thread_codes"])
        except (ValueError, TypeError):
            continue
        conn.execute(
            "UPDATE posts SET palette = ? WHERE id = ?",
            (json.dumps(usage_order(row["cells"], codes)), row["id"]),
        )


def purge_expired_sessions() -> int:
    """Housekeeping, called on boot. Expired rows are harmless but unbounded."""
    cur = connect().execute("DELETE FROM sessions WHERE expires_at < ?", (now_ms(),))
    return cur.rowcount or 0
