// Le serveur et le routeur doivent connaître les mêmes adresses.
//
// `PythonDCA/main.py` tient deux copies à la main de ce que le routeur React sait :
// `_CLIENT_ROUTES`, les chemins qui existent, et `_LEGACY`, les anciens et où ils
// mènent. La duplication est assumée — le serveur ne peut pas importer un module
// TypeScript — mais elle dérive en silence, et les deux dérives sont invisibles
// dans un navigateur :
//
//   * un chemin absent de `_CLIENT_ROUTES` s'affiche quand même, avec un 404 ;
//   * une ancienne adresse absente de `_LEGACY` ne prend plus son 301 : la page
//     s'affiche après une redirection faite en JavaScript, qu'un robot suit mal.
//
// Dans les deux cas un humain ne voit rien et l'indexation se perd.
//
//   node scripts/check-routes-in-sync.mjs
import { readFileSync } from "node:fs"

const root = new URL("..", import.meta.url)
const read = (p) => readFileSync(new URL(p, root), "utf8")

const ts = read("frontend/src/lib/routes.ts")
const py = read("PythonDCA/main.py")

const strip = (p) => p.replace(/^\/+|\/+$/g, "")
const block = (src, re) => (src.match(re) ?? [""])[0]

// Les chemins fixes de `paths`. Les fonctions — /piece/:id, /maker/:id — sont
// couvertes par _CLIENT_PREFIXES et traitées plus bas.
const pathsSrc = block(ts, /export const paths = \{[\s\S]*?\n\} as const/)
const declared = [...pathsSrc.matchAll(/^\s*\w+:\s*"([^"]+)"/gm)].map((m) => strip(m[1]))

// Les anciennes adresses et leur destination.
const legacySrc = block(ts, /export const legacyRedirects[\s\S]*?\n\]/)
const legacyPairs = [...legacySrc.matchAll(/\["([^"]+)",\s*(?:paths\.(\w+)|"([^"]+)")\]/g)].map((m) => ({
  from: strip(m[1]),
  to: m[2] ?? strip(m[3] ?? ""),
}))

const serverRoutes = new Set(
  [...block(py, /_CLIENT_ROUTES = \{[\s\S]*?\n\}/).matchAll(/^\s*"([^"]*)"/gm)].map((m) => strip(m[1])),
)
const prefixes = [...block(py, /_CLIENT_PREFIXES = \([^)]*\)/).matchAll(/"([^"]+)"/g)].map((m) => m[1])
const serverLegacy = new Map(
  [...block(py, /_LEGACY = \{[\s\S]*?\n\}/).matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => [
    strip(m[1]),
    m[2],
  ]),
)

// Nom de clé dans `paths` -> chemin, pour comparer les destinations.
const byKey = new Map([...pathsSrc.matchAll(/^\s*(\w+):\s*"([^"]+)"/gm)].map((m) => [m[1], m[2]]))

let bad = 0
const fail = (msg, lines) => {
  console.error(`  ÉCHEC ${msg}`)
  for (const l of lines) console.error(`         ${l}`)
  bad++
}

// 1. Tout chemin que le routeur sert doit exister côté serveur, sinon 404.
const covered = (p) => serverRoutes.has(p) || prefixes.some((pre) => `${p}/`.startsWith(pre))
const missing = declared.filter((p) => !covered(p) && !legacyPairs.some((l) => l.from === p))
if (missing.length) fail(`${missing.length} chemin(s) absent(s) de _CLIENT_ROUTES — ils répondront 404 :`, missing.map((p) => `/${p}`))
else console.log(`  OK    les ${declared.length} chemins du routeur sont connus du serveur`)

// 2. Toute ancienne adresse doit avoir son 301 côté serveur, vers la même cible.
const noRedirect = legacyPairs.filter((l) => !serverLegacy.has(l.from))
const wrongTarget = legacyPairs
  .filter((l) => serverLegacy.has(l.from))
  .map((l) => {
    const expected = byKey.get(l.to) ?? (l.to.startsWith("/") ? l.to : `/${l.to}`)
    const actual = serverLegacy.get(l.from)
    return actual === expected ? null : `/${l.from} -> ${actual} (le routeur dit ${expected})`
  })
  .filter(Boolean)

if (noRedirect.length) fail(`${noRedirect.length} ancienne(s) adresse(s) sans 301 dans _LEGACY :`, noRedirect.map((l) => `/${l.from}`))
else if (wrongTarget.length) fail(`${wrongTarget.length} redirection(s) qui ne mènent pas au même endroit :`, wrongTarget)
else console.log(`  OK    les ${legacyPairs.length} anciennes adresses ont leur 301, vers la même cible`)

if (!prefixes.length) fail("_CLIENT_PREFIXES illisible dans main.py", [])
else console.log(`  OK    préfixes à identifiant : ${prefixes.join(" ")}`)

process.exit(bad ? 1 : 0)
