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

/** The six threads the berry demo is matched to, in the design's order. */
export const demoThreads = [
  { code: "321", name: "Red", hex: "#D9463F" },
  { code: "815", name: "Garnet Medium", hex: "#B23A34" },
  { code: "913", name: "Nile Green Medium", hex: "#6FAE7C" },
  { code: "890", name: "Pistachio Very Dark", hex: "#4E8A5F" },
  { code: "727", name: "Topaz Very Light", hex: "#F2CE6B" },
  { code: "Ecru", name: "Ecru", hex: "#F3ECDC" },
]
