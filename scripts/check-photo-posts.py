"""Banc des posts photo : publication, listes, page pièce, carte de partage, signalement.

Sans httpx (absent de l'environnement) : on appelle l'application ASGI à la main.
Base jetable passée par PTD_DB.

    .venv/Scripts/python <scratchpad>/ptd-kind-check.py
"""
import asyncio
import base64
import hashlib
import json
import os
import sys

sys.path.insert(0, os.path.abspath("."))

from PythonDCA.main import app  # noqa: E402
from PythonDCA.api import config, db  # noqa: E402

results = []


def check(label, ok, detail=""):
    results.append(ok)
    print(f"  {'OK   ' if ok else 'ÉCHEC'} {label}{' — ' + str(detail) if detail else ''}")


# ---- une requête, sans client HTTP ------------------------------------------
def call(method, path, body=None, token=None):
    payload = json.dumps(body).encode() if body is not None else b""
    query = ""
    if "?" in path:
        path, query = path.split("?", 1)
    headers = [(b"host", b"test")]
    if body is not None:
        headers.append((b"content-type", b"application/json"))
    if token:
        headers.append((b"cookie", f"{config.SESSION_COOKIE}={token}".encode()))

    state = {"status": None, "headers": {}, "body": b""}

    async def receive():
        return {"type": "http.request", "body": payload, "more_body": False}

    async def send(msg):
        if msg["type"] == "http.response.start":
            state["status"] = msg["status"]
            state["headers"] = {k.decode().lower(): v.decode() for k, v in msg["headers"]}
        elif msg["type"] == "http.response.body":
            state["body"] += msg.get("body", b"")

    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": method,
        "path": path,
        "raw_path": path.encode(),
        "query_string": query.encode(),
        "root_path": "",
        "scheme": "http",
        "headers": headers,
        "client": ("127.0.0.1", 1234),
        "server": ("test", 80),
    }
    asyncio.get_event_loop().run_until_complete(app(scope, receive, send))
    return state


def js(state):
    try:
        return json.loads(state["body"])
    except Exception:
        return {"_raw": state["body"][:120].decode("utf-8", "replace")}


# ---- démarrage + deux comptes ----------------------------------------------
asyncio.set_event_loop(asyncio.new_event_loop())
db.init()
conn = db.connect()
now = db.now_ms()


def seed(name, role, token):
    cur = conn.execute(
        "INSERT INTO users (display_name, role, created_at) VALUES (?,?,?)", (name, role, now)
    )
    uid = cur.lastrowid
    conn.execute(
        "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?,?,?,?)",
        (hashlib.sha256(token.encode()).hexdigest(), uid, now, now + 10**10),
    )
    return uid


member = seed("Brodeuse", "user", "tok-member")
seed("Patronne", "admin", "tok-admin")
seed("Passante", "user", "tok-other")

TINY_PNG = "data:image/png;base64," + base64.b64encode(
    bytes.fromhex(
        "89504e470d0a1a0a0000000d49484452000000010000000108020000009077"
        "3d780000000c4944415408d763f8ffff3f0005fe02fea735a17e0000000049454e44ae426082"
    )
).decode()

print("\n== publication ==")
grid = base64.b64encode(bytes([1, 2, 2, 1])).decode()
pattern = {
    "title": "Chat au point de croix",
    "category": "pets",
    "width": 2,
    "height": 2,
    "cells": grid,
    "threadCodes": ["310", "3799"],
    "thumbnail": TINY_PNG,
}
r = call("POST", "/api/posts", pattern, "tok-member")
check("grille seule (aucun kind envoyé)", r["status"] == 201, js(r))
id_pattern = js(r).get("id")

r = call("POST", "/api/posts", {**pattern, "title": "Chat fini", "photo": TINY_PNG}, "tok-member")
check("grille + photo du rendu", r["status"] == 201, js(r))
id_both = js(r).get("id")

r = call(
    "POST",
    "/api/posts",
    {"title": "Ma premiere broderie", "category": "flowers", "kind": "photo", "photo": TINY_PNG},
    "tok-member",
)
check("photo seule, sans grille", r["status"] == 201, js(r))
id_photo = js(r).get("id")

r = call("POST", "/api/posts", {"title": "Sans rien", "kind": "photo"}, "tok-member")
check("photo sans image refusée (422)", r["status"] == 422, f"HTTP {r['status']}")

r = call("POST", "/api/posts", {"title": "Bidon", "kind": "sculpture", "photo": TINY_PNG}, "tok-member")
check("kind inconnu refusé (422)", r["status"] == 422, f"HTTP {r['status']}")

r = call("POST", "/api/posts", {"title": "Photo anonyme", "kind": "photo", "photo": TINY_PNG})
check("publication anonyme refusée (401)", r["status"] == 401, f"HTTP {r['status']}")

print("\n== base ==")
row = conn.execute("SELECT kind, cells, photo IS NOT NULL AS ph FROM posts WHERE id = ?", (id_photo,)).fetchone()
check("le post photo est en kind='photo'", row["kind"] == "photo", row["kind"])
check("il n'a AUCUNE grille en base (pas de sentinelle)", row["cells"] is None, repr(row["cells"]))
check("sa photo est bien stockée", bool(row["ph"]))
row = conn.execute("SELECT kind, cells IS NOT NULL AS c FROM posts WHERE id = ?", (id_pattern,)).fetchone()
check("la grille reste en kind='pattern'", row["kind"] == "pattern" and row["c"] == 1)

print("\n== listes ==")
r = call("GET", "/api/posts?kind=pattern")
ids = [p["id"] for p in js(r)["posts"]]
check("kind=pattern : les 2 grilles, pas la photo", sorted(ids) == sorted([id_pattern, id_both]), ids)
r = call("GET", "/api/posts?kind=photo")
ids = [p["id"] for p in js(r)["posts"]]
check("kind=photo : la photo seule", ids == [id_photo], ids)
r = call("GET", "/api/posts")
check("sans kind : tout, comme avant", len(js(r)["posts"]) == 3, len(js(r)["posts"]))
r = call("GET", "/api/posts?kind=photo&category=pets")
check("kind + catégorie se combinent", js(r)["posts"] == [], js(r)["posts"])
r = call("GET", "/api/posts?kind=broderie")
check("kind inconnu refusé (422)", r["status"] == 422, f"HTTP {r['status']}")

card = next(p for p in js(call("GET", "/api/posts?kind=photo"))["posts"])
check("la carte photo expose kind", card.get("kind") == "photo", card.get("kind"))
check("aucune dimension inventée", card["width"] is None and card["height"] is None, (card["width"], card["height"]))
check("aucune palette inventée", card["palette"] == [] and card["threadCount"] == 0, (card["palette"], card["threadCount"]))
check("la photo est signalée présente", card["hasPhoto"] is True and card["hasThumb"] is False, (card["hasPhoto"], card["hasThumb"]))

print("\n== une pièce ==")
r = call("GET", f"/api/posts/{id_photo}")
d = js(r)
check("la page pièce d'une photo répond 200", r["status"] == 200, f"HTTP {r['status']}")
check("cells et threadCodes valent null", d["cells"] is None and d["threadCodes"] is None, (d["cells"], d["threadCodes"]))
d = js(call("GET", f"/api/posts/{id_pattern}"))
check("une grille garde sa grille", d["cells"] == grid and d["threadCodes"] == ["310", "3799"], d["threadCodes"])

print("\n== carte de partage ==")
r = call("GET", f"/api/posts/{id_pattern}/share.png")
check("grille : PNG dessiné", r["status"] == 200 and r["body"][:8] == b"\x89PNG\r\n\x1a\n", f"HTTP {r['status']} {len(r['body'])} o")
r = call("GET", f"/api/posts/{id_photo}/share.png")
check("photo : la photo servie (le cas qui plantait)", r["status"] == 200 and len(r["body"]) > 0, f"HTTP {r['status']} {r['headers'].get('content-type')}")
r = call("GET", f"/api/posts/{id_both}/share.png")
check("grille + photo : c'est la grille qui est dessinée", r["body"][:8] == b"\x89PNG\r\n\x1a\n")
r = call("GET", "/api/posts/9999/share.png")
check("post inexistant : 404", r["status"] == 404, f"HTTP {r['status']}")

print("\n== signalement ==")
r = call("POST", f"/api/posts/{id_photo}/report", {"reason": "explicit"}, "tok-other")
check("un membre peut signaler", r["status"] == 200, js(r))
r = call("POST", f"/api/posts/{id_photo}/report", {"reason": "not-mine"}, "tok-other")
check("re-signaler corrige, sans erreur", r["status"] == 200, js(r))
n = conn.execute("SELECT COUNT(*) n, MAX(reason) r FROM reports").fetchone()
check("une seule ligne, motif mis à jour", n["n"] == 1 and n["r"] == "not-mine", (n["n"], n["r"]))
r = call("POST", f"/api/posts/{id_photo}/report", {"reason": "spam"})
check("signalement anonyme refusé (401)", r["status"] == 401, f"HTTP {r['status']}")
r = call("POST", "/api/posts/9999/report", {"reason": "spam"}, "tok-other")
check("signaler un post inexistant : 404", r["status"] == 404, f"HTTP {r['status']}")

r = call("GET", "/api/reports", token="tok-other")
check("la file est invisible pour un membre (404)", r["status"] == 404, f"HTTP {r['status']}")
r = call("GET", "/api/reports")
check("la file est invisible sans compte (401)", r["status"] == 401, f"HTTP {r['status']}")
r = call("GET", "/api/reports", token="tok-admin")
rep = js(r)["reports"] if r["status"] == 200 else []
check("l'admin lit la file", r["status"] == 200 and len(rep) == 1, f"HTTP {r['status']} {len(rep)}")
if rep:
    e = rep[0]
    check("l'entrée dit quoi, qui, et de qui", (e["postId"], e["kind"], e["reporterName"], e["authorName"]) == (id_photo, "photo", "Passante", "Brodeuse"), e)

r = call("DELETE", f"/api/reports/{id_photo}", token="tok-other")
check("un membre ne peut pas classer (404)", r["status"] == 404, f"HTTP {r['status']}")
r = call("DELETE", f"/api/reports/{id_photo}", token="tok-admin")
check("l'admin classe sans toucher au post", r["status"] == 200 and js(r)["cleared"] == 1, js(r))
check("le post signalé existe toujours", bool(conn.execute("SELECT 1 FROM posts WHERE id=?", (id_photo,)).fetchone()))

r = call("POST", f"/api/posts/{id_photo}/report", {"reason": "spam"}, "tok-other")
call("DELETE", f"/api/posts/{id_photo}", token="tok-admin")
check("supprimer le post emporte ses signalements", conn.execute("SELECT COUNT(*) n FROM reports").fetchone()["n"] == 0)

bad = results.count(False)
print(f"\n{'Tout passe.' if not bad else str(bad) + ' échec(s)'} ({len(results)} contrôles)")
sys.exit(1 if bad else 0)
