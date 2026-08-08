// Le serveur et le routeur doivent connaître les mêmes adresses.
//
// `PythonDCA/main.py` tient une copie à la main des chemins que React sait rendre.
// C'est une duplication assumée — le serveur ne peut pas importer du TypeScript —
// mais elle dérive en silence : quand une adresse manque côté serveur, la page
// s'affiche quand même et répond 404. Personne ne le voit dans un navigateur, et un
// robot n'indexe rien.
//
//   node scripts/check-routes-in-sync.mjs
import { readFileSync } from "node:fs"

const root = new URL("..", import.meta.url)
const read = (p) => readFileSync(new URL(p, root), "utf8")

const ts = read("frontend/src/lib/routes.ts")
const py = read("PythonDCA/main.py")

const strip = (p) => p.replace(/^\/+|\/+$/g, "")

// Les chemins fixes de `paths` (on écarte les fonctions : /piece/:id et /maker/:id
// sont couverts par _CLIENT_PREFIXES).
const pathsBlock = ts.match(/export const paths = \{([\s\S]*?)\n\} as const/)
const declared = pathsBlock ? [...pathsBlock[1].matchAll(/^\s*\w+:\s*"([^"]+)"/gm)].map((m) => strip(m[1])) : []

// Et les anciennes adresses, qui doivent répondre pour que la redirection ait lieu.
const legacyBlock = ts.match(/export const legacyRedirects[\s\S]*?\n\]/)
const legacy = legacyBlock ? [...legacyBlock[0].matchAll(/\["([^"]+)"/g)].map((m) => strip(m[1])) : []

const serverBlock = py.match(/_CLIENT_ROUTES = \{([\s\S]*?)\n\}/)
const server = new Set(
  serverBlock ? [...serverBlock[1].matchAll(/"([^"]*)"/g)].map((m) => strip(m[1])) : [],
)
const prefixes = [...py.matchAll(/_CLIENT_PREFIXES = \(([^)]*)\)/g)]
  .flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]))

const wanted = [...new Set([...declared, ...legacy])]
const missing = wanted.filter((p) => !server.has(p) && !prefixes.some((pre) => `${p}/`.startsWith(pre)))
const stray = [...server].filter((p) => p !== "" && !wanted.includes(p))

let bad = 0
if (missing.length) {
  console.error(`  ÉCHEC ${missing.length} adresse(s) absente(s) de _CLIENT_ROUTES — elles répondront 404 :`)
  for (const m of missing) console.error(`         /${m}`)
  bad++
} else {
  console.log(`  OK    les ${wanted.length} adresses du routeur sont connues du serveur`)
}

if (stray.length) {
  console.log(`  NOTE  ${stray.length} entrée(s) côté serveur que le routeur ne déclare plus :`)
  for (const s of stray) console.log(`         /${s}`)
} else {
  console.log("  OK    aucune entrée orpheline côté serveur")
}

if (!prefixes.length) {
  console.error("  ÉCHEC _CLIENT_PREFIXES illisible dans main.py")
  bad++
} else {
  console.log(`  OK    préfixes à identifiant : ${prefixes.join(" ")}`)
}

process.exit(bad ? 1 : 0)
