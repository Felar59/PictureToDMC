"""The server: a community API, plus the built frontend as static files.

The conversion itself does NOT live here — quantisation, DMC matching, rendering
and chart export all run in the browser (frontend/src/engine/). This process only
handles the things that genuinely need a server: who you are, and what everyone
has published.

That split is deliberate. The old build kept the active conversion in a
module-level global, so two people converting at once shared one pattern.
Nothing stateful about a conversion reaches this process any more.
"""

import os

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException
from starlette.responses import Response
from starlette.types import Scope

from .api import config, db
from .api.routes_auth import router as auth_router
from .api.routes_gallery import router as gallery_router

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

    async def get_response(self, path: str, scope: Scope) -> Response:
        try:
            return await super().get_response(path, scope)
        except HTTPException as exc:
            if exc.status_code != 404:
                raise
            # A missing asset is a build problem — let it 404 loudly instead of
            # answering with HTML the browser will then fail to parse as JS.
            #
            # Split on both separators: StaticFiles normalises through
            # os.path.join, so this arrives as "assets/app.js" on the server and
            # "assets\app.js" on a Windows dev machine.
            if path.replace("\\", "/").split("/", 1)[0] == "assets":
                raise
            return await super().get_response("index.html", scope)


app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


@app.on_event("startup")
def boot() -> None:
    db.init()
    removed = db.purge_expired_sessions()
    print(
        f"[ptd] db={config.DB_PATH} google={'on' if config.GOOGLE_ENABLED else 'OFF'} "
        f"origin={config.PUBLIC_ORIGIN} purged_sessions={removed}",
        flush=True,
    )


# Routers before the static mount: a mount at "/" swallows everything after it.
app.include_router(auth_router)
app.include_router(gallery_router)
app.mount("/", SinglePageFiles(directory=DIST_DIR, html=True), name="site")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    host = os.environ.get("HOST", "127.0.0.1")
    uvicorn.run(app, host=host, port=port)
