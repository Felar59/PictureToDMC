"""Put a real head on the HTML this server sends.

Why this exists, measured on production the day before it did:

    curl https://…/piece/4
      3 324 bytes
      <title>Photo en grille de point de croix — gratuit…</title>   ← the home page's
      0 ld+json blocks
      <body> empty

The client writes its head after React has run (frontend/src/lib/head.ts). Googlebot
executes JavaScript and sees the result. GPTBot, ClaudeBot and PerplexityBot do not —
they read what the server sent and leave, and Anthropic's own documentation says so
of its fetch tool. So to every AI crawler, all forty-odd URLs on this site were the
same page: whatever index.html happened to say.

Nothing here decides anything. Every word comes from `dist/head-manifest.json`, which
the Vite build produces by calling the same functions the app calls
(frontend/src/lib/head-manifest.ts). The fixed routes arrive with their JSON-LD
already serialised and are pasted. Only the two routes whose content is a database row
— a piece and a member — are assembled here, and there is a test that fetches the
server's graph and the browser's for the same piece and compares them field by field.

The tags are emitted carrying `data-head`, which is the attribute the client's
`upsert` looks for. That is what stops this being the duplicate-canonical bug again:
the client finds the server's tags, adopts them and rewrites them in place, rather
than appending a second set beside them.
"""

from __future__ import annotations

import html
import json
import os
import re
import traceback
from typing import Any

from . import db

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(BASE_DIR, "dist")
MANIFEST_PATH = os.path.join(DIST_DIR, "head-manifest.json")
INDEX_PATH = os.path.join(DIST_DIR, "index.html")

#: Tags this module owns. Whatever index.html ships with is stripped before ours go
#: in, so a page never carries two titles or two canonicals — the exact fault that
#: made every route's description the home page's for a while.
_STRIP = re.compile(
    r"<title>.*?</title>"
    r'|<meta\s+name="description"[^>]*>'
    r'|<link\s+rel="canonical"[^>]*>'
    r'|<meta\s+property="og:[^"]*"[^>]*>'
    r'|<meta\s+name="twitter:[^"]*"[^>]*>'
    r'|<meta\s+name="robots"[^>]*>',
    re.I | re.S,
)


def _load(path: str) -> Any:
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


class _Cache:
    """The manifest and the shell, read once but re-read when they change.

    mtime rather than a plain module-level constant: a deploy rsyncs a new dist over
    a running process and only then restarts it, so for a moment the old process is
    serving the new build's assets. Holding the old index.html there would serve
    script tags pointing at hashed files that no longer exist.
    """

    def __init__(self) -> None:
        self._manifest: Any = None
        self._shell: str = ""
        self._stamp: tuple | None = None

    def _current(self) -> tuple | None:
        """Size as well as time, and nanoseconds rather than seconds.

        Modification time alone is not enough to notice a change. A file written
        twice inside one timestamp tick keeps the same mtime, and so does one
        restored by a rename from a copy made moments earlier — which is precisely
        how a test that corrupted this manifest and put it back left the process
        serving the corrupt version indefinitely, long after the file on disk was
        correct again. A deploy that rsyncs twice in quick succession is the same
        shape of event. Size is free to read and settles almost every real case
        that time alone misses.
        """
        try:
            manifest = os.stat(MANIFEST_PATH)
            index = os.stat(INDEX_PATH)
        except OSError:
            return None
        return (manifest.st_mtime_ns, manifest.st_size, index.st_mtime_ns, index.st_size)

    def get(self) -> tuple[Any, str] | None:
        stamp = self._current()
        if stamp is None:
            return None
        if stamp != self._stamp:
            try:
                self._manifest = _load(MANIFEST_PATH)
                with open(INDEX_PATH, encoding="utf-8") as fh:
                    self._shell = fh.read()
                self._stamp = stamp
            except (OSError, ValueError):
                return None
        return self._manifest, self._shell


_cache = _Cache()


def _fill(template: str, values: dict[str, Any]) -> str:
    """Substitute {name} placeholders. Not str.format: the copy contains braces of
    its own in no language we control, and a stray one would raise mid-request."""
    for key, value in values.items():
        template = template.replace("{" + key + "}", str(value))
    return template


def _abs(manifest: Any, path: str) -> str:
    origin = manifest["origin"]
    return f"{origin}/" if path == "/" else f"{origin}{path.rstrip('/')}"


# --------------------------------------------------------------------- graphs
#
# Only the two the build cannot pre-compute. Everything else arrives ready.


def _crumbs(manifest: Any, trail: list[tuple[str, str]]) -> dict:
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": name,
                "item": _abs(manifest, path),
            }
            for i, (name, path) in enumerate(trail)
        ],
    }


def _piece_graph(manifest: Any, row: Any, description: str) -> dict:
    origin = manifest["origin"]
    dyn = manifest["dynamic"]
    url = f"{origin}{dyn['piecePrefix']}{row['id']}"
    author = {"@id": f"{origin}{dyn['makerPrefix']}{row['author_id']}#person"}
    image_path = f"/api/posts/{row['id']}/share.png"
    iso = _iso(row["created_at"])

    work = {
        "@type": "CreativeWork",
        "@id": f"{url}#work",
        "name": row["title"],
        "description": description,
        "url": url,
        "genre": dyn["genre"],
        "author": author,
        "creator": author,
        "dateCreated": iso,
        "datePublished": iso,
        "inLanguage": manifest["lang"],
        "isPartOf": {"@id": f"{origin}/#website"},
        "publisher": {"@id": f"{origin}/#organization"},
        "image": {"@id": f"{url}#image"},
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/LikeAction",
            "userInteractionCount": row["like_count"],
        },
    }
    image = {
        "@type": "ImageObject",
        "@id": f"{url}#image",
        "contentUrl": f"{origin}{image_path}",
        "url": f"{origin}{image_path}",
        "creator": author,
        "creditText": row["display_name"],
        "acquireLicensePage": url,
    }
    person = {
        "@type": "Person",
        "@id": f"{origin}{dyn['makerPrefix']}{row['author_id']}#person",
        "name": row["display_name"],
        "url": f"{origin}{dyn['makerPrefix']}{row['author_id']}",
    }
    # A photo post lives in the other gallery, and its crumb has to say so — the
    # same branch the piece page itself makes.
    gallery = dyn["stitchesPath"] if row["kind"] == "photo" else dyn["galleryPath"]
    return {
        "@context": "https://schema.org",
        "@graph": [
            work,
            image,
            person,
            _crumbs(
                manifest,
                [
                    (dyn["crumbHome"], "/"),
                    (dyn["crumbGallery"], gallery),
                    (row["title"], f"{dyn['piecePrefix']}{row['id']}"),
                ],
            ),
        ],
    }


def _maker_graph(manifest: Any, user: Any, posts: list) -> dict:
    origin = manifest["origin"]
    dyn = manifest["dynamic"]
    url = f"{origin}{dyn['makerPrefix']}{user['id']}"
    person: dict[str, Any] = {
        "@type": "Person",
        "@id": f"{url}#person",
        "name": user["display_name"],
        "url": url,
    }
    if user["bio"]:
        person["description"] = user["bio"]
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ProfilePage",
                "@id": f"{url}#profile",
                "url": url,
                "mainEntity": {"@id": f"{url}#person"},
                "isPartOf": {"@id": f"{origin}/#website"},
                "hasPart": [
                    {
                        "@type": "CreativeWork",
                        "@id": f"{origin}{dyn['piecePrefix']}{p['id']}#work",
                        "name": p["title"],
                        "url": f"{origin}{dyn['piecePrefix']}{p['id']}",
                    }
                    for p in posts
                ],
            },
            person,
            _crumbs(
                manifest,
                [
                    (dyn["crumbHome"], "/"),
                    (dyn["crumbGallery"], dyn["galleryPath"]),
                    (user["display_name"], f"{dyn['makerPrefix']}{user['id']}"),
                ],
            ),
        ],
    }


def _iso(ms: int) -> str:
    """Milliseconds since the epoch, as schema.org wants it.

    Written by hand rather than through datetime because JavaScript's
    `toISOString()` always emits exactly three decimal places and a Z, and the
    equivalence test compares the two graphs as strings.
    """
    from datetime import datetime, timezone

    dt = datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + f"{dt.microsecond // 1000:03d}Z"


# ---------------------------------------------------------------- the lookups


def _piece_head(manifest: Any, post_id: int) -> dict | None:
    dyn = manifest["dynamic"]
    row = db.connect().execute(
        """
        SELECT p.id, p.title, p.kind, p.width, p.height, p.thread_codes,
               p.like_count, p.created_at, p.author_id, u.display_name,
               -- Tested, not fetched: `cells` is one byte of base64 per stitch and
               -- can run to tens of kilobytes. This head only needs to know whether
               -- there is a grid behind the post, which decides whether its share
               -- image is a card this site drew or the member's own photograph.
               p.cells IS NOT NULL AS has_cells
        FROM posts p JOIN users u ON u.id = p.author_id
        WHERE p.id = ?
        """,
        (post_id,),
    ).fetchone()
    if not row:
        return None

    codes = json.loads(row["thread_codes"]) if row["thread_codes"] else []
    # The same branch the client makes: a photo post has no measurements, and
    # quoting them anyway is how a link preview reads "null × null points".
    if row["kind"] == "photo" or row["width"] is None or row["height"] is None or not codes:
        shape = manifest["piece"]["photo"]
    else:
        shape = manifest["piece"]["pattern"]

    values = {
        "title": row["title"],
        "maker": row["display_name"],
        "width": row["width"],
        "height": row["height"],
        "threads": len(codes),
    }
    description = _fill(shape["description"], values)
    title = _fill(shape["title"], values)
    gallery = (
        manifest["dynamic"]["stitchesPath"]
        if row["kind"] == "photo"
        else manifest["dynamic"]["galleryPath"]
    )
    return {
        "title": title,
        "description": description,
        "canonical": f"{dyn['piecePrefix']}{row['id']}",
        "image": f"/api/posts/{row['id']}/share.png",
        # A pattern post's share image is drawn by sharecard.py at a known size. A
        # photo post's is the member's uploaded JPEG, returned verbatim by
        # `get_share_card`, at whatever shape their phone took it — so the size is
        # not declared rather than declared wrongly. Claiming 1.91:1 for a portrait
        # photo makes a scraper reserve a letterbox and crop the picture into it.
        "cardIsDrawn": row["kind"] != "photo" and bool(row["has_cells"]),
        "imageAlt": title,
        "type": "article",
        "publishedTime": _iso(row["created_at"]),
        "authorUrl": f"{manifest['origin']}{dyn['makerPrefix']}{row['author_id']}",
        "jsonLd": json.dumps(_piece_graph(manifest, row, description), ensure_ascii=False),
        # The picture is the page, and a crawler cannot see a canvas that has not
        # been drawn — so what it gets instead is the piece named, described,
        # credited to its maker, and linked to both of them.
        "body": _body(
            manifest,
            row["title"],
            description,
            [
                (f"{dyn['makerPrefix']}{row['author_id']}", row["display_name"]),
                (gallery, manifest["dynamic"]["crumbGallery"]),
            ],
        ),
    }


def _maker_head(manifest: Any, user_id: int) -> dict | None:
    dyn = manifest["dynamic"]
    conn = db.connect()
    user = conn.execute(
        "SELECT id, display_name, bio FROM users WHERE id = ? AND banned_at IS NULL",
        (user_id,),
    ).fetchone()
    if not user:
        return None
    posts = conn.execute(
        "SELECT id, title FROM posts WHERE author_id = ? ORDER BY created_at DESC, id DESC LIMIT 60",
        (user_id,),
    ).fetchall()
    # Counted separately, because `posts` is capped at 60 for the page's own sake.
    # Using len(posts) made the description of a member with 137 pieces read "les
    # 60 grilles que…" — a number the page itself contradicts, and the sentence an
    # answer engine quotes when asked how much somebody has published.
    total = conn.execute(
        "SELECT COUNT(*) FROM posts WHERE author_id = ?", (user_id,)
    ).fetchone()[0]

    shape = manifest["maker"]
    values = {"maker": user["display_name"], "pieces": total}
    if not posts:
        description = _fill(shape["empty"], values)
    elif total == 1:
        description = _fill(shape["descriptionOne"], values)
    else:
        description = _fill(shape["descriptionMany"], values)

    return {
        "title": _fill(shape["title"], values),
        "description": description,
        "canonical": f"{dyn['makerPrefix']}{user['id']}",
        "jsonLd": json.dumps(_maker_graph(manifest, user, posts), ensure_ascii=False),
        # Their pieces as real links: this is the page that makes every piece
        # reachable without JavaScript, the gallery being a list built by fetch.
        "body": _body(
            manifest,
            user["display_name"],
            description,
            [(f"/piece/{p['id']}", p["title"]) for p in posts],
        ),
    }


def _body(manifest: Any, heading: str, lead: str, links: list[tuple[str, str]]) -> str:
    """A heading, a sentence and some links — the same skeleton the fixed routes get.

    Built here rather than in the manifest because every word of it is a database
    row. The wrapper classes match the ones head-manifest.ts uses so the two look
    like the same site during the moment before React takes over.
    """
    items = "".join(
        f'<li class="m-0 mb-1"><a href="{html.escape(href, quote=True)}">'
        f"{html.escape(text)}</a></li>"
        for href, text in links
    )
    gallery = manifest["dynamic"]["galleryPath"]
    return (
        '<div class="mx-auto max-w-[780px] px-5 py-12">'
        f'<nav class="text-[14px] text-cocoa mb-8 flex flex-wrap gap-2">'
        f'<a href="/">{html.escape(manifest["siteName"])}</a> · '
        f'<a href="{gallery}">{html.escape(manifest["dynamic"]["crumbGallery"])}</a></nav>'
        f'<h1 class="text-[32px] sm:text-[40px] leading-[1.12] mt-2 mb-5">{html.escape(heading)}</h1>'
        f'<p class="text-[16px] leading-[1.7] text-clay m-0 mb-4">{html.escape(lead)}</p>'
        + (f'<ul class="list-none p-0 m-0">{items}</ul>' if items else "")
        + "</div>"
    )


#: How many pieces the server lists under a gallery.
#:
#: This is the site's crawl path, not a page of results: a reader that runs no
#: JavaScript sees only what is in this list, and the gallery's own "voir plus"
#: is a fetch it will never make. Sixty is roughly three pages of the real
#: gallery — enough that a crawler arriving cold reaches most of what exists,
#: small enough that the HTML stays a few kilobytes.
GALLERY_LINKS = 60


def _gallery_links(manifest: Any, kind: str) -> list[tuple[str, str]]:
    """The newest pieces in one gallery, as (href, title)."""
    dyn = manifest["dynamic"]
    rows = db.connect().execute(
        """
        SELECT id, title FROM posts
        WHERE kind = ?
        ORDER BY created_at DESC, id DESC
        LIMIT ?
        """,
        (kind, GALLERY_LINKS),
    ).fetchall()
    return [(f"{dyn['piecePrefix']}{r['id']}", r["title"]) for r in rows]


def _gallery_body(manifest: Any, base_body: str | None, kind: str) -> str | None:
    """The baked gallery page, with the pieces it is a gallery *of* appended.

    Without this the whole prerendering effort is unreachable by the readers it
    was built for. The bodies come from the build, which has no database, so a
    crawler that does not run JavaScript arrived at /galerie, found a heading and
    the six fixed nav links, and stopped — every `_piece_head` and `_maker_head`
    below was dead code to it. Pieces are deliberately absent from sitemap.xml on
    the grounds that "the gallery links to every one of them", which was true only
    once JavaScript had run.
    """
    if not base_body:
        return base_body
    links = _gallery_links(manifest, kind)
    if not links:
        return base_body
    items = "".join(
        f'<li class="m-0 mb-1"><a href="{html.escape(href, quote=True)}">'
        f"{html.escape(title)}</a></li>"
        for href, title in links
    )
    listing = f'<ul class="list-none p-0 m-0 mb-8">{items}</ul>'
    # Inside the wrapper, before the footer nav, so the document still reads in
    # order: heading, what this page is, then the pieces.
    marker = '<nav class="text-[14px] text-cocoa mt-12'
    return base_body.replace(marker, listing + marker, 1) if marker in base_body else base_body + listing


# The private routes and the two id-bearing prefixes used to be spelled here, in
# eight places between them. They come from the manifest now — renaming a path is
# an edit to routes.ts and nothing else, which is what the manifest is for.


def head_for(path: str) -> dict | None:
    """What the head should say for this path, or None to leave the shell alone."""
    loaded = _cache.get()
    if loaded is None:
        return None
    manifest, _ = loaded

    # "." is what StaticFiles hands over for the site root — normpath("") is ".".
    raw = path.replace("\\", "/").strip("/")
    clean = "/" if raw in ("", ".") else "/" + raw.rstrip("/")

    fixed = manifest["fixed"].get(clean)
    if fixed:
        body = fixed.get("body")
        # The two galleries get the pieces they are galleries of. See _gallery_body.
        if clean == manifest["dynamic"]["galleryPath"]:
            body = _gallery_body(manifest, body, "pattern")
        elif clean == manifest["dynamic"]["stitchesPath"]:
            body = _gallery_body(manifest, body, "photo")
        return {
            "title": fixed["title"],
            "description": fixed["description"],
            "canonical": clean,
            "jsonLd": fixed["jsonLd"],
            "body": body,
        }

    if clean in set(manifest["dynamic"]["privatePaths"]):
        return {
            "title": manifest["siteName"],
            "description": manifest["fixed"]["/"]["description"],
            "canonical": clean,
            "noindex": True,
        }

    dyn = manifest["dynamic"]
    for prefix, lookup in (
        (dyn["piecePrefix"], _piece_head),
        (dyn["makerPrefix"], _maker_head),
    ):
        if clean.startswith(prefix):
            rest = clean[len(prefix) :]
            if not rest.isdigit():
                break
            found = lookup(manifest, int(rest))
            if found:
                return found
            # The row is gone.
            #
            # `missing` is what makes this a real 404 rather than a soft one. The
            # caller picks the status from the URL *shape* — any /piece/<digits>
            # looks like a page — so without this flag the response was 200 OK
            # carrying the words "cette page n'existe pas", which is the precise
            # definition of a soft 404: link checkers and uptime monitors record
            # the URL as live, and Search Console files it rather than dropping it.
            return {
                "title": manifest["notFound"]["title"],
                "description": manifest["notFound"]["description"],
                "canonical": clean,
                "noindex": True,
                "missing": True,
            }

    return {
        "title": manifest["notFound"]["title"],
        "description": manifest["notFound"]["description"],
        "canonical": clean,
        "noindex": True,
        "missing": True,
    }


def _tag(name: str, attr: str, key: str, content: str) -> str:
    return f'<{name} {attr}="{key}" content="{html.escape(content, quote=True)}" data-head>'


def render(path: str) -> tuple[str, bool] | None:
    """(html, missing) for this route, or None to serve index.html untouched.

    `missing` is half of the soft-404 fix. The caller cannot tell a deleted piece
    from a live one — `/piece/4171` and `/piece/4` are the same shape — so it used
    to answer 200 for both, and a deleted piece came back as `200 OK` carrying the
    words "cette page n'existe pas". Only the lookup knows; only the lookup can say.

    The try wraps *everything*. It used to end after `head_for`, which left
    `manifest["origin"]`, `manifest["lang"]`, `fixed["jsonLd"]` and the rest of the
    body outside it — so a new server deployed against a `dist/` built before a
    manifest key was renamed raised KeyError past this function, past `_shell`
    (which has no guard either) and into a 500 on *every* HTML request. The comment
    below promising that a head is not worth a 500 was describing a guard that
    covered exactly one line of the function it was in.
    """
    loaded = _cache.get()
    if loaded is None:
        return None
    manifest, shell = loaded

    try:
        return _render(manifest, shell, path)
    except Exception:
        # A head is not worth a 500. Fall back to the shell and let the client write
        # its own, exactly as the site did before any of this existed.
        #
        # But loudly. The first version of this swallowed the traceback silently, and
        # a KeyError from a stale manifest turned into "the pieces just don't render"
        # with nothing anywhere to say why — a failure mode that is indistinguishable
        # from the feature having never been deployed.
        traceback.print_exc()
        return None


def _render(manifest: Any, shell: str, path: str) -> tuple[str, bool] | None:
    head = head_for(path)
    if head is None:
        return None

    canonical = _abs(manifest, head.get("canonical") or "/")
    image = head.get("image") or manifest["defaultImage"]
    if not image.startswith("http"):
        image = f"{manifest['origin']}{image}"

    parts = [
        f"<title data-head>{html.escape(head['title'])}</title>",
        _tag("meta", "name", "description", head["description"]),
        f'<link rel="canonical" href="{html.escape(canonical, quote=True)}" data-head>',
        _tag("meta", "property", "og:title", head["title"]),
        _tag("meta", "property", "og:description", head["description"]),
        _tag("meta", "property", "og:url", canonical),
        _tag("meta", "property", "og:type", head.get("type") or "website"),
        _tag("meta", "property", "og:site_name", manifest["siteName"]),
        _tag("meta", "property", "og:image", image),
        # The size, restated — `_STRIP` above removes every og:* tag index.html
        # shipped with, which included these two, so an earlier version of this
        # module quietly deleted them from every page and put nothing back.
        # Facebook, LinkedIn and WhatsApp lay a preview out before the image has
        # downloaded; without them they guess small or reflow when it lands.
        #
        # Conditional, because the claim is only true of an image this site drew.
        # og.png and every card sharecard.py renders are exactly 1200x630 — but a
        # photo post's share image is the member's uploaded JPEG returned verbatim
        # by `get_share_card`, at whatever shape their phone took it. Asserting
        # 1.91:1 there makes a scraper reserve a letterbox and crop a portrait
        # photograph into it, which is worse than saying nothing.
        *(
            [
                _tag("meta", "property", "og:image:width", "1200"),
                _tag("meta", "property", "og:image:height", "630"),
            ]
            if head.get("cardIsDrawn", True)
            else []
        ),
        _tag("meta", "property", "og:image:alt", head.get("imageAlt") or head["title"]),
        # The served HTML is always French — the server cannot know a visitor's
        # toggle, and this is the canonical language.
        _tag("meta", "property", "og:locale", "fr_FR" if manifest["lang"] == "fr" else "en_GB"),
        _tag("meta", "name", "twitter:card", "summary_large_image"),
        _tag("meta", "name", "twitter:title", head["title"]),
        _tag("meta", "name", "twitter:description", head["description"]),
        _tag("meta", "name", "twitter:image", image),
        _tag("meta", "name", "twitter:image:alt", head.get("imageAlt") or head["title"]),
        _tag("meta", "name", "robots", "noindex, follow" if head.get("noindex") else "index, follow"),
    ]
    # Only on a piece, and only when the row supplied them. Emitted on a page that
    # is not an article, these would tell a scraper the FAQ was written on a date
    # by whoever made the last chart.
    if (head.get("type") or "website") == "article":
        if head.get("publishedTime"):
            parts.append(_tag("meta", "property", "article:published_time", head["publishedTime"]))
        if head.get("authorUrl"):
            parts.append(_tag("meta", "property", "article:author", head["authorUrl"]))
    if head.get("jsonLd"):
        # `</script>` inside the JSON would end the tag early — the one escape a
        # JSON-LD block genuinely needs.
        safe = head["jsonLd"].replace("</", "<\\/")
        parts.append(f'<script type="application/ld+json" data-head>{safe}</script>')

    out = _STRIP.sub("", shell)
    out = out.replace("</head>", "\n    ".join(["", *parts]) + "\n  </head>", 1)

    # And the page itself, where there is one to give.
    #
    # React clears #root when it mounts, so this is replaced the instant the app
    # boots and nobody ever sees both. Until then it is the page's real words in
    # the page's real fonts, where a blank rectangle used to be — and it is the
    # only thing a crawler that does not run JavaScript will ever read, including
    # every link on the site.
    missing = bool(head.get("missing"))
    body = head.get("body")
    if body:
        # *Inside* the mount point, not after it. Written the other way round the
        # content becomes a sibling of #root, which React never clears — so the page
        # would carry the skeleton and the real app at once, forever, for everyone.
        out = out.replace(_ROOT, f'<div id="root">{body}</div>', 1)
    return out, missing


#: The mount point, exactly as index.html writes it. A literal rather than a regex
#: so a change to that markup fails visibly here instead of silently skipping the
#: body on every page.
_ROOT = '<div id="root"></div>'


# ------------------------------------------------------------------- sitemap
#
# Built here rather than at build time, because the interesting half of this site
# is rows in a database and the build has none.

#: A cap well under the 50 000 the format allows, and under it for a different
#: reason: past a few thousand URLs a sitemap wants splitting into an index, and
#: this gallery is nowhere near that. Raise it when it bites.
SITEMAP_PIECES = 5000


def _iso_date(ms: int) -> str:
    from datetime import datetime, timezone

    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).strftime("%Y-%m-%d")


def sitemap_xml() -> str | None:
    """Every URL worth crawling, including the ones that did not exist at build time.

    The static version listed eight fixed pages and nothing else. Pieces were left
    out deliberately — the note in routes.ts reasons that they come and go, and that
    a sitemap listing URLs which 404 next week is worse than one that never
    mentioned them. Both halves of that are answered now rather than accepted: this
    is generated per request from the live table, so a deleted piece is absent the
    moment it is deleted, and a new one appears the moment it is published.

    Members are included only when they have published something. A profile with no
    pieces is a name and an empty grid, which is the definition of a thin page, and
    volunteering thin pages to a crawler is how a small site trains an engine to
    ignore it.
    """
    try:
        return _sitemap_xml()
    except Exception:
        # Same rule as the head: a sitemap is not worth a 500. main.py falls back to
        # the static file from the build, which lists the fixed pages and no rows —
        # thinner than this, and far better than an error where a crawler expected
        # a list of every page on the site.
        traceback.print_exc()
        return None


def _sitemap_xml() -> str | None:
    loaded = _cache.get()
    if loaded is None:
        return None
    manifest, _ = loaded

    # The fixed pages last changed when this build was made — that is what their
    # lastmod honestly is, and the manifest's own mtime is exactly that moment.
    try:
        built = _iso_date(os.path.getmtime(MANIFEST_PATH) * 1000)
    except OSError:
        return None

    dyn = manifest["dynamic"]
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    def url(loc: str, lastmod: str, changefreq: str, priority: str) -> None:
        out.append("  <url>")
        out.append(f"    <loc>{html.escape(loc, quote=False)}</loc>")
        out.append(f"    <lastmod>{lastmod}</lastmod>")
        out.append(f"    <changefreq>{changefreq}</changefreq>")
        out.append(f"    <priority>{priority}</priority>")
        out.append("  </url>")

    for route in manifest["routes"]:
        url(_abs(manifest, route["path"]), built, route["changefreq"], route["priority"])

    conn = db.connect()
    for row in conn.execute(
        """
        SELECT id, created_at FROM posts
        ORDER BY created_at DESC, id DESC
        LIMIT ?
        """,
        (SITEMAP_PIECES,),
    ):
        # A published piece does not change after publication — the grid, the title
        # and the thread list are fixed at that moment — so "monthly" would be a
        # promise of churn that never comes. Comments are the only thing that moves.
        url(
            _abs(manifest, f"{dyn['piecePrefix']}{row['id']}"),
            _iso_date(row["created_at"]),
            "monthly",
            "0.6",
        )

    for row in conn.execute(
        """
        SELECT u.id, MAX(p.created_at) AS latest
        FROM users u JOIN posts p ON p.author_id = u.id
        WHERE u.banned_at IS NULL
        GROUP BY u.id
        ORDER BY latest DESC
        LIMIT ?
        """,
        (SITEMAP_PIECES,),
    ):
        # A member's page changes whenever they publish, which is what `latest` is.
        url(_abs(manifest, f"{dyn['makerPrefix']}{row['id']}"), _iso_date(row["latest"]), "weekly", "0.4")

    out.append("</urlset>")
    return "\n".join(out) + "\n"
