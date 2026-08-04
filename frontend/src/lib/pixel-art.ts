// Pixel map lifted verbatim from the design system's renderVals().
// The berry is the demo pattern shown on the homepage (photo -> stitches)
// and as the converter's empty-state canvas.

export type Px = { k: string; c: string }

function mk(rows: string[], map: Record<string, string>): Px[] {
  const out: Px[] = []
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => out.push({ k: `${y}-${x}`, c: map[ch] ?? "transparent" })),
  )
  return out
}

export const BERRY_COLS = 16
export const berry = mk(
  [
    "................",
    "......gg.gg.....",
    ".....gggggg.....",
    "....G.gGgg......",
    "......rrrr......",
    "....rrrrrrrr....",
    "...rrryrrryrr...",
    "...rrrrrrrrrr...",
    "...ryrrryrrrr...",
    "..drrrrrrrryr...",
    "..drryrrrrrr....",
    "...drrrrryrr....",
    "...ddrrrrrr.....",
    "....ddrrrr......",
    ".....ddrr.......",
    "................",
  ],
  { r: "#D9463F", d: "#B23A34", g: "#6FAE7C", G: "#4E8A5F", y: "#F2CE6B", ".": "#F3ECDC" },
)

/**
 * The threads the hero's example is actually made of.
 *
 * Copied off the chart the converter produced for that strawberry, most-used
 * first, rather than picked to look nice: the row beside them claims the photo was
 * matched to this many DMC threads, and it is the first claim the site makes.
 * These are the eight it really used, with their real chart colours — 606 Bright
 * Orange-red at 1 251 stitches down to 740 Tangerine at 121.
 */
export const demoThreads = [
  { code: "606", name: "Orange-red - Bright", hex: "#F70F00" },
  { code: "666", name: "Red - Bright", hex: "#CE1B33" },
  { code: "956", name: "Geranium", hex: "#F7566D" },
  { code: "3326", name: "Rose - Light", hex: "#F9979C" },
  { code: "581", name: "Moss Green", hex: "#838A29" },
  { code: "347", name: "Salmon - Very Dark", hex: "#AB1B33" },
  { code: "166", name: "Lime Green", hex: "#ADC238" },
  { code: "740", name: "Tangerine", hex: "#FD6F1A" },
]
