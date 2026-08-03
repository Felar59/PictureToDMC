import { useMemo } from "react"

import { findThread } from "@/engine/dmc"
import { cn } from "@/lib/utils"

/**
 * A member's mark: a small cross-stitch motif, unique to them, in real DMC
 * threads.
 *
 * This replaces the Google account photo. That picture was never ours to show —
 * it is a face people uploaded to a different service for a different reason,
 * it arrives from a Google URL on every card in the gallery, and it makes a
 * craft site look like a social network. A stitched patch is what a maker would
 * actually sign their work with, it needs no third party, and it cannot break or
 * leak.
 *
 * Motifs are chosen from a set drawn by hand rather than generated from the hash
 * directly. Random bits produce noise at five squares across; these are small
 * samplers — a cross, a heart, a sprig — so every member's mark reads as
 * something someone meant to stitch. The hash only picks which one and what
 * colours, so it stays the same mark for the same person forever.
 */

/** Five by five, symmetric by hand. `.` bare cloth, `a` and `b` the two threads. */
const MOTIFS = [
  // the cross stitch itself
  ["a...a", ".a.a.", "..b..", ".a.a.", "a...a"],
  // diamond
  ["..a..", ".aba.", "abbba", ".aba.", "..a.."],
  // heart
  [".a.a.", "aabaa", "aaaaa", ".aaa.", "..a.."],
  // flower on a stem
  [".b.b.", "bbabb", ".bab.", "..a..", ".aaa."],
  // rosette — eight-fold symmetric, the way a sampler snowflake is
  [".a.a.", "a.b.a", ".bbb.", "a.b.a", ".a.a."],
  // sampler frame
  ["aaaaa", "a...a", "a.b.a", "a...a", "aaaaa"],
  // checks
  ["ab.ba", "b.a.b", ".aaa.", "b.a.b", "ab.ba"],
  // sprig
  [".a.a.", ".aba.", "..b..", ".bab.", ".a.a."],
] as const

/**
 * Threads the marks are stitched in — real references, spread around the hue
 * wheel and all mid-to-deep so no two ever come out as a pair of near-identical
 * pastels. Resolved through the bundled chart rather than written as hex, so
 * these are the same colours the patterns use.
 */
const THREAD_CODES = [
  "347",
  "3810",
  "3820",
  "987",
  "3835",
  "798",
  "921",
  "3363",
  "3607",
  "3846",
  "832",
  "3746",
]

const PALETTE = THREAD_CODES.map((code) => findThread(code)).filter((t): t is NonNullable<
  typeof t
> => Boolean(t))

/** FNV-1a. Small, stable, and not a security boundary — it picks a colour. */
function hash(seed: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function luminance(rgb: readonly [number, number, number]): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

export function StitchAvatar({
  seed,
  size = 36,
  className,
}: {
  /** Anything stable per member — the id, not the name, so renaming keeps the
   *  same mark. A member who has chosen one of the built-in marks passes that
   *  instead, which is why this takes a string: the same hash then lands on their
   *  choice rather than on their account. */
  seed: string | number
  size?: number
  className?: string
}) {
  const mark = useMemo(() => {
    const h = hash(String(seed))
    const motif = MOTIFS[h % MOTIFS.length]

    const a = PALETTE[(h >>> 4) % PALETTE.length]
    // Step away from the first thread until the pair is actually telling apart.
    let b = a
    for (let step = 1; step <= PALETTE.length; step++) {
      const candidate = PALETTE[((h >>> 12) + step) % PALETTE.length]
      if (Math.abs(luminance(candidate.rgb) - luminance(a.rgb)) > 40) {
        b = candidate
        break
      }
    }

    return { motif, a: a.hex, b: b.hex }
  }, [seed])

  return (
    <svg
      // Seven cells for a five-cell motif: the ring of bare cloth is what keeps
      // the corner stitches off the rounded corner, which was visibly slicing
      // them, and it reads as a hemmed edge rather than a full-bleed tile.
      viewBox="0 0 7 7"
      width={size}
      height={size}
      aria-hidden="true"
      // A patch of cloth, not a portrait: a soft square says fabric where a
      // circle says profile picture. Kept tight — much more rounding and it
      // starts to look like an app icon.
      className={cn("shrink-0 rounded-[18%] bg-aida", className)}
      // Without this the browser antialiases 1-unit rects into a smear.
      shapeRendering="crispEdges"
    >
      {mark.motif.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x + 1}
              y={y + 1}
              width={1}
              height={1}
              fill={c === "a" ? mark.a : mark.b}
            />
          ),
        ),
      )}
    </svg>
  )
}
