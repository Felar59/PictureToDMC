// La table des marques doit dire exactement ce que la charte disait.
//
// Pourquoi ce contrôle existe : StitchAvatar résolvait ses douze couleurs à
// travers la charte complète, ce qui mettait les 589 fils dans le premier paquet
// que tout le monde télécharge. La table est maintenant générée. Mais la marque
// d'un membre est choisie par un modulo sur la LONGUEUR de cette liste — donc une
// couleur en moins, ou dans un autre ordre, et la marque de chaque membre change.
// Ce n'est pas rattrapable après coup : personne ne saurait qu'elle a changé.
//
//   node scripts/check-mark-palette.mjs
import { readFileSync } from "node:fs"

const root = new URL("..", import.meta.url)
const read = (p) => readFileSync(new URL(p, root), "utf8")

// Les codes vivent dans le générateur — une seule source.
const block = read("scripts/export-dmc.py").match(/^MARK_CODES = \[([\s\S]*?)\]/m)
const CODES = block ? [...block[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : []

// dmc-data.ts est UNE chaîne dont les lignes sont séparées par la séquence
// d'échappement \n — pas par de vraies fins de ligne.
const chart = new Map()
for (const line of read("frontend/src/engine/dmc-data.ts").split("\\n")) {
  const [num, , hex] = line.replace(/^[^"]*"/, "").split("|")
  if (num && hex) chart.set(num.trim().toLowerCase(), "#" + hex.replace(/"\s*$/, "").trim())
}

const expected = CODES.map((c) => chart.get(c.toLowerCase())).filter(Boolean)
const actual = [...read("frontend/src/components/brand/mark-palette.ts").matchAll(/hex: "(#[0-9A-Fa-f]{6})"/g)].map(
  (m) => m[1],
)

const fail = (msg) => {
  console.error(`  ÉCHEC ${msg}`)
  process.exit(1)
}

if (CODES.length !== 12) fail(`MARK_CODES illisible dans le générateur (${CODES.length} codes lus)`)
if (expected.length !== CODES.length)
  fail(`${CODES.length - expected.length} code(s) introuvable(s) dans la charte — la liste raccourcirait`)
if (actual.length !== expected.length) fail(`la table a ${actual.length} couleurs, la charte en donne ${expected.length}`)
const wrong = expected.map((hex, i) => (hex === actual[i] ? null : `${CODES[i]} : ${hex} attendu, ${actual[i]} écrit`)).filter(Boolean)
if (wrong.length) fail(`la table ne suit plus la charte —\n         ${wrong.join("\n         ")}`)

console.log(`  OK    ${actual.length} couleurs de marque, identiques à la charte — aucune marque de membre ne bouge`)
