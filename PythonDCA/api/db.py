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

import os
import sqlite3
import threading
import time

from . import config

SCHEMA_VERSION = 1

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
    banned_at    INTEGER
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
    created_at   INTEGER NOT NULL
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
"""


def init() -> None:
    conn = connect()
    conn.executescript(SCHEMA)
    conn.execute(f"PRAGMA user_version = {SCHEMA_VERSION}")


def purge_expired_sessions() -> int:
    """Housekeeping, called on boot. Expired rows are harmless but unbounded."""
    cur = connect().execute("DELETE FROM sessions WHERE expires_at < ?", (now_ms(),))
    return cur.rowcount or 0
