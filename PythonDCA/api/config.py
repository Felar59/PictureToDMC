"""Runtime configuration, read from the environment.

Production values live in /etc/picturetodmc.env, loaded by the systemd unit.
Nothing here has a usable default for the secrets: a missing client secret must
fail loudly at boot rather than serve a broken sign-in button.
"""

import os

# Where the site is reachable from the outside. Google redirects back here, so
# it has to match a URI registered on the OAuth client exactly.
PUBLIC_ORIGIN = os.environ.get("PUBLIC_ORIGIN", "http://localhost:10000").rstrip("/")

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")

DB_PATH = os.environ.get("PTD_DB", "/var/lib/picturetodmc/db.sqlite")

# Cookies get the Secure flag on https origins only, otherwise local http
# development can never hold a session.
COOKIE_SECURE = PUBLIC_ORIGIN.startswith("https://")

SESSION_COOKIE = "ptd_session"
SESSION_TTL_DAYS = 180

# Set once at import so a typo in the unit file surfaces on the first request
# rather than silently disabling sign-in.
GOOGLE_ENABLED = bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)


def google_redirect_uri() -> str:
    return f"{PUBLIC_ORIGIN}/api/auth/google/callback"
