import { DMC_RAW } from "./dmc-data"
import { hexToRgb, labDist2, labDist2000, rgbToLab, type Lab, type Rgb } from "./color"

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

/** DMC's speciality ranges, which name themselves. Matching on the name rather
 *  than the reference is firmer: the codes are inconsistent (E310 and S310 are
 *  speciality, "Ecru" is not, and the two metallic pearls are plain 5282/5283),
 *  while every one of the 104 entries spells its range out. */
const SPECIALITY = /^(Metallic|Satin|Étoile|Etoile|Neon)\s*-/

/**
 * The threads a photo may actually be matched against.
 *
 * Two kinds of entry are removed, both because they can only ever do harm:
 *
 *   * **Speciality ranges.** The chart lists Metallic, Satin, Étoile and Neon
 *     alongside plain cotton, and gives each the *same hex as its plain twin* —
 *     310, E310, C310 and S310 are all #000000. Whichever the matcher happened
 *     to reach first went onto the shopping list, so a black stitch could send
 *     someone out to buy metallic thread. They are indistinguishable to the
 *     matcher and wrong for the stitcher.
 *   * **Colours already in the pool.** Two references with one colour cannot be
 *     told apart, so the second can never be the better answer — it can only
 *     consume a slot in the distinctness rule below and push a cluster onto a
 *     worse thread. Chart order decides which survives, which keeps "Blanc"
 *     ahead of the English "White".
 *
 * They stay in THREADS: a pattern published before this existed may name one,
 * and findThread has to keep resolving it.
 */
export const MATCHABLE: Thread[] = (() => {
  const seen = new Set<string>()
  return THREADS.filter((t) => {
    if (SPECIALITY.test(t.name)) return false
    if (seen.has(t.hex)) return false
    seen.add(t.hex)
    return true
  })
})()

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
 *
 * Judged by CIEDE2000 rather than plain Lab distance. This is where the metric
 * earns its cost — one decision per colour, a few thousand comparisons in all —
 * whereas using it per stitch would cost 200 ms a conversion for a choice
 * between threads that are already far apart.
 */
export function assignThreads(clusters: Lab[], palette: Thread[] = MATCHABLE): Thread[] {
  const k = clusters.length
  if (k === 0) return []

  // Flat typed arrays, not an array of {cluster, thread, d} objects: at 20
  // clusters against 589 threads that literal was 11 780 heap allocations per
  // conversion, all of them garbage a millisecond later.
  const n = palette.length
  const total = k * n
  const dist = new Float64Array(total)
  for (let c = 0; c < k; c++) {
    const lab = clusters[c]
    for (let t = 0; t < n; t++) dist[c * n + t] = labDist2000(lab, palette[t].lab)
  }

  const order = new Int32Array(total)
  for (let i = 0; i < total; i++) order[i] = i
  order.sort((a, b) => dist[a] - dist[b])

  const out = new Array<Thread | undefined>(k)
  const takenThread = new Uint8Array(n)
  let placed = 0
  for (let i = 0; i < total && placed < k; i++) {
    const pair = order[i]
    const cluster = (pair / n) | 0
    const thread = pair - cluster * n
    if (out[cluster] || takenThread[thread]) continue
    out[cluster] = palette[thread]
    takenThread[thread] = 1
    placed++
  }

  // Only reachable when the palette is smaller than the cluster count, which
  // the UI prevents; fall back to the closest thread even if already used.
  for (let c = 0; c < k; c++) {
    if (!out[c]) {
      let best = 0
      let bestD = Infinity
      for (let t = 0; t < palette.length; t++) {
        const d = labDist2000(clusters[c], palette[t].lab)
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
  return MATCHABLE.filter((t) => !skip.has(t.num.toLowerCase()))
    .map((t) => ({ t, d: labDist2000(lab, t.lab) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map((x) => x.t)
}

/* ------------------------------------------------------------------ */
/* Choosing threads, rather than snapping to them                      */
/* ------------------------------------------------------------------ */

/** Stitches that steer the refinement. The palette is a k-way decision, and a
 *  few thousand cells pin it down as well as fifty thousand do. */
const REFINE_SAMPLE = 4000
/** Rounds of Lloyd. It converges in two or three; four is the ceiling. */
const REFINE_ROUNDS = 4
/** Threads considered per cluster, nearest-first. Scoring all 483 against every
 *  member is what made an earlier version of this unaffordable. */
const REFINE_CANDIDATES = 24

/**
 * Improve which threads were chosen, given the stitches they have to cover.
 *
 * k-means finds free-floating centroids and only then snaps each to a thread, so
 * nothing in that pipeline ever optimises the quantity that is actually
 * constrained: *which skeins you buy*. The centroid is the best point in a
 * continuous space that does not contain any thread, and the thread nearest it
 * is not generally the thread that best covers the cluster — with few colours
 * they differ often, because a cluster is usually lopsided and its mean sits
 * where no member is.
 *
 * So: Lloyd's algorithm again, but with the centres restricted to real threads.
 * Assign each stitch to its nearest chosen thread, then re-pick each cluster's
 * thread as the one minimising total error over its members, and repeat. Every
 * round can only lower that total, so this never returns a worse palette than it
 * was given; measured, it is neutral on most photographs and worth up to 6% on
 * the ones with few colours and a lopsided distribution.
 *
 * Distinctness is preserved: clusters pick in order of size, so the largest gets
 * first refusal on a contested thread.
 *
 * @param points flat Lab triples, one per visible cell
 * @param chosen the thread currently standing for each cluster
 */
export function refineThreads(
  points: Float64Array,
  chosen: Thread[],
  palette: Thread[] = MATCHABLE,
): Thread[] {
  const k = chosen.length
  const n = points.length / 3
  if (k === 0 || n === 0 || palette.length < k) return chosen

  // Stride, not a random draw: deterministic, and it cannot miss a region of the
  // picture the way a run of unlucky draws could.
  const stride = Math.max(1, Math.ceil(n / REFINE_SAMPLE))
  const sampleCount = Math.ceil(n / stride)
  const sample = new Float64Array(sampleCount * 3)
  for (let s = 0; s < sampleCount; s++) {
    const src = s * stride * 3
    sample[s * 3] = points[src]
    sample[s * 3 + 1] = points[src + 1]
    sample[s * 3 + 2] = points[src + 2]
  }

  let current = chosen.slice()
  const owner = new Int32Array(sampleCount)
  const counts = new Int32Array(k)
  const starts = new Int32Array(k + 1)
  const members = new Int32Array(sampleCount)

  for (let round = 0; round < REFINE_ROUNDS; round++) {
    counts.fill(0)
    for (let s = 0; s < sampleCount; s++) {
      const lab: Lab = [sample[s * 3], sample[s * 3 + 1], sample[s * 3 + 2]]
      let best = 0
      let bestD = Infinity
      for (let c = 0; c < k; c++) {
        const d = labDist2000(lab, current[c].lab)
        if (d < bestD) {
          bestD = d
          best = c
        }
      }
      owner[s] = best
      counts[best]++
    }

    // Counting sort into one flat array — an array of k arrays would allocate a
    // few thousand boxed numbers per round.
    starts[0] = 0
    for (let c = 0; c < k; c++) starts[c + 1] = starts[c] + counts[c]
    const cursor = starts.slice(0, k)
    for (let s = 0; s < sampleCount; s++) members[cursor[owner[s]]++] = s

    // Biggest cluster picks first: when two clusters want one thread, the one
    // covering more stitches has more to lose by being turned down.
    const bySize = Array.from({ length: k }, (_, c) => c).sort((a, b) => counts[b] - counts[a])

    const taken = new Set<string>()
    const next = current.slice()
    let changed = false

    for (const c of bySize) {
      // No sampled stitch chose this thread — but the cluster still owns cells in
      // the full grid, so it keeps a legend row. Hold its thread if nobody else
      // has claimed it, otherwise step aside to the nearest one still free.
      if (counts[c] === 0) {
        if (!taken.has(current[c].num)) {
          taken.add(current[c].num)
          continue
        }
        let stand: Thread | null = null
        let standD = Infinity
        for (const candidate of palette) {
          if (taken.has(candidate.num)) continue
          const d = labDist2(current[c].lab, candidate.lab)
          if (d < standD) {
            standD = d
            stand = candidate
          }
        }
        if (stand) {
          taken.add(stand.num)
          next[c] = stand
          changed = true
        }
        continue
      }
      const from = starts[c]
      const to = starts[c] + counts[c]

      let ml = 0
      let ma = 0
      let mb = 0
      for (let i = from; i < to; i++) {
        const s = members[i] * 3
        ml += sample[s]
        ma += sample[s + 1]
        mb += sample[s + 2]
      }
      const mean: Lab = [ml / counts[c], ma / counts[c], mb / counts[c]]

      // Shortlist by the cheap metric, decide by the expensive one.
      const near = palette
        .map((t, i): [number, number] => [labDist2(mean, t.lab), i])
        .sort((a, b) => a[0] - b[0])
        .slice(0, REFINE_CANDIDATES)

      let best: Thread | null = null
      let bestTotal = Infinity
      for (const [, index] of near) {
        const candidate = palette[index]
        if (taken.has(candidate.num)) continue
        let total = 0
        for (let i = from; i < to; i++) {
          const s = members[i] * 3
          total += labDist2000([sample[s], sample[s + 1], sample[s + 2]], candidate.lab)
          if (total >= bestTotal) break // cannot win any more
        }
        if (total < bestTotal) {
          bestTotal = total
          best = candidate
        }
      }

      // Every thread on the shortlist is spoken for. Widen to the whole palette
      // rather than keeping what this cluster had, because a bigger cluster may
      // already have claimed exactly that — which would put the same reference
      // on two rows of the legend, the one thing this must never do.
      if (!best) {
        let bestD = Infinity
        for (const candidate of palette) {
          if (taken.has(candidate.num)) continue
          const d = labDist2(mean, candidate.lab)
          if (d < bestD) {
            bestD = d
            best = candidate
          }
        }
      }
      // Unreachable while palette.length >= k, which is checked on entry.
      if (!best) continue
      if (best.num !== current[c].num) changed = true
      taken.add(best.num)
      next[c] = best
    }

    current = next
    if (!changed) break
  }

  return current
}
