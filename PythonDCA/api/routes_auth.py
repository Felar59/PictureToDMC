"""Sign-in routes."""

import secrets
import urllib.error

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse

from . import auth, config, google
from .db import connect, now_ms

router = APIRouter(prefix="/api/auth")

# The state cookie only has to survive the round trip to Google.
STATE_COOKIE = "ptd_oauth_state"
STATE_TTL_SECONDS = 600


@router.get("/google/start")
def google_start(next: str = "/gallery") -> Response:
    if not config.GOOGLE_ENABLED:
        raise HTTPException(503, "Google sign-in is not configured")

    # CSRF: a random value goes out in the URL and into a cookie; the callback
    # only proceeds if the two agree. Without it, an attacker could feed the
    # victim's browser their own authorization code.
    state = secrets.token_urlsafe(24)

    # Only site-relative destinations, so ?next= can't become an open redirect
    # to somebody else's domain.
    destination = next if next.startswith("/") and not next.startswith("//") else "/gallery"

    response = RedirectResponse(google.auth_url(state), status_code=307)
    response.set_cookie(
        STATE_COOKIE,
        f"{state}|{destination}",
        max_age=STATE_TTL_SECONDS,
        httponly=True,
        samesite="lax",
        secure=config.COOKIE_SECURE,
        path="/api/auth",
    )
    return response


@router.get("/google/callback")
def google_callback(request: Request, code: str | None = None, state: str | None = None) -> Response:
    cookie = request.cookies.get(STATE_COOKIE) or ""
    expected, _, destination = cookie.partition("|")
    destination = destination or "/gallery"

    def fail(reason: str) -> Response:
        # Land the user back on the site with a flag the UI can explain, rather
        # than showing them a bare JSON error.
        out = RedirectResponse(f"/gallery?signin=failed&reason={reason}", status_code=303)
        out.delete_cookie(STATE_COOKIE, path="/api/auth")
        return out

    if not code or not state or not expected or not secrets.compare_digest(state, expected):
        return fail("state")

    try:
        identity = google.exchange_code(code)
    except (urllib.error.URLError, ValueError, OSError):
        return fail("google")

    conn = connect()
    existing = conn.execute(
        "SELECT user_id FROM oauth_accounts WHERE provider = 'google' AND provider_uid = ?",
        (identity.sub,),
    ).fetchone()

    if existing:
        user_id = existing["user_id"]
        # Keep the name fresh, but never touch `role`.
        conn.execute(
            "UPDATE users SET display_name = ?, email = ? WHERE id = ?",
            (identity.name or "Brodeur·se", identity.email, user_id),
        )
    else:
        cur = conn.execute(
            "INSERT INTO users (display_name, email, created_at) VALUES (?,?,?)",
            (identity.name or "Brodeur·se", identity.email, now_ms()),
        )
        user_id = int(cur.lastrowid or 0)
        conn.execute(
            "INSERT INTO oauth_accounts (provider, provider_uid, user_id) VALUES ('google', ?, ?)",
            (identity.sub, user_id),
        )

    banned = conn.execute("SELECT banned_at FROM users WHERE id = ?", (user_id,)).fetchone()
    if banned and banned["banned_at"] is not None:
        return fail("banned")

    response = RedirectResponse(destination, status_code=303)
    response.delete_cookie(STATE_COOKIE, path="/api/auth")
    auth.start_session(response, user_id)
    return response


@router.get("/me")
def me(request: Request) -> JSONResponse:
    user = auth.current_user(request)
    return JSONResponse(
        {
            "user": auth.me_payload(user) if user else None,
            "googleEnabled": config.GOOGLE_ENABLED,
        }
    )


@router.post("/logout")
def logout(request: Request) -> Response:
    response = JSONResponse({"ok": True})
    auth.end_session(request, response)
    return response


MAX_NAME = 40
MAX_BIO = 300


@router.patch("/me")
async def update_me(request: Request) -> JSONResponse:
    """Change the name, the bio, or the chosen mark.

    The name starts as whatever Google reports, which is why this exists at all:
    plenty of people do not want their legal name on a craft gallery. Any field
    left out of the body is left alone, so the same endpoint serves the one-time
    "choose a name" step and a later edit of the bio.

    Saving anything through here counts as having set the account up, which is
    what stops the client asking for a name a second time.
    """
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Sign in first")

    body = await request.json()
    if not isinstance(body, dict):
        raise HTTPException(422, "Expected an object")

    sets: list[str] = []
    values: list[object] = []

    if "displayName" in body:
        name = str(body.get("displayName") or "").strip()
        if not 2 <= len(name) <= MAX_NAME:
            raise HTTPException(422, f"A name is between 2 and {MAX_NAME} characters")
        sets.append("display_name = ?")
        values.append(name)

    if "bio" in body:
        bio = str(body.get("bio") or "").strip()
        if len(bio) > MAX_BIO:
            raise HTTPException(422, f"A bio is at most {MAX_BIO} characters")
        sets.append("bio = ?")
        # Empty means none, rather than a stored blank that renders as a gap.
        values.append(bio or None)

    if "icon" in body:
        icon = str(body.get("icon") or "").strip()
        if len(icon) > 32:
            raise HTTPException(422, "Unknown mark")
        sets.append("icon = ?")
        values.append(icon or None)

    if not sets:
        raise HTTPException(422, "Nothing to change")

    sets.append("setup_at = ?")
    values.append(now_ms())
    values.append(user["id"])

    conn = connect()
    conn.execute(f"UPDATE users SET {', '.join(sets)} WHERE id = ?", values)
    fresh = conn.execute("SELECT * FROM users WHERE id = ?", (user["id"],)).fetchone()
    return JSONResponse({"user": auth.me_payload(fresh)})
