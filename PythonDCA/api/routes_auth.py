"""Sign-in routes."""

import secrets
import unicodedata
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


#: The picture marks this server ships, and the prefix that marks one.
#:
#: Generated from frontend/public/marks by scripts/export-marks.py, so the list
#: cannot claim a file that is not there — the failure otherwise is a member
#: choosing a mark that 404s on every page they appear on.
MARK_PREFIX = "m:"
MARK_SLUGS = {
    "mikegz",
    "wyxina",
    "reinis",
    "marta",
    "tarikulraana",
    "badesaba",
    "berlinerlights",
    "cacito",
    "di",
    "cafer",
    "lucas",
    "paulo",
    "rumeysasurucu",
    "vinnyanugraha",
    "adrijana",
    "ellie",
    "ponvintage",
}

MAX_NAME = 40
MAX_BIO = 300

# Names nobody may take, because an admin now wears a visible badge and a member
# called "Admin" would be borrowing it.
#
# This is not a security boundary — the flower is drawn from `users.role`, which no
# request can touch, so a member named "Modérateur" gains exactly nothing. It just
# closes the cheapest impersonation: someone reading a stern comment should not have
# to check the badge to know whether the name is claiming something.
#
# `display_name` is not unique and is not going to be (people collide), so this is
# a small list of exact matches rather than an attempt at policing names.
RESERVED_NAMES = frozenset(
    {
        "admin",
        "admins",
        "administrateur",
        "administratrice",
        "administrator",
        "moderateur",
        "moderatrice",
        "moderator",
        "mod",
        "staff",
        "equipe",
        "support",
        "picturetodmc",
    }
)


def _fold(name: str) -> str:
    """Lowercase, accents dropped, everything but letters and digits removed.

    So "A d m i n", "ADMIN.", "Admín" and "-admin-" all fold to the same string.
    Without the folding, the list would be a speed bump measured in keystrokes.

    Homoglyphs still get through — "admın" with a dotless ı, or a Cyrillic а — and
    that is accepted rather than overlooked. Chasing them means a confusables table
    and a stream of false positives for people whose names are not in this
    alphabet, to defend a badge that grants nothing.
    """
    decomposed = unicodedata.normalize("NFKD", name.casefold())
    return "".join(c for c in decomposed if c.isalnum())


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
        if _fold(name) in RESERVED_NAMES:
            # A code, not a sentence: the client writes this one in the member's
            # own language, and "try again" would be the wrong advice — retrying
            # the same name will fail the same way.
            raise HTTPException(422, {"code": "reserved-name"})
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
        # A picture mark names a file this server hands out, so it is checked
        # against the list rather than trusted for its shape. Without that, `icon`
        # is a free string that ends up inside an <img src> on every card the
        # member has ever posted on, and "m:../../something" is a request the
        # browser would happily make.
        if icon.startswith(MARK_PREFIX) and icon[len(MARK_PREFIX):] not in MARK_SLUGS:
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


@router.get("/me/summary")
def me_summary(request: Request) -> JSONResponse:
    """What deleting this account would take with it.

    The confirmation dialog quotes these back before anything happens. A prompt
    that says "everything" makes someone guess how much everything is; one that
    says "vos 4 grilles et vos 12 commentaires" is the same warning with the fear
    taken out of it, and it lets someone notice the number is wrong before they
    agree rather than after.
    """
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Not signed in")
    conn = connect()
    one = lambda sql: conn.execute(sql, (user["id"],)).fetchone()[0]  # noqa: E731
    return JSONResponse(
        {
            "posts": one("SELECT COUNT(*) FROM posts WHERE author_id = ?"),
            "comments": one("SELECT COUNT(*) FROM comments WHERE author_id = ?"),
            "likesGiven": one("SELECT COUNT(*) FROM post_likes WHERE user_id = ?"),
        }
    )


@router.delete("/me")
def delete_me(request: Request) -> Response:
    """Erase this account and everything attached to it.

    The privacy page promises "sa suppression complète — compte, publications et
    commentaires", so that is exactly what this does rather than anonymising: a
    page that says one thing while the code does another is the failure mode that
    whole page exists to avoid.

    Every table that references `users` cascades, and `PRAGMA foreign_keys` is ON
    for every connection, so one DELETE clears oauth_accounts, sessions, posts,
    post_likes, comments and reports. Deleted post ids are never reissued —
    `app_meta` keeps the high-water mark — so a shared link to a piece that is gone
    stays gone rather than landing on a stranger's work.

    The one thing the cascade cannot do on its own is the line above it. Hearts this
    member gave to *other people's* pieces live in `post_likes`, but the number shown
    on a card is the denormalised `posts.like_count`. Letting those rows cascade away
    silently would leave every one of those pieces claiming a like that no longer
    exists — invisible, permanent, and worse each time somebody leaves.
    """
    user = auth.current_user(request)
    if not user:
        raise HTTPException(401, "Not signed in")

    conn = connect()
    with conn:
        conn.execute(
            """
            UPDATE posts SET like_count = MAX(like_count - 1, 0)
            WHERE id IN (SELECT post_id FROM post_likes WHERE user_id = ?)
            """,
            (user["id"],),
        )
        conn.execute("DELETE FROM users WHERE id = ?", (user["id"],))

    # The session rows are gone with the user; this clears the cookie that pointed
    # at them, so the browser is not left holding a token for an account that no
    # longer exists.
    response = JSONResponse({"ok": True})
    response.delete_cookie(config.SESSION_COOKIE, path="/")
    return response
