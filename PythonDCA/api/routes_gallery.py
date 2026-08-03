"""Gallery: publishing a finished piece, listing, liking."""

import base64
import binascii
import json
import sqlite3

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse

from . import auth
from .db import connect, now_ms

router = APIRouter(prefix="/api")

CATEGORIES = {"pets", "portraits", "flowers", "landscapes", "little", "other"}

PAGE_SIZE = 12
MAX_TITLE = 80
MAX_THREADS = 64
MAX_CELLS = 200 * 200
# A pattern thumbnail is a few kB; the hoop photo is the one that can be big.
MAX_THUMB_BYTES = 256 * 1024
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
    return {
        "id": row["id"],
        "title": row["title"],
        "category": row["category"],
        "width": row["width"],
        "height": row["height"],
        "threadCount": len(json.loads(row["thread_codes"])),
        "palette": json.loads(row["thread_codes"])[:5],
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
            "avatarUrl": row["avatar_url"],
        },
    }


@router.get("/posts")
def list_posts(request: Request, category: str = "all", sort: str = "new", page: int = 0) -> JSONResponse:
    user = auth.current_user(request)
    where = ""
    params: list = []
    if category != "all":
        if category not in CATEGORIES:
            raise HTTPException(422, "Unknown category")
        where = "WHERE p.category = ?"
        params.append(category)

    order = "p.like_count DESC, p.created_at DESC" if sort == "top" else "p.created_at DESC"
    page = max(0, min(page, 500))

    rows = connect().execute(
        f"""
        SELECT p.id, p.title, p.category, p.width, p.height, p.thread_codes,
               p.like_count, p.created_at, p.author_id,
               p.photo IS NOT NULL AS has_photo,
               p.thumb_png IS NOT NULL AS has_thumb,
               u.display_name, u.avatar_url,
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
        SELECT p.*, u.display_name, u.avatar_url,
               EXISTS(SELECT 1 FROM post_likes l WHERE l.post_id = p.id AND l.user_id = ?) AS liked
        FROM posts p JOIN users u ON u.id = p.author_id WHERE p.id = ?
        """,
        (user["id"] if user else -1, post_id),
    ).fetchone()
    if not row:
        raise HTTPException(404, "No such piece")

    card = _card(row, bool(row["liked"]))
    # Only a single post ships the full grid — 30 000 cells on every gallery
    # card would be megabytes per page.
    card["cells"] = row["cells"]
    card["threadCodes"] = json.loads(row["thread_codes"])
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


@router.post("/posts")
async def publish(request: Request) -> JSONResponse:
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
    thumb_bytes = _decode_data_url(thumb, MAX_THUMB_BYTES)[0] if thumb else None

    photo = body.get("photo")
    photo_bytes, photo_mime = _decode_data_url(photo, MAX_PHOTO_BYTES) if photo else (None, None)

    conn = connect()
    cur = conn.execute(
        """
        INSERT INTO posts (author_id, title, category, width, height, cells,
                           thread_codes, thumb_png, photo, photo_mime, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
        """,
        (
            user["id"],
            title,
            category,
            width,
            height,
            cells,
            json.dumps(codes),
            thumb_bytes,
            photo_bytes,
            photo_mime,
            now_ms(),
        ),
    )
    return JSONResponse({"id": int(cur.lastrowid or 0)}, status_code=201)


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
               p.like_count, p.created_at, p.author_id,
               p.photo IS NOT NULL AS has_photo,
               p.thumb_png IS NOT NULL AS has_thumb,
               u.display_name, u.avatar_url,
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
