"""Grant or take back the admin role, from a shell on the box.

The other way in is `PTD_ADMINS` in /etc/picturetodmc.env, which promotes the
addresses it names on every boot. This is for the cases that cannot wait for a
restart or do not have an address to hand — and for taking a role back, which the
env var deliberately never does.

It lives in `PythonDCA/` rather than `scripts/` for one dull reason: the deploy
rsyncs `PythonDCA/` and nothing else, so anything outside it is not on the server.

    cd /var/www/picturetodmc/app
    ../venv/bin/python -m PythonDCA.admin --list
    ../venv/bin/python -m PythonDCA.admin felix@r2s.fr catherine@example.com
    ../venv/bin/python -m PythonDCA.admin --revoke "Someone Else"

Locally, point PTD_DB at whichever database you mean — the default is the
production path, which is a poor thing to guess at:

    PTD_DB=.dev-db.sqlite .venv/Scripts/python.exe -m PythonDCA.admin --list

An argument matches an e-mail address exactly, or a display name exactly. Names
are not unique (they come from Google, and people collide), so a name matching
more than one account is refused with the ids listed rather than resolved by
picking one.
"""

import argparse
import sys

from .api import config
from .api.db import connect, init


def _find(term: str) -> list:
    """Rows matching an e-mail or a display name, both case-insensitively."""
    return connect().execute(
        "SELECT id, display_name, email, role FROM users"
        " WHERE lower(email) = lower(?) OR lower(display_name) = lower(?)"
        " ORDER BY id",
        (term.strip(), term.strip()),
    ).fetchall()


def _describe(row) -> str:
    # ASCII only, and the flower the site shows stays on the site. A Windows
    # console is cp1252, and printing an emoji to it raises UnicodeEncodeError
    # part-way down the list — which is a poor way to find out who the admins are.
    mark = "  (admin)" if row["role"] == "admin" else ""
    return f"  #{row['id']:<4} {row['display_name']}  <{row['email'] or 'no e-mail'}>{mark}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m PythonDCA.admin",
        description="Grant or revoke the admin role.",
    )
    parser.add_argument("who", nargs="*", help="e-mail address or display name")
    parser.add_argument("--list", action="store_true", help="show every account and exit")
    parser.add_argument("--revoke", action="store_true", help="take the role back instead")
    args = parser.parse_args(argv)

    # Opens the database and brings the schema up to date, exactly as the app does
    # on boot — including the PTD_ADMINS pass, so `--list` reports what the site
    # would actually think rather than what is on disk right now.
    init()
    print(f"database: {config.DB_PATH}\n")

    if args.list or not args.who:
        rows = connect().execute(
            "SELECT id, display_name, email, role FROM users ORDER BY id"
        ).fetchall()
        if not rows:
            print("  no accounts yet — sign in once, then run this again")
        for row in rows:
            print(_describe(row))
        admins = [r for r in rows if r["role"] == "admin"]
        print(f"\n{len(admins)} admin(s) of {len(rows)} account(s)")
        if not args.who:
            print("\nName an account to promote it. --help for the rest.")
        return 0

    role = "user" if args.revoke else "admin"
    verb = "revoked" if args.revoke else "promoted"
    failed = False

    for term in args.who:
        matches = _find(term)
        if not matches:
            print(f"  no account matches {term!r}", file=sys.stderr)
            failed = True
            continue
        if len(matches) > 1:
            # Ambiguous on purpose rather than resolved by picking the first: two
            # people share a name here, and guessing which one gets the keys is
            # not a decision a script should make.
            print(f"  {term!r} matches {len(matches)} accounts:", file=sys.stderr)
            for row in matches:
                print(_describe(row), file=sys.stderr)
            print("    use the e-mail address instead", file=sys.stderr)
            failed = True
            continue

        row = matches[0]
        if row["role"] == role:
            print(f"  #{row['id']} {row['display_name']} was already {role}")
            continue
        connect().execute("UPDATE users SET role = ? WHERE id = ?", (role, row["id"]))
        print(f"  #{row['id']} {row['display_name']} {verb}")

    if not args.revoke and config.ADMIN_EMAILS:
        print(
            "\nnote: PTD_ADMINS is set, and re-promotes"
            f" {', '.join(sorted(config.ADMIN_EMAILS))} on every boot."
        )
    elif args.revoke and config.ADMIN_EMAILS:
        print(
            "\nwarning: PTD_ADMINS still names"
            f" {', '.join(sorted(config.ADMIN_EMAILS))} — anyone listed there is"
            " promoted again on the next restart. Remove them from"
            " /etc/picturetodmc.env too."
        )

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
