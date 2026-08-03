"""Sessions.

The cookie carries an opaque 256-bit random token. The database stores only its
SHA-256, so a stolen backup yields no usable session — the same reasoning as a
password hash, applied to session tokens.
"""

import hashlib
import secrets
import sqlite3
from typing import Optional

from fastapi import Request, Response

from . import config
from .db import connect, now_ms

SESSION_TTL_MS = config.SESSION_TTL_DAYS * 24 * 3600 * 1000


def _hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def start_session(response: Response, user_id: int) -> None:
    token = secrets.token_urlsafe(32)
    connect().execute(
        "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?,?,?,?)",
        (_hash(token), user_id, now_ms(), now_ms() + SESSION_TTL_MS),
    )
    response.set_cookie(
        config.SESSION_COOKIE,
        token,
        max_age=SESSION_TTL_MS // 1000,
        httponly=True,
        # lax, not strict: the Google callback is a cross-site GET landing back
        # here, and strict would drop the cookie we just set.
        samesite="lax",
        secure=config.COOKIE_SECURE,
        path="/",
    )


def end_session(request: Request, response: Response) -> None:
    token = request.cookies.get(config.SESSION_COOKIE)
    if token:
        connect().execute("DELETE FROM sessions WHERE token_hash = ?", (_hash(token),))
    response.delete_cookie(config.SESSION_COOKIE, path="/")


def current_user(request: Request) -> Optional[sqlite3.Row]:
    """The signed-in user, or None. Banned accounts read as signed out."""
    token = request.cookies.get(config.SESSION_COOKIE)
    if not token:
        return None
    return connect().execute(
        """
        SELECT u.* FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ? AND s.expires_at > ? AND u.banned_at IS NULL
        """,
        (_hash(token), now_ms()),
    ).fetchone()


def public_user(row: sqlite3.Row) -> dict:
    """What the client is allowed to know about an account.

    Deliberately narrow: no e-mail, no role, no timestamps. The gallery only
    needs a name and a face, and anything more would be a needless disclosure
    on every card.
    """
    return {
        "id": row["id"],
        "displayName": row["display_name"],
        "avatarUrl": row["avatar_url"],
    }


def me_payload(row: sqlite3.Row) -> dict:
    """Extra fields the account owner may see about themselves."""
    return {
        **public_user(row),
        "email": row["email"],
        "isAdmin": row["role"] == "admin",
    }
