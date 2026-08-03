"""Google sign-in, authorization-code flow, no SDK.

Two HTTPS calls: send the user to Google, then swap the code for an id_token.

The id_token's signature is not verified, and does not need to be: it arrives
in the body of a TLS response from Google's own token endpoint, in exchange for
a code plus our client secret. That is the classic confidential-client flow —
the transport is the proof. (Verifying signatures matters when a token reaches
you via an untrusted party, e.g. the implicit flow or a client-supplied token.)
"""

import base64
import json
import urllib.parse
import urllib.request
from typing import NamedTuple

from . import config


class GoogleIdentity(NamedTuple):
    """What we take from Google, and nothing more.

    No `picture`: members are shown a stitched mark drawn from their id, so the
    account photo has no reader here. Asking for a face we would never display
    is a disclosure with no purpose.
    """

    sub: str
    email: str | None
    email_verified: bool
    name: str | None


def auth_url(state: str) -> str:
    params = {
        "client_id": config.GOOGLE_CLIENT_ID,
        "redirect_uri": config.google_redirect_uri(),
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        # Without this, a signed-in Google user is bounced straight through with
        # no chance to pick a different account.
        "prompt": "select_account",
    }
    return "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)


def _b64url_json(segment: str) -> dict:
    # JWT segments drop the base64 padding; put it back before decoding.
    padded = segment + "=" * (-len(segment) % 4)
    return json.loads(base64.urlsafe_b64decode(padded))


def exchange_code(code: str) -> GoogleIdentity:
    body = urllib.parse.urlencode(
        {
            "code": code,
            "client_id": config.GOOGLE_CLIENT_ID,
            "client_secret": config.GOOGLE_CLIENT_SECRET,
            "redirect_uri": config.google_redirect_uri(),
            "grant_type": "authorization_code",
        }
    ).encode()

    request = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    with urllib.request.urlopen(request, timeout=15) as response:
        payload = json.loads(response.read())

    id_token = payload.get("id_token")
    if not id_token:
        raise ValueError("Google returned no id_token")

    claims = _b64url_json(id_token.split(".")[1])
    sub = claims.get("sub")
    if not sub:
        raise ValueError("Google id_token carried no subject")

    email = claims.get("email")
    return GoogleIdentity(
        sub=str(sub),
        email=email.lower() if email else None,
        email_verified=claims.get("email_verified") is True,
        name=claims.get("name") or None,
    )
