"""Flagging a post, and the queue an admin reads.

Why this exists at all: a pattern post is bounded by what the converter can make,
so the worst it can be is ugly. A photo post is whatever somebody uploaded. That
is the trade for letting people show work stitched from a chart bought elsewhere,
and it needs a way to say "look at this one" that is not a message to the owner.

It lives in its own module rather than in routes_gallery.py, which is already long
enough that finding the publish path in it is a scroll.

Deliberately small: report, list, dismiss. Deleting a reported post is the
existing DELETE /posts/{id} — an admin already has that, and the cascade takes the
reports with the row.
"""

import sqlite3

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

from . import auth
from .db import connect, now_ms

router = APIRouter(prefix="/api")

MAX_REASON = 300
#: The reasons offered in the interface. Free text is accepted too — somebody will
#: always have a fifth reason — but these are what the buttons send, so the queue
#: groups instead of being three hundred unique sentences.
REASONS = {"not-mine", "explicit", "spam", "off-topic", "other"}


def _require_admin(request: Request) -> sqlite3.Row:
    """The same check delete_post makes, for the same reason.

    `users.role` is never written by this process — only by `ptd-panel`, from a
    shell on the box — so this reads a value no request body can influence.
    """
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Sign in first")
    if user["role"] != "admin":
        # 404 rather than 403: an endpoint that answers "forbidden" has confirmed
        # it exists, and this one has nothing to gain from being discoverable.
        raise HTTPException(404, "Not found")
    return user


@router.post("/posts/{post_id}/report")
async def report_post(post_id: int, request: Request) -> JSONResponse:
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Sign in to report a piece")

    body = await request.json()
    reason = str(body.get("reason", "other")).strip()[:MAX_REASON]
    if not reason:
        reason = "other"

    conn = connect()
    if not conn.execute("SELECT 1 FROM posts WHERE id = ?", (post_id,)).fetchone():
        raise HTTPException(404, "No such piece")

    # One row per member per post, and a second report replaces the first rather
    # than failing: somebody who reports again is correcting their reason, not
    # voting twice, and an error at that point reads as "your report didn't work".
    conn.execute(
        "INSERT INTO reports (post_id, reporter_id, reason, created_at) VALUES (?,?,?,?)"
        " ON CONFLICT(post_id, reporter_id) DO UPDATE SET"
        "   reason = excluded.reason, created_at = excluded.created_at",
        (post_id, user["id"], reason, now_ms()),
    )
    return JSONResponse({"ok": True})


@router.get("/reports")
def list_reports(request: Request) -> JSONResponse:
    """The queue, newest first, one entry per report.

    Not grouped by post: two people reporting the same photo for different reasons
    is two things to read, and the count is visible from the repetition.
    """
    _require_admin(request)
    rows = connect().execute(
        """
        SELECT r.post_id, r.reason, r.created_at,
               p.title, p.kind, p.author_id,
               a.display_name AS author_name,
               u.display_name AS reporter_name
        FROM reports r
        JOIN posts p ON p.id = r.post_id
        JOIN users a ON a.id = p.author_id
        JOIN users u ON u.id = r.reporter_id
        ORDER BY r.created_at DESC
        LIMIT 200
        """
    ).fetchall()
    return JSONResponse(
        {
            "reports": [
                {
                    "postId": r["post_id"],
                    "reason": r["reason"],
                    "createdAt": r["created_at"],
                    "title": r["title"],
                    "kind": r["kind"],
                    "authorId": r["author_id"],
                    "authorName": r["author_name"],
                    "reporterName": r["reporter_name"],
                }
                for r in rows
            ]
        }
    )


@router.delete("/reports/{post_id}")
def dismiss_reports(post_id: int, request: Request) -> JSONResponse:
    """Clear a post's reports without touching the post.

    The other outcome — the post goes — is DELETE /posts/{id}, and its cascade
    removes these rows. This is the verdict "I looked, it's fine", which otherwise
    has no way to be recorded and leaves the queue growing forever.
    """
    _require_admin(request)
    cur = connect().execute("DELETE FROM reports WHERE post_id = ?", (post_id,))
    return JSONResponse({"cleared": cur.rowcount})
