import { DMC_RAW } from "./dmc-data"
import { hexToRgb, labDist2, rgbToLab, type Lab, type Rgb } from "./color"

export type Thread = {
  /** DMC reference as printed on the skein — "350", "Ecru", "E310". */
  num: string
  name: string
  hex: string
  rgb: Rgb
  lab: Lab
}

/** All 589 threads, in chart order. Parsed once at module load (~1 ms). */
export const THREADS: Thread[] = DMC_RAW.split("\n").map((line) => {
  const [num, name, hex6] = line.split("|")
  const rgb = hexToRgb(hex6)
  return { num, name, hex: `#${hex6}`, rgb, lab: rgbToLab(rgb[0], rgb[1], rgb[2]) }
})

const BY_NUM = new Map(THREADS.map((t) => [t.num.toLowerCase(), t]))

export function findThread(num: string): Thread | undefined {
  return BY_NUM.get(num.trim().toLowerCase())
}

/**
 * Assign one distinct thread to each colour the quantiser produced.
 *
 * Distinct matters: two clusters landing on the same skein would collapse two
 * visibly different regions of the photo into one colour, and the legend would
 * list the same reference twice.
 *
 * Assignment is global-greedy — every (cluster, thread) pair sorted by
 * distance, best pair wins, both sides struck off, repeat. The old backend
 * instead walked the image in raster order and let whoever came first claim a
 * shade, so the thread a colour got depended on where it happened to appear.
 * Greedy is not provably optimal (that would be Hungarian) but with at most 20
 * clusters against 589 threads the difference is nil, and it is O(k·n log)
 * instead of O(k³).
 */
export function assignThreads(clusters: Lab[], palette: Thread[] = THREADS): Thread[] {
  const k = clusters.length
  if (k === 0) return []

  type Pair = { cluster: number; thread: number; d: number }
  const pairs: Pair[] = []
  for (let c = 0; c < k; c++) {
    for (let t = 0; t < palette.length; t++) {
      pairs.push({ cluster: c, thread: t, d: labDist2(clusters[c], palette[t].lab) })
    }
  }
  pairs.sort((a, b) => a.d - b.d)

  const out = new Array<Thread | undefined>(k)
  const takenThread = new Set<number>()
  let placed = 0
  for (const p of pairs) {
    if (placed === k) break
    if (out[p.cluster] || takenThread.has(p.thread)) continue
    out[p.cluster] = palette[p.thread]
    takenThread.add(p.thread)
    placed++
  }

  // Only reachable when the palette is smaller than the cluster count, which
  // the UI prevents; fall back to the closest thread even if already used.
  for (let c = 0; c < k; c++) {
    if (!out[c]) {
      let best = 0
      let bestD = Infinity
      for (let t = 0; t < palette.length; t++) {
        const d = labDist2(clusters[c], palette[t].lab)
        if (d < bestD) {
          bestD = d
          best = t
        }
      }
      out[c] = palette[best]
    }
  }

  return out as Thread[]
}

/** The n closest threads to a colour, excluding some references. */
export function nearestThreads(lab: Lab, count: number, exclude: Iterable<string> = []): Thread[] {
  const skip = new Set([...exclude].map((s) => s.toLowerCase()))
  return THREADS.filter((t) => !skip.has(t.num.toLowerCase()))
    .map((t) => ({ t, d: labDist2(lab, t.lab) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map((x) => x.t)
}
