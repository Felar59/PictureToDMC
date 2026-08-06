// Chaque fil que le convertisseur peut proposer doit avoir un nom français.
//
// Sans ce contrôle, un fil manquant s'affiche en anglais au milieu d'une liste
// française — visible seulement si on tombe précisément sur cette couleur, ce qui
// n'arrive qu'en production. Et une entrée de trop est le signe inverse : la charte
// a changé sous la table.
//
//   node scripts/check-thread-names.mjs
import { readFileSync } from "node:fs"

const root = new URL("..", import.meta.url)
const read = (p) => readFileSync(new URL(p, root), "utf8")

// Les mêmes gammes que dmc.ts écarte : elles ne sont jamais appariées, donc jamais
// affichées, donc pas à traduire.
const SPECIALITY = /^(Metallic|Satin|Étoile|Etoile|Neon)\s*-/

const raw = read("frontend/src/engine/dmc-data.ts")
const body = raw.slice(raw.indexOf('"') + 1, raw.lastIndexOf('"'))
const cotton = body
  .split("\\n")
  .filter(Boolean)
  .map((line) => line.split("|"))
  .filter(([, name]) => !SPECIALITY.test(name))

const src = read("frontend/src/engine/dmc-names-fr.ts")
const table = (label) => {
  const start = src.indexOf(`const ${label}: Record<string, string> = {`)
  const end = src.indexOf("\n}", start)
  const block = src.slice(start, end)
  const out = new Map()
  for (const m of block.matchAll(/^\s*(?:"([^"]+)"|([A-Za-z][A-Za-z0-9]*)):\s*"([^"]*)"/gm)) {
    out.set(m[1] ?? m[2], m[3])
  }
  return out
}

const BASES = table("BASES")
const SHADES = table("SHADES")

const missing = []
const usedBases = new Set()
const usedShades = new Set()

for (const [num, name] of cotton) {
  if (BASES.has(name)) {
    usedBases.add(name)
    continue
  }
  const cut = name.lastIndexOf(" - ")
  const base = cut > 0 ? name.slice(0, cut) : null
  const shade = cut > 0 ? name.slice(cut + 3) : null
  if (base && BASES.has(base) && SHADES.has(shade)) {
    usedBases.add(base)
    usedShades.add(shade)
    continue
  }
  missing.push(`${num} — ${name}`)
}

let bad = 0
if (missing.length) {
  console.error(`  ÉCHEC ${missing.length} fil(s) sans nom français :`)
  for (const m of missing.slice(0, 15)) console.error(`         ${m}`)
  if (missing.length > 15) console.error(`         … et ${missing.length - 15} autre(s)`)
  bad++
} else {
  console.log(`  OK    les ${cotton.length} fils coton ont un nom français`)
}

// Une entrée qui ne sert plus veut dire que la charte a bougé : ce n'est pas une
// erreur, mais c'est du français qui ne s'affichera jamais.
const strayBases = [...BASES.keys()].filter((k) => !usedBases.has(k))
const strayShades = [...SHADES.keys()].filter((k) => !usedShades.has(k))
if (strayBases.length || strayShades.length) {
  console.log(`  NOTE  ${strayBases.length} base(s) et ${strayShades.length} nuance(s) inutilisées :`)
  for (const s of [...strayBases, ...strayShades].slice(0, 10)) console.log(`         ${s}`)
} else {
  console.log(`  OK    aucune entrée inutilisée (${BASES.size} bases, ${SHADES.size} nuances)`)
}

// Deux bases traduites pareil, c'est presque toujours une faute de copie. Rose et
// Pink font exception : le français n'a qu'un mot.
const byFrench = new Map()
for (const [en, fr] of BASES) {
  if (!byFrench.has(fr)) byFrench.set(fr, [])
  byFrench.get(fr).push(en)
}
const ALLOWED_DUPES = [["Pink", "Rose"]]
const dupes = [...byFrench.entries()]
  .filter(([, list]) => list.length > 1)
  .filter(([, list]) => !ALLOWED_DUPES.some((a) => a.length === list.length && a.every((x) => list.includes(x))))
if (dupes.length) {
  console.error("  ÉCHEC deux bases différentes portent le même nom français :")
  for (const [fr, list] of dupes) console.error(`         « ${fr} » <- ${list.join(", ")}`)
  bad++
} else {
  console.log("  OK    aucun doublon involontaire")
}

// Les neuf fils de demonstration de la page d'accueil ecrivent leur nom francais a
// la main, parce que ce module est dans le premier paquet et que la table entiere
// pour neuf infobulles serait un mauvais echange. Ils doivent dire la meme chose.
const demo = read("frontend/src/lib/pixel-art.ts")
const rows = [...demo.matchAll(/name: "([^"]+)", nameFr: "([^"]+)"/g)]
if (!rows.length) {
  console.error("  ÉCHEC aucun fil de demonstration lu dans pixel-art.ts")
  bad++
} else {
  const wrong = rows
    .map(([, en, fr]) => {
      let expected = BASES.get(en)
      if (!expected) {
        const cut = en.lastIndexOf(" - ")
        const base = cut > 0 ? BASES.get(en.slice(0, cut)) : null
        const shade = cut > 0 ? SHADES.get(en.slice(cut + 3)) : null
        expected = base && shade ? `${base} ${shade}` : null
      }
      return expected === fr ? null : `${en} : « ${fr} » écrit, « ${expected ?? "?"} » attendu`
    })
    .filter(Boolean)
  if (wrong.length) {
    console.error("  ÉCHEC les fils de demonstration ne suivent plus la table :")
    for (const w of wrong) console.error(`         ${w}`)
    bad++
  } else {
    console.log(`  OK    les ${rows.length} fils de démonstration disent la même chose que la table`)
  }
}

process.exit(bad ? 1 : 0)
