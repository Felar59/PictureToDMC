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

# Nothing here says who is an admin, on purpose. `users.role` is written by
# exactly one thing — `sudo ptd-panel`, from a shell on the box — so the privilege
# has no path through this process at all: not through a request body, and not
# through an environment variable that a mistyped unit file could set. The panel
# lives in deploy/admin/.

# Cookies get the Secure flag on https origins only, otherwise local http
# development can never hold a session.
COOKIE_SECURE = PUBLIC_ORIGIN.startswith("https://")

SESSION_COOKIE = "ptd_session"
SESSION_TTL_DAYS = 180

# Set once at import so a typo in the unit file surfaces on the first request
# rather than silently disabling sign-in.
GOOGLE_ENABLED = bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)

# A way to be signed in on a machine that has no Google credentials.
#
# The client secret is not in this repository and must never be, so a developer
# checking out the project cannot sign in at all — which means the account page,
# publishing, commenting and the whole moderation side are unreachable locally.
#
# Two independent conditions, either of which alone is enough to keep this shut in
# production: the environment variable has to be set on purpose, AND Google has to
# be unconfigured. Production configures Google, so it can never be on there even
# if the variable leaked into its environment by accident.
DEV_LOGIN = bool(os.environ.get("PTD_DEV_LOGIN")) and not GOOGLE_ENABLED


def google_redirect_uri() -> str:
    return f"{PUBLIC_ORIGIN}/api/auth/google/callback"
