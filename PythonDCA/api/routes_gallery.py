"""Gallery: publishing a finished piece, listing, liking."""

import base64
import binascii
import json
import sqlite3

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse

from . import auth, sharecard
from .db import connect, now_ms, usage_order

router = APIRouter(prefix="/api")

CATEGORIES = {"pets", "flowers", "landscapes", "other"}

# What a post *is*, which is a different question from what it shows.
#
# 'pattern' is a chart this site generated, optionally with a photo of the finished
# piece. 'photo' is the finished piece alone — somebody who stitched a chart from
# elsewhere still has work worth showing, and the second gallery would be a subset
# of the first if it refused them. `category` stays the subject either way.
KINDS = {"pattern", "photo"}

PAGE_SIZE = 12
MAX_TITLE = 80
MAX_THREADS = 64
MAX_CELLS = 200 * 200
MAX_COMMENT = 1000
# How many pieces one account may publish, and over how long.
#
# A rolling twenty-four hours rather than a calendar day: a day that resets at
# midnight hands anyone who waits until 23:59 ten pieces in two minutes, which is
# the shape of flood this is here to prevent. The cost is that "per day" is now
# "since this time yesterday", so the refusal says when there will be room again
# instead of leaving someone to guess.
DAILY_POST_LIMIT = 5
DAY_MS = 24 * 60 * 60 * 1000
# A pattern thumbnail is a few kB; the hoop photo is the one that can be big.
# A thumbnail is now one pixel per stitch, so the worst case a 200x200 grid can
# produce is a 40 000-pixel PNG — a few tens of kilobytes. 256 kB was sized for the
# old ~360px-wide version and would now wave through something a hundred times
# larger than anything the client sends.
MAX_THUMB_BYTES = 64 * 1024
MAX_PHOTO_BYTES = 6 * 1024 * 1024


def _decode_data_url(value: str, limit: int) -> tuple[bytes, str]:
    """Pull the bytes out of a data: URL, refusing anything oversized."""
    if not value.startswith("data:"):
        raise HTTPException(422, "Expected a data URL")
    header, _, payload = value.partition(",")
    if ";base64" not in header:
        raise HTTPException(422, "Expected base64 image data")
    mime = header[5:].split(";")[0] or "image/png"
    if mime not in {"image/png", "image/jpeg", "image/webp"}:
        raise HTTPException(422, "PNG, JPEG or WebP only")
    # 4 base64 chars carry 3 bytes: check the length before allocating.
    if len(payload) // 4 * 3 > limit:
        raise HTTPException(413, "That image is too large")
    try:
        raw = base64.b64decode(payload, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(422, "Malformed image data") from None
    if len(raw) > limit:
        raise HTTPException(413, "That image is too large")
    return raw, mime


def _card(row: sqlite3.Row, liked: bool) -> dict:
    # A photo post has no chart behind it, so every pattern field here can be
    # empty. Read through helpers rather than indexing the row directly: the old
    # version passed `row["thread_codes"]` straight to json.loads, which raises
    # TypeError on None — one photo in the gallery would have taken down the whole
    # listing, not just its own card.
    codes = json.loads(row["thread_codes"]) if row["thread_codes"] else []
    palette = json.loads(row["palette"]) if row["palette"] else codes
    return {
        "id": row["id"],
        "title": row["title"],
        "category": row["category"],
        "kind": row["kind"],
        # None for a photo post, and the client branches on `kind` rather than on
        # these being absent: "no size" and "size not sent yet" would look alike.
        "width": row["width"],
        "height": row["height"],
        "threadCount": len(codes),
        # Most-stitched first, and more than the card shows: the client keeps the
        # five that are actually distinguishable, which needs candidates to spare.
        "palette": palette[:10],
        "likeCount": row["like_count"],
        "liked": liked,
        "createdAt": row["created_at"],
        "hasPhoto": row["photo"] is not None if "photo" in row.keys() else bool(row["has_photo"]),
        # Told rather than discovered: without this the card fires a request
        # that 404s and the browser paints a broken-image icon.
        "hasThumb": row["thumb_png"] is not None
        if "thumb_png" in row.keys()
        else bool(row["has_thumb"]),
        "author": {
            "id": row["author_id"],
            "displayName": row["display_name"],
            "icon": row["icon"],
            # Every query feeding this joins `u.role` in for it. Same field
            # `public_user` hands out, so a card and a profile agree about who is
            # wearing the flower.
            "isAdmin": row["role"] == "admin",
        },
    }


@router.get("/posts")
def list_posts(
    request: Request,
    category: str = "all",
    sort: str = "new",
    page: int = 0,
    kind: str = "all",
) -> JSONResponse:
    user = auth.current_user(request)
    clauses: list[str] = []
    params: list = []
    # `kind` defaults to "all" so an older client — or a bookmarked API call —
    # keeps seeing everything rather than silently losing half the gallery.
    if kind != "all":
        if kind not in KINDS:
            raise HTTPException(422, "Unknown kind")
        clauses.append("p.kind = ?")
        params.append(kind)
    if category != "all":
        if category not in CATEGORIES:
            raise HTTPException(422, "Unknown category")
        clauses.append("p.category = ?")
        params.append(category)
    where = "WHERE " + " AND ".join(clauses) if clauses else ""

    order = "p.like_count DESC, p.created_at DESC" if sort == "top" else "p.created_at DESC"
    page = max(0, min(page, 500))

    rows = connect().execute(
        f"""
        SELECT p.id, p.title, p.category, p.kind, p.width, p.height, p.thread_codes,
               p.like_count, p.created_at, p.author_id, p.palette,
               p.photo IS NOT NULL AS has_photo,
               p.thumb_png IS NOT NULL AS has_thumb,
               u.display_name, u.icon, u.role,
               EXISTS(SELECT 1 FROM post_likes l WHERE l.post_id = p.id AND l.user_id = ?) AS liked
        FROM posts p JOIN users u ON u.id = p.author_id
        {where}
        ORDER BY {order}
        LIMIT ? OFFSET ?
        """,
        [user["id"] if user else -1, *params, PAGE_SIZE + 1, page * PAGE_SIZE],
    ).fetchall()

    # Ask for one more than the page to know whether a "show more" is warranted,
    # without a second COUNT(*) over the table.
    has_more = len(rows) > PAGE_SIZE
    return JSONResponse(
        {
            "posts": [_card(r, bool(r["liked"])) for r in rows[:PAGE_SIZE]],
            "hasMore": has_more,
        }
    )


@router.get("/posts/{post_id}")
def get_post(post_id: int, request: Request) -> JSONResponse:
    user = auth.current_user(request)
    row = connect().execute(
        """
        SELECT p.*, u.display_name, u.icon, u.role,
               EXISTS(SELECT 1 FROM post_likes l WHERE l.post_id = p.id AND l.user_id = ?) AS liked
        FROM posts p JOIN users u ON u.id = p.author_id WHERE p.id = ?
        """,
        (user["id"] if user else -1, post_id),
    ).fetchone()
    if not row:
        raise HTTPException(404, "No such piece")

    card = _card(row, bool(row["liked"]))
    # Only a single post ships the full grid — 30 000 cells on every gallery
    # card would be megabytes per page. Null for a photo post, which the client
    # already handles: it builds `pattern` from `cells` and gets null.
    card["cells"] = row["cells"]
    card["threadCodes"] = json.loads(row["thread_codes"]) if row["thread_codes"] else None
    return JSONResponse(card)


@router.get("/posts/{post_id}/thumb")
def get_thumb(post_id: int) -> Response:
    row = connect().execute("SELECT thumb_png FROM posts WHERE id = ?", (post_id,)).fetchone()
    if not row or row["thumb_png"] is None:
        raise HTTPException(404, "No thumbnail")
    return Response(
        row["thumb_png"],
        media_type="image/png",
        # Immutable: a post's thumbnail never changes, only the post is deleted.
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


@router.get("/posts/{post_id}/share.png")
def get_share_card(post_id: int) -> Response:
    """The Open Graph image for one piece.

    Drawn here rather than in the browser because the only readers of it are scrapers,
    and none of them runs JavaScript. See api/sharecard.py for why there is a PNG
    encoder in this codebase.
    """
    row = connect().execute(
        "SELECT kind, cells, thread_codes, width, height, photo, photo_mime"
        " FROM posts WHERE id = ?",
        (post_id,),
    ).fetchone()
    if not row:
        raise HTTPException(404, "No such piece")

    # A photo post has no grid to draw, and this box has no image library to crop
    # its photo to 1.91:1 with — that is why sharecard.py encodes a PNG by hand.
    # So the photo *is* the card, at whatever shape it was taken in, and the
    # scrapers apply their own crop as they already do to any oversized image.
    if row["kind"] == "photo" or row["cells"] is None:
        if row["photo"] is None:
            raise HTTPException(404, "No share image")
        return Response(
            row["photo"],
            media_type=row["photo_mime"] or "image/jpeg",
            headers={"Cache-Control": "public, max-age=31536000, immutable"},
        )

    card = sharecard.render_card(row["cells"], row["thread_codes"], row["width"], row["height"])
    return Response(
        card,
        media_type="image/png",
        # Immutable, like the thumbnail: a piece's grid never changes once published.
        # Which matters more here than elsewhere — scrapers cache aggressively and
        # some of them never come back.
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


@router.get("/posts/{post_id}/photo")
def get_photo(post_id: int) -> Response:
    row = connect().execute("SELECT photo, photo_mime FROM posts WHERE id = ?", (post_id,)).fetchone()
    if not row or row["photo"] is None:
        raise HTTPException(404, "No photo")
    return Response(
        row["photo"],
        media_type=row["photo_mime"] or "image/jpeg",
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


def _check_daily_limit(conn: sqlite3.Connection, user: sqlite3.Row) -> None:
    """Refuse a sixth piece in twenty-four hours.

    Called from inside the same transaction as the insert, which is the only place
    it is correct: counted before `BEGIN IMMEDIATE`, five requests arriving
    together would each find four and each add one. `idx_posts_author` covers the
    (author, time) lookup, so this is an index range scan and not a table scan.

    Nobody is exempt, admins included. An exemption would be a second code path
    that only two accounts ever take — which makes it the path nobody notices is
    broken — and the two people who run the gallery are also the two who should be
    living under its rules. If five a day turns out to be too few, the number to
    change is above, for everyone.

    The 429 carries a body the client can act on rather than a sentence it would
    have to parse: which limit was hit, and how many minutes until the oldest of
    the five falls out of the window. Every message a member reads is written in
    their own language on the other side, and this module has no locale.
    """
    row = conn.execute(
        "SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM posts"
        " WHERE author_id = ? AND created_at > ?",
        (user["id"], now_ms() - DAY_MS),
    ).fetchone()
    if row["n"] < DAILY_POST_LIMIT:
        return

    wait_ms = max(0, int(row["oldest"]) + DAY_MS - now_ms())
    raise HTTPException(
        429,
        {
            "code": "daily-limit",
            "limit": DAILY_POST_LIMIT,
            # Rounded up, so "1 minute" never means "any moment now, try again".
            "retryInMinutes": -(-wait_ms // 60_000),
        },
    )


def _read_pattern(body: dict) -> dict:
    """The chart fields of a pattern post, validated together.

    Split out of publish() when photo posts arrived: publish() now decides which of
    two shapes it is looking at, and this is one of them. Returns the columns ready
    for the insert, or raises — never a half-checked grid.
    """
    try:
        width = int(body["width"])
        height = int(body["height"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(422, "Missing pattern size") from None
    if not (1 <= width <= 400 and 1 <= height <= 400) or width * height > MAX_CELLS:
        raise HTTPException(422, "That pattern is out of range")

    codes = body.get("threadCodes")
    if not isinstance(codes, list) or not 1 <= len(codes) <= MAX_THREADS:
        raise HTTPException(422, "Missing thread list")
    codes = [str(c)[:16] for c in codes]

    cells = str(body.get("cells", ""))
    try:
        raw_cells = base64.b64decode(cells, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(422, "Malformed pattern data") from None
    # One byte per stitch, so the grid and its declared size must agree — this
    # is what stops a crafted body from claiming 40 000 stitches in 12 bytes.
    if len(raw_cells) != width * height:
        raise HTTPException(422, "Pattern data does not match its size")
    if max(raw_cells, default=0) > len(codes):
        raise HTTPException(422, "Pattern references a thread that isn't listed")

    thumb = body.get("thumbnail")
    return {
        "width": width,
        "height": height,
        "cells": cells,
        "thread_codes": json.dumps(codes),
        "palette": json.dumps(usage_order(cells, codes)),
        "thumb_png": _decode_data_url(thumb, MAX_THUMB_BYTES)[0] if thumb else None,
    }


#: What a photo post leaves empty. Spelled out rather than left to the schema's
#: defaults, so the insert below stays one statement for both kinds of post.
_NO_PATTERN = {
    "width": None,
    "height": None,
    "cells": None,
    "thread_codes": None,
    "palette": None,
    "thumb_png": None,
}


def _insert_post(user: sqlite3.Row, title: str, category: str, fields: dict) -> int:
    """One id, and never a recycled one.

    SQLite's INTEGER PRIMARY KEY hands the next insert the id of the highest
    deleted row. That made a link someone shared quietly point at a different
    piece later, and — because the thumbnail is served immutable on a URL keyed
    by the id — let a browser show the deleted post's picture under the new
    post's id. `app_meta` remembers the highest id ever used, so it cannot
    happen again. Read and written inside the same immediate transaction as the
    insert, so two publishes cannot settle on the same number.
    """
    conn = connect()
    conn.execute("BEGIN IMMEDIATE")
    try:
        _check_daily_limit(conn, user)

        row = conn.execute(
            "SELECT MAX(next) AS next FROM ("
            "  SELECT COALESCE(MAX(id), 0) AS next FROM posts"
            "  UNION ALL"
            "  SELECT COALESCE(value, 0) FROM app_meta WHERE key = 'posts_seq'"
            ")"
        ).fetchone()
        post_id = int(row["next"] or 0) + 1

        conn.execute(
            """
            INSERT INTO posts (id, author_id, title, category, kind, width, height,
                               cells, thread_codes, palette, thumb_png, photo,
                               photo_mime, created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                post_id,
                user["id"],
                title,
                category,
                fields["kind"],
                fields["width"],
                fields["height"],
                fields["cells"],
                fields["thread_codes"],
                fields["palette"],
                fields["thumb_png"],
                fields["photo"],
                fields["photo_mime"],
                now_ms(),
            ),
        )
        conn.execute(
            "INSERT INTO app_meta (key, value) VALUES ('posts_seq', ?)"
            " ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (post_id,),
        )
        conn.execute("COMMIT")
    except Exception:
        conn.execute("ROLLBACK")
        raise
    return post_id


@router.post("/posts")
async def publish(request: Request) -> JSONResponse:
    """Publish a chart, or a photo of a finished piece.

    Two shapes down one route rather than two routes: the title, the category, the
    daily limit, the id allocation and the row are identical, and only the payload
    differs. `kind` says which, and defaults to 'pattern' — the shape every client
    sent before photo posts existed.
    """
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Sign in to share a piece")

    body = await request.json()

    title = str(body.get("title", "")).strip()
    if not 2 <= len(title) <= MAX_TITLE:
        raise HTTPException(422, f"A title is between 2 and {MAX_TITLE} characters")

    category = str(body.get("category", "other"))
    if category not in CATEGORIES:
        raise HTTPException(422, "Unknown category")

    kind = str(body.get("kind", "pattern"))
    if kind not in KINDS:
        raise HTTPException(422, "Unknown kind")

    photo = body.get("photo")
    photo_bytes, photo_mime = _decode_data_url(photo, MAX_PHOTO_BYTES) if photo else (None, None)

    if kind == "photo":
        # The photo is the entire post, so its absence is not a missing extra —
        # there would be nothing left to look at. Any chart fields in the body are
        # ignored rather than rejected: a photo post is defined by what it has.
        if photo_bytes is None:
            raise HTTPException(422, "A photo of your work is the post")
        fields = dict(_NO_PATTERN)
    else:
        fields = _read_pattern(body)

    fields.update(kind=kind, photo=photo_bytes, photo_mime=photo_mime)
    return JSONResponse({"id": _insert_post(user, title, category, fields)}, status_code=201)


@router.post("/posts/{post_id}/like")
def toggle_like(post_id: int, request: Request) -> JSONResponse:
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Sign in to like a piece")

    conn = connect()
    if not conn.execute("SELECT 1 FROM posts WHERE id = ?", (post_id,)).fetchone():
        raise HTTPException(404, "No such piece")

    # like_count is denormalised so the "top" ordering is an index scan rather
    # than a join and a count. It is only ever moved in step with the row here.
    existing = conn.execute(
        "SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?", (post_id, user["id"])
    ).fetchone()

    conn.execute("BEGIN IMMEDIATE")
    try:
        if existing:
            conn.execute(
                "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?", (post_id, user["id"])
            )
            conn.execute(
                "UPDATE posts SET like_count = MAX(0, like_count - 1) WHERE id = ?", (post_id,)
            )
        else:
            conn.execute(
                "INSERT INTO post_likes (post_id, user_id, created_at) VALUES (?,?,?)",
                (post_id, user["id"], now_ms()),
            )
            conn.execute("UPDATE posts SET like_count = like_count + 1 WHERE id = ?", (post_id,))
        conn.execute("COMMIT")
    except Exception:
        conn.execute("ROLLBACK")
        raise

    row = conn.execute("SELECT like_count FROM posts WHERE id = ?", (post_id,)).fetchone()
    return JSONResponse({"liked": not existing, "likeCount": row["like_count"]})


@router.delete("/posts/{post_id}")
def delete_post(post_id: int, request: Request) -> JSONResponse:
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Sign in first")

    row = connect().execute("SELECT author_id FROM posts WHERE id = ?", (post_id,)).fetchone()
    if not row:
        raise HTTPException(404, "No such piece")
    if row["author_id"] != user["id"] and user["role"] != "admin":
        raise HTTPException(403, "That isn't yours")

    connect().execute("DELETE FROM posts WHERE id = ?", (post_id,))
    return JSONResponse({"ok": True})


@router.get("/posts/{post_id}/comments")
def list_comments(post_id: int) -> JSONResponse:
    """The conversation under a piece, oldest first.

    Public: reading the gallery has never needed an account, and that includes
    what people said about a piece.
    """
    conn = connect()
    if not conn.execute("SELECT 1 FROM posts WHERE id = ?", (post_id,)).fetchone():
        raise HTTPException(404, "No such piece")

    rows = conn.execute(
        """
        SELECT c.id, c.body, c.created_at, u.id AS uid, u.display_name, u.icon, u.role
        FROM comments c
        JOIN users u ON u.id = c.author_id
        WHERE c.post_id = ? AND u.banned_at IS NULL
        ORDER BY c.created_at
        """,
        (post_id,),
    ).fetchall()

    return JSONResponse(
        {
            "comments": [
                {
                    "id": r["id"],
                    "body": r["body"],
                    "createdAt": r["created_at"],
                    "author": {
                        "id": r["uid"],
                        "displayName": r["display_name"],
                        "icon": r["icon"],
                        "isAdmin": r["role"] == "admin",
                    },
                }
                for r in rows
            ]
        }
    )


@router.post("/posts/{post_id}/comments")
async def add_comment(post_id: int, request: Request) -> JSONResponse:
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Sign in to leave a comment")

    payload = await request.json()
    body = str(payload.get("body") or "").strip()
    if not body:
        raise HTTPException(422, "Write something first")
    if len(body) > MAX_COMMENT:
        raise HTTPException(422, f"Comments are limited to {MAX_COMMENT} characters")

    conn = connect()
    if not conn.execute("SELECT 1 FROM posts WHERE id = ?", (post_id,)).fetchone():
        raise HTTPException(404, "No such piece")

    when = now_ms()
    cur = conn.execute(
        "INSERT INTO comments (post_id, author_id, body, created_at) VALUES (?,?,?,?)",
        (post_id, user["id"], body, when),
    )
    # Returned whole so the client can append it without refetching the thread.
    return JSONResponse(
        {
            "id": cur.lastrowid,
            "body": body,
            "createdAt": when,
            "author": auth.public_user(user),
        },
        status_code=201,
    )


@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: int, request: Request) -> JSONResponse:
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Sign in first")

    conn = connect()
    row = conn.execute("SELECT author_id FROM comments WHERE id = ?", (comment_id,)).fetchone()
    if not row:
        raise HTTPException(404, "No such comment")
    if row["author_id"] != user["id"] and user["role"] != "admin":
        raise HTTPException(403, "That isn't yours")

    conn.execute("DELETE FROM comments WHERE id = ?", (comment_id,))
    return JSONResponse({"ok": True})


@router.get("/users/{user_id}")
def get_profile(user_id: int, request: Request) -> JSONResponse:
    """A member and everything they have published."""
    viewer = auth.current_user(request)
    conn = connect()

    who = conn.execute(
        "SELECT * FROM users WHERE id = ? AND banned_at IS NULL", (user_id,)
    ).fetchone()
    if not who:
        raise HTTPException(404, "No such member")

    rows = conn.execute(
        """
        SELECT p.id, p.title, p.category, p.width, p.height, p.thread_codes,
               p.like_count, p.created_at, p.author_id, p.palette,
               p.photo IS NOT NULL AS has_photo,
               p.thumb_png IS NOT NULL AS has_thumb,
               u.display_name, u.icon, u.role,
               EXISTS(SELECT 1 FROM post_likes l WHERE l.post_id = p.id AND l.user_id = ?) AS liked
        FROM posts p JOIN users u ON u.id = p.author_id
        WHERE p.author_id = ?
        ORDER BY p.created_at DESC
        LIMIT 60
        """,
        (viewer["id"] if viewer else -1, user_id),
    ).fetchall()

    return JSONResponse(
        {
            "user": auth.public_user(who),
            "joinedAt": who["created_at"],
            "posts": [_card(r, bool(r["liked"])) for r in rows],
            # Sum of hearts received, which is the number a maker cares about.
            "totalLikes": sum(r["like_count"] for r in rows),
        }
    )
