"""The picture marks this server ships.

Its own module because two places need it and they cannot import each other:
`routes_auth` validates a member's choice against it, and `db` uses it to give a
mark to anybody who has not got one — and `routes_auth` already imports `db`.

Generated from frontend/public/marks by scripts/export-marks.py, so this list
cannot claim a file that is not there. The failure otherwise is a member wearing
an avatar that 404s on every page they appear on, which nothing would report.
"""

#: How a chosen mark is stored in `users.icon`. Prefixed because that column also
#: held a free string that seeded the *drawn* mark, and the two must not be
#: confusable.
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
