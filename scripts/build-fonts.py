"""Recupere les trois polices depuis Google et les reduit a ce que le site rend.

    python scripts/build-fonts.py

A relancer si une famille, une graisse ou une version change — et penser alors a
incrementer VERSION ci-dessous ET les deux endroits qui nomment les fichiers : les
@font-face de frontend/src/index.css et les <link rel=preload> de
frontend/index.html. C'est ce nom versionne qui autorise le cache d'un an pose par
PythonDCA/main.py (SinglePageFiles.IMMUTABLE).

Pourquoi les polices sont servies par ce site plutot que par Google :

  * deux origines de moins sur le chemin critique du premier rendu. La feuille de
    style venait de fonts.googleapis.com et les fichiers de fonts.gstatic.com : il
    fallait resoudre et negocier les deux avant qu'un mot puisse s'afficher dans la
    bonne police ;
  * la page d'accueil affirme qu'une photo « ne quitte jamais votre navigateur », et
    une requete de police envoyait pourtant l'IP de chaque visiteur chez Google a
    chaque visite.

Deux reductions, mesurees :

  1. le sous-ensemble « latin » — celui que le navigateur telechargeait deja ;
  2. l'axe de graisse restreint aux valeurs REELLEMENT peintes, relevees dans le
     navigateur sur les huit pages et non supposees : Fredoka 400-600, Nunito Sans
     400-800, Shantell Sans 400-500. Le <link> demandait en plus Fredoka 700 et
     Nunito 600, qui n'apparaissent sur aucune page.

Les fichiers restent variables — c'est ce que Google sert, et c'est pourquoi trois
fichiers suffisent pour dix graisses.
"""

import io
import os
import re
import sys
import urllib.request

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "frontend", "public", "fonts")
VERSION = "v1"

#: Ce que le site demandait avant d'heberger ses polices. Garde tel quel : c'est la
#: reference de ce qui etait telecharge, et Google renvoie le meme fichier variable
#: quelles que soient les graisses listees.
CSS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Fredoka:wght@400;500;600;700"
    "&family=Nunito+Sans:wght@400;600;700;800"
    "&family=Shantell+Sans:wght@400;500"
    "&display=swap"
)

#: famille -> (bornes de l'axe wght a conserver, nom du fichier)
KEEP = {
    "Fredoka": ((400, 600), "fredoka"),
    "Nunito Sans": ((400, 800), "nunito-sans"),
    "Shantell Sans": ((400, 500), "shantell-sans"),
}

# L'User-Agent decide du format : sans lui, Google repond en TTF plutot qu'en woff2.
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/125 Safari/537.36"
)


def fetch(url: str) -> bytes:
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA})).read()


def main() -> int:
    css = fetch(CSS_URL).decode("utf-8")
    os.makedirs(OUT, exist_ok=True)
    todo = dict(KEEP)
    before = after = 0

    for subset, body in re.findall(r"/\*\s*([a-z-]+)\s*\*/\s*@font-face\s*\{(.*?)\}", css, re.S):
        # Le francais tient dans « latin » : les accents et l'oe lie y sont
        # (U+0000-00FF et U+0152-0153).
        if subset != "latin":
            continue
        family = re.search(r"font-family:\s*'([^']+)'", body).group(1)
        if family not in todo:
            continue
        (lo, hi), slug = todo.pop(family)
        raw = fetch(re.search(r"url\((https://[^)]+)\)", body).group(1))

        font = TTFont(io.BytesIO(raw))
        axis = None
        if "fvar" in font:
            axis = next((a for a in font["fvar"].axes if a.axisTag == "wght"), None)
        font = instancer.instantiateVariableFont(font, {"wght": (lo, hi)}, updateFontNames=False)
        font.flavor = "woff2"
        path = os.path.join(OUT, f"{slug}-{VERSION}.woff2")
        font.save(path)

        small = os.path.getsize(path)
        before += len(raw)
        after += small
        was = f"{axis.minValue:.0f}-{axis.maxValue:.0f}" if axis else "?"
        print(f"  {family:16} wght {was:9} -> {lo}-{hi}   {len(raw)/1024:6.1f} kB -> {small/1024:6.1f} kB")

    if todo:
        print(f"  familles introuvables dans le CSS de Google : {list(todo)}", file=sys.stderr)
        return 1

    print(f"\n  {after/1024:.1f} kB dans {OUT}")
    print(f"  soit {(before - after)/1024:.1f} kB de moins que les fichiers servis par Google")
    print("  si VERSION a change : mettre a jour frontend/src/index.css et frontend/index.html")
    return 0


if __name__ == "__main__":
    sys.exit(main())
