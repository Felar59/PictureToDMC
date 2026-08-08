"""The server: a community API, plus the built frontend as static files.

The conversion itself does NOT live here — quantisation, DMC matching, rendering
and chart export all run in the browser (frontend/src/engine/). This process only
handles the things that genuinely need a server: who you are, and what everyone
has published.

That split is deliberate. The old build kept the active conversion in a
module-level global, so two people converting at once shared one pattern.
Nothing stateful about a conversion reaches this process any more.
"""

import mimetypes
import os

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException
from starlette.concurrency import run_in_threadpool
from starlette.responses import HTMLResponse, RedirectResponse, Response
from starlette.types import Scope

from .api import config, db, prerender
from .api.routes_auth import router as auth_router
from .api.routes_gallery import router as gallery_router
from .api.routes_reports import router as reports_router

# The content types this site serves, declared rather than looked up.
#
# `mimetypes` asks the host: the Windows registry on a dev machine, /etc/mime.types
# on the server. Neither knew `.woff2` or `.onnx`, so both went out as
# `text/plain` — and text/plain is in nginx's `gzip_types`, so the box was
# recompressing a woff2 that is already brotli inside, and gzipping the 4.4 MB
# segmentation model on every request that asked for it. A font served as text also
# means the browser may refuse to reuse the `<link rel=preload>` in index.html and
# fetch it a second time.
#
# Declared here so the answer is the same on every machine, whatever the host
# happens to have in its table.
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("font/woff", ".woff")
# No registered type exists for ONNX. Octet-stream is the honest answer, and it
# keeps nginx from trying to compress four megabytes of weights.
mimetypes.add_type("application/octet-stream", ".onnx")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")

if not os.path.isdir(DIST_DIR):
    raise RuntimeError(f"'{DIST_DIR}' is missing — run `npm run build` in frontend/ first.")


class SinglePageFiles(StaticFiles):
    """StaticFiles that hands unknown paths to the client-side router.

    /gallery and /convert are React routes with no file behind them, so a plain
    StaticFiles 404s them on a hard refresh. Falling back to index.html lets the
    router take over.

    Built on StaticFiles rather than a hand-rolled handler on purpose: it
    resolves paths safely. The previous version passed the URL straight to
    os.path.join, so `GET /%2e%2e/%2e%2e/main.py` walked out of the directory
    and served the source.
    """

    #: Prefixes whose file names already carry a version, so their contents can
    #: never change under a URL that has been handed out.
    #:
    #: `assets/` is content-hashed by Vite — a byte changes and the name changes.
    #: `fonts/` and `models/` are hand-versioned (`fredoka-v1.woff2`), the same
    #: convention and the same guarantee.
    IMMUTABLE = ("assets/", "fonts/", "models/")

    async def get_response(self, path: str, scope: Scope) -> Response:
        # Normalised once, and before the request is even tried: both branches below
        # ask the same question about the path, and only one of them should have to
        # remember that Windows spells it with backslashes.
        clean = path.replace("\\", "/").lstrip("/")

        # The site's front door. StaticFiles(html=True) would answer this with
        # index.html verbatim, which is the one case the fallback below never sees —
        # so without this branch the home page was the only route left unrendered.
        #
        # "." and not just "": StaticFiles builds the path with os.path.normpath, and
        # normpath("") is ".". Checking only for the empty string left the home page
        # — the most linked URL on the site — quietly serving the raw shell while
        # every other route rendered, which is exactly the kind of miss that looks
        # like it works.
        if clean in ("", ".", "index.html"):
            return await self._shell("/", 200)

        # The sitemap, built from the live table rather than served from the build.
        #
        # The static one could only ever list the eight fixed pages, because a piece
        # is a database row and the build has none — so every piece and every member
        # page was absent from the one file whose entire job is to say what exists.
        # A failure here falls through to that static file, which is a worse answer
        # than this one but a better answer than none.
        if clean == "sitemap.xml":
            built = await run_in_threadpool(prerender.sitemap_xml)
            if built is not None:
                return Response(
                    built,
                    media_type="application/xml",
                    headers={"Cache-Control": "public, max-age=3600"},
                )

        # The addresses this site used to hand out, moved permanently rather than
        # answered as missing.
        moved = _LEGACY.get(clean.rstrip("/"))
        if moved:
            return RedirectResponse(moved, status_code=301)

        # And the one that carries an id. `/brodeur/12` was a real, linked, indexed
        # URL for every member — it is in the sitemap that is live right now — so
        # letting it 404 would throw away every member page the site has ever had.
        # An exact-path map cannot express this; a prefix can.
        for was, now in _LEGACY_PREFIXES.items():
            if clean.startswith(was):
                return RedirectResponse(now + clean[len(was) :], status_code=301)

        try:
            response = await super().get_response(path, scope)

            # Cache what cannot change; revalidate what can.
            #
            # nginx proxies everything here and sets no caching rules of its own, so
            # each of these came back carrying nothing but an etag — which means a
            # repeat visitor spent a round trip per file being told "not modified",
            # a dozen of them before the page could paint, on connections where the
            # round trip is the expensive part. The file name is what makes a year
            # safe: a new build writes new names, so no browser can be left holding
            # an old one.
            #
            # index.html is deliberately NOT in here. It is the one file whose name
            # never changes, and it is what points at all the others.
            if clean.startswith(self.IMMUTABLE):
                response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
            return response
        except HTTPException as exc:
            if exc.status_code != 404:
                raise
            # A missing asset is a build problem — let it 404 loudly instead of
            # answering with HTML the browser will then fail to parse as JS.
            #
            # `models` alongside `assets`: the segmentation weights live there, and
            # falling back to index.html for a missing .onnx hands the runtime a
            # page of HTML and a parse error rather than a 404 it can report. Fonts
            # are the same case, which is why this reads IMMUTABLE rather than its
            # own list — every directory whose files are named by version is a
            # directory where a miss means the build is wrong, and two lists of the
            # same directories would eventually disagree.
            #
            # `clean` was split on both separators above: StaticFiles normalises
            # through os.path.join, so this arrives as "assets/app.js" on the server
            # and "assets\app.js" on a Windows dev machine.
            if clean.startswith(self.IMMUTABLE):
                raise

            # The shell, with the right status code on it.
            #
            # Falling back to index.html with a 200 for *every* unknown path makes
            # every typo a soft 404: the crawler is told the page exists, indexes a
            # copy of the shell, and the site accumulates duplicate entries for URLs
            # nobody meant. So a path the router knows about answers 200 and anything
            # else answers 404 — both with the same HTML, so the React NotFound page
            # still renders and a visitor sees something friendly either way.
            return await self._shell(path, 200 if _is_client_route(path) else 404)

    async def _shell(self, path: str, status: int) -> Response:
        """index.html, with this route's head written into it where possible.

        Everything that does not run JavaScript — which is every AI crawler — only
        ever sees what comes back from here, so this is the only place a title, a
        description or a JSON-LD graph can reach them. See api/prerender.py.

        A miss returns the file untouched rather than failing: the client still
        writes its own head, which is where the site was before this existed.
        """
        # In a worker thread, not here.
        #
        # Starlette awaits this on the event loop, and rendering a piece or a member
        # reads SQLite synchronously. Every other database route in this app is a
        # plain `def`, which is FastAPI's signal to run it in a threadpool; these two
        # were reached through an `async def` and so ran on the loop itself. With
        # `busy_timeout = 5000`, one concurrent writer meant every request in the
        # process — API calls, static files, other people's pages — waited behind a
        # single piece page for up to five seconds.
        rendered = await run_in_threadpool(prerender.render, path)
        if rendered is None:
            with open(os.path.join(DIST_DIR, "index.html"), encoding="utf-8") as fh:
                body = fh.read()
        else:
            body, missing = rendered
            # The row decides, not the URL's shape. `/piece/4171` and `/piece/4` look
            # identical from here, so answering 200 for both meant a deleted piece
            # came back as `200 OK` whose body reads "cette page n'existe pas" — a
            # soft 404 by definition, which link checkers and uptime monitors record
            # as a live page and Search Console files rather than dropping.
            if missing:
                status = 404
        return HTMLResponse(
            body,
            status_code=status,
            # The one file whose name never changes, and the file that names every
            # other one. It must be revalidated or a deploy reaches nobody.
            headers={"Cache-Control": "no-cache"},
        )


#: Paths the React router actually has a page for.
#:
#: Kept in step with frontend/src/lib/routes.ts by hand, which is a duplication worth
#: naming: the alternative is the server importing a TypeScript module, and the cost
#: of this list being wrong is one page answering 404 while still rendering — visible
#: the first time anyone opens it, and caught by the deploy's smoke test.
_CLIENT_ROUTES = {
    "",
    "convert",
    "gallery",
    "gallery/stitched",
    "about",
    "faq",
    "guide",
    "guide/reading-a-chart",
    "guide/choosing-a-photo",
    "guide/fabric-and-size",
    "privacy",
    "account",
    "reports",
    "lab",
}

#: The English paths that shipped first, and where they now go.
#:
#: Kept out of `_CLIENT_ROUTES` above and answered here instead. They were client
#: routes so the React router could redirect them — which works for a person and
#: for Googlebot, and for nobody else. Since the server started writing heads they
#: were worse than that: no entry exists for them in the manifest, so they fell
#: through to the not-found branch and every one of them served
#: `<title>Page introuvable</title>` with `noindex` under a self-canonical. An old
#: link pasted into WhatsApp previewed as a dead page, and any crawler holding one
#: was told to drop it rather than to follow it.
#:
#: A 301 is the answer a search engine actually wants: it moves the old URL's
#: standing to the new one instead of discarding it. Kept in step with
#: `legacyRedirects` in frontend/src/lib/routes.ts.
_LEGACY = {
    "convertir-photo-point-de-croix": "/convert",
    "galerie": "/gallery",
    "galerie/broderies": "/gallery/stitched",
    "qui-sommes-nous": "/about",
    "comment-faire-une-grille-de-point-de-croix": "/guide",
    "comment-lire-une-grille-de-point-de-croix": "/guide/reading-a-chart",
    "quelle-photo-pour-le-point-de-croix": "/guide/choosing-a-photo",
    "quelle-toile-pour-le-point-de-croix": "/guide/fabric-and-size",
    "confidentialite": "/privacy",
    "compte": "/account",
    "signalements": "/reports",
    "atelier": "/lab",
}

#: The id-bearing prefix that moved. Same reasoning as `_LEGACY`, one level down.
_LEGACY_PREFIXES = {"brodeur/": "/maker/"}

#: Prefixes with an id after them.
_CLIENT_PREFIXES = ("piece/", "maker/")


def _is_client_route(path: str) -> bool:
    clean = path.replace("\\", "/").strip("/")
    return clean in _CLIENT_ROUTES or clean.startswith(_CLIENT_PREFIXES)


app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


@app.on_event("startup")
def boot() -> None:
    db.init()
    removed = db.purge_expired_sessions()
    print(
        f"[ptd] db={config.DB_PATH} google={'on' if config.GOOGLE_ENABLED else 'OFF'} "
        f"origin={config.PUBLIC_ORIGIN} purged_sessions={removed}"
        # Said out loud every time, because a sign-in bypass that runs quietly is
        # one nobody remembers is running.
        + (
            "\n[ptd] DEV LOGIN IS ON — visit /api/auth/dev/login to sign in without "
            "Google. Never reachable when Google is configured."
            if config.DEV_LOGIN
            else ""
        ),
        flush=True,
    )


# Routers before the static mount: a mount at "/" swallows everything after it.
app.include_router(auth_router)
app.include_router(gallery_router)
app.include_router(reports_router)
app.mount("/", SinglePageFiles(directory=DIST_DIR, html=True), name="site")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    host = os.environ.get("HOST", "127.0.0.1")
    uvicorn.run(app, host=host, port=port)
