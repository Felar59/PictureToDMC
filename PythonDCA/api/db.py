"""SQLite access and schema.

One connection per request thread (sqlite3 objects aren't shareable across
threads), WAL so a reader never blocks the writer.

Schema notes worth keeping:

  * `oauth_accounts` is a separate table rather than a `google_sub` column on
    users. Sign-in is Google-only today; when e-mail or another provider is
    added, that is a new row, not a migration.

  * `sessions` is keyed by the *hash* of the cookie token. A leaked database
    backup therefore contains no usable session.

  * `users.role` and `users.banned_at` are never written by this package at all.
    The only thing that writes them is `sudo ptd-panel` (deploy/admin/), from a
    shell on the box. So the admin role is not a privilege this process guards
    carefully — it is one it cannot grant, whatever arrives in a request body, and
    whatever an environment variable claims. Both columns are read here on every
    authenticated request and written here never.

  * `display_name` is NOT unique. Names come from Google, and real people
    collide; identity is the id.
"""

import base64
import binascii
import json
import os
import secrets
import sqlite3
import threading
import time

from . import config

# 6 added posts.kind and made the pattern columns nullable, so a member can show
#   a finished piece they stitched from someone else's chart. Also added
#   `reports`: photos arriving without a pattern are photos nobody vetted.
# 5 added posts.palette: the thread references ordered by how much of each the
#   piece uses, so a gallery card can show what it is actually made of.
# 4 added app_meta, which holds the post id high-water mark.
# 3 added users.bio, users.icon and users.setup_at.
# 2 added `comments`. Every statement in SCHEMA is IF NOT EXISTS and init() runs
# on boot, so a new table needs no migration step of its own.
SCHEMA_VERSION = 6

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
    -- What was published. 'pattern' is a chart this site produced, with a photo
    -- of the finished piece if the member had one. 'photo' is the finished piece
    -- alone: someone who stitched a chart bought elsewhere still has work worth
    -- showing, and refusing it would have made the second gallery a subset of
    -- the first rather than its own thing.
    kind         TEXT    NOT NULL DEFAULT 'pattern',
    -- Nullable since kind='photo': there is no chart behind that post. Every
    -- reader has to cope with their absence rather than assume a grid.
    width        INTEGER,
    height       INTEGER,
    -- base64 of one byte per stitch (thread index + 1, 0 = empty).
    cells        TEXT,
    -- JSON array of DMC references, indexed by the byte values above.
    thread_codes TEXT,
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
-- Every gallery query now filters on kind, and idx_posts_cat cannot serve it.
CREATE INDEX IF NOT EXISTS idx_posts_kind   ON posts(kind, created_at DESC);

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

-- What somebody flagged, and why.
--
-- This exists because of kind='photo'. A pattern post is bounded by what the
-- converter can make; a free photo is whatever was uploaded, so there has to be
-- a way to say "look at this" that is not a message to the owner. One row per
-- member per post: reporting twice is the same report, not a louder one.
CREATE TABLE IF NOT EXISTS reports (
    post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason      TEXT    NOT NULL,
    created_at  INTEGER NOT NULL,
    PRIMARY KEY (post_id, reporter_id)
);
-- Newest first: the queue is read as "what came in since I last looked".
CREATE INDEX IF NOT EXISTS idx_reports_new ON reports(created_at DESC);
"""


def _give_everyone_a_mark(conn: sqlite3.Connection) -> None:
    """A picture mark for anybody who signed up before there were any.

    New accounts are given one at creation, which left everyone who joined before
    that wearing the drawn mark — and once the drawn mark stopped being offered in
    the picker, those members were wearing something they could not have chosen and
    could not choose again. Two states for one thing, and the older one invisible
    to the person in it.

    Runs at every boot and matches nothing once it has. A different mark per
    member: one UPDATE would have given the whole backlog the same avatar, which
    is precisely the sameness the random assignment exists to avoid.
    """
    from .marks import MARK_PREFIX, MARK_SLUGS

    rows = conn.execute("SELECT id FROM users WHERE icon IS NULL").fetchall()
    if not rows:
        return
    pool = sorted(MARK_SLUGS)
    with conn:
        for row in rows:
            conn.execute(
                "UPDATE users SET icon = ? WHERE id = ?",
                (MARK_PREFIX + secrets.choice(pool), row["id"]),
            )
    print(f"[ptd] gave a mark to {len(rows)} member(s) who had none", flush=True)


def init() -> None:
    conn = connect()
    # Before SCHEMA, not after: SCHEMA now creates an index on posts.kind, and on a
    # table written before that column existed the CREATE INDEX fails — taking the
    # whole boot with it. Anything that reshapes a table has to run first.
    _migrate_posts_shape(conn)
    conn.executescript(SCHEMA)
    conn.execute(f"PRAGMA user_version = {SCHEMA_VERSION}")
    _give_everyone_a_mark(conn)
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


def _migrate_posts_shape(conn: sqlite3.Connection) -> None:
    """Give `posts` a kind, and let the pattern columns be empty.

    Runs once, on a table created before kind='photo' existed — and does nothing
    at all on a fresh database, where SCHEMA is about to create the right shape.
    It has to rebuild the table rather than ALTER it: SQLite can add a column but
    cannot drop a NOT NULL, and `width`, `height`, `cells` and `thread_codes` all
    carry one — they were written when every post was a chart.

    The rebuild is the documented SQLite recipe, inside one transaction so an
    interrupted boot leaves either the old table or the new one, never half a
    table. Foreign keys are suspended for the duration: `comments`, `post_likes`
    and `reports` all reference posts(id), and dropping the parent with them
    enforced would take their rows with it.

    Existing rows become kind='pattern', which is what they are.
    """
    exists = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'posts'"
    ).fetchone()
    if not exists:
        return
    if "kind" in {row["name"] for row in conn.execute("PRAGMA table_info(posts)")}:
        return

    conn.execute("PRAGMA foreign_keys = OFF")
    conn.execute("BEGIN IMMEDIATE")
    try:
        conn.execute(
            """
            CREATE TABLE posts_new (
                id           INTEGER PRIMARY KEY,
                author_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                title        TEXT    NOT NULL,
                category     TEXT    NOT NULL DEFAULT 'other',
                kind         TEXT    NOT NULL DEFAULT 'pattern',
                width        INTEGER,
                height       INTEGER,
                cells        TEXT,
                thread_codes TEXT,
                thumb_png    BLOB,
                photo        BLOB,
                photo_mime   TEXT,
                like_count   INTEGER NOT NULL DEFAULT 0,
                created_at   INTEGER NOT NULL,
                palette      TEXT
            )
            """
        )
        conn.execute(
            """
            INSERT INTO posts_new (id, author_id, title, category, kind, width, height,
                                   cells, thread_codes, thumb_png, photo, photo_mime,
                                   like_count, created_at, palette)
            SELECT id, author_id, title, category, 'pattern', width, height,
                   cells, thread_codes, thumb_png, photo, photo_mime,
                   like_count, created_at, palette
            FROM posts
            """
        )
        moved = conn.execute("SELECT COUNT(*) AS n FROM posts_new").fetchone()["n"]
        kept = conn.execute("SELECT COUNT(*) AS n FROM posts").fetchone()["n"]
        # A silent short copy would lose members' work. Better to refuse to boot.
        if moved != kept:
            raise RuntimeError(f"posts rebuild copied {moved} of {kept} rows")
        conn.execute("DROP TABLE posts")
        conn.execute("ALTER TABLE posts_new RENAME TO posts")
        # Indexes belong to the dropped table, so they go with it.
        conn.execute("CREATE INDEX idx_posts_new    ON posts(created_at DESC)")
        conn.execute("CREATE INDEX idx_posts_top    ON posts(like_count DESC, created_at DESC)")
        conn.execute("CREATE INDEX idx_posts_author ON posts(author_id, created_at DESC)")
        conn.execute("CREATE INDEX idx_posts_cat    ON posts(category, created_at DESC)")
        conn.execute("CREATE INDEX idx_posts_kind   ON posts(kind, created_at DESC)")
        conn.execute("COMMIT")
    except Exception:
        conn.execute("ROLLBACK")
        raise
    finally:
        conn.execute("PRAGMA foreign_keys = ON")


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
