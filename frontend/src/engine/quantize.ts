/**
 * k-means over Lab, run on the *stitch grid* rather than the photo.
 *
 * This is the whole performance story. A 12 Mpx phone photo reduced to 58
 * stitches wide is 2 552 cells — so there are 2 552 points to cluster, not
 * 12 192 768. The old backend clustered the full-resolution image and then
 * threw 99.98% of it away, which cost 9 seconds of server CPU per conversion.
 *
 * Deterministic on purpose: same photo and same settings must give the same
 * pattern, or the preview would shuffle every time a slider moved. k-means++
 * seeding draws from a fixed PRNG.
 */

/** mulberry32 — small, fast, good enough for seeding centroids. */
function prng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type KMeansResult = {
  /** k centroids, flat: [L,a,b, L,a,b, ...] */
  centroids: Float64Array
  /** one cluster index per input point */
  labels: Int32Array
}

const MAX_ITERATIONS = 60
const SEED = 42

/**
 * @param points flat Lab triples, length = n * 3
 * @param k      requested cluster count; clamped to the number of distinct points
 */
export function kmeans(points: Float64Array, k: number): KMeansResult {
  const n = points.length / 3
  if (n === 0 || k <= 0) return { centroids: new Float64Array(0), labels: new Int32Array(0) }

  // Asking for more colours than the photo actually contains would leave empty
  // clusters and a legend listing threads that appear nowhere.
  const distinct = countDistinct(points, n)
  k = Math.min(k, distinct)

  const rand = prng(SEED)
  const centroids = seedPlusPlus(points, n, k, rand)
  const labels = new Int32Array(n)

  const sums = new Float64Array(k * 3)
  const counts = new Int32Array(k)

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    let moved = false

    for (let i = 0; i < n; i++) {
      const l = points[i * 3]
      const a = points[i * 3 + 1]
      const b = points[i * 3 + 2]
      let best = 0
      let bestD = Infinity
      for (let c = 0; c < k; c++) {
        const dl = l - centroids[c * 3]
        const da = a - centroids[c * 3 + 1]
        const db = b - centroids[c * 3 + 2]
        const d = dl * dl + da * da + db * db
        if (d < bestD) {
          bestD = d
          best = c
        }
      }
      if (labels[i] !== best) {
        labels[i] = best
        moved = true
      }
    }

    sums.fill(0)
    counts.fill(0)
    for (let i = 0; i < n; i++) {
      const c = labels[i]
      sums[c * 3] += points[i * 3]
      sums[c * 3 + 1] += points[i * 3 + 1]
      sums[c * 3 + 2] += points[i * 3 + 2]
      counts[c]++
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] === 0) continue // keep the old position; reseeding would break determinism
      centroids[c * 3] = sums[c * 3] / counts[c]
      centroids[c * 3 + 1] = sums[c * 3 + 1] / counts[c]
      centroids[c * 3 + 2] = sums[c * 3 + 2] / counts[c]
    }

    if (!moved) break // converged
  }

  return { centroids, labels }
}

function countDistinct(points: Float64Array, n: number): number {
  const seen = new Set<string>()
  for (let i = 0; i < n; i++) {
    seen.add(
      `${points[i * 3] | 0},${points[i * 3 + 1] | 0},${points[i * 3 + 2] | 0}`,
    )
    if (seen.size > 64) return seen.size // enough to beat any slider value
  }
  return seen.size
}

/** k-means++: each new centroid is drawn with probability proportional to its
 *  squared distance from the nearest chosen one. Far better starting spread
 *  than random picks, which is what keeps MAX_ITERATIONS low. */
function seedPlusPlus(
  points: Float64Array,
  n: number,
  k: number,
  rand: () => number,
): Float64Array {
  const centroids = new Float64Array(k * 3)
  const first = Math.floor(rand() * n)
  centroids[0] = points[first * 3]
  centroids[1] = points[first * 3 + 1]
  centroids[2] = points[first * 3 + 2]

  const best = new Float64Array(n).fill(Infinity)

  for (let c = 1; c < k; c++) {
    let total = 0
    for (let i = 0; i < n; i++) {
      const dl = points[i * 3] - centroids[(c - 1) * 3]
      const da = points[i * 3 + 1] - centroids[(c - 1) * 3 + 1]
      const db = points[i * 3 + 2] - centroids[(c - 1) * 3 + 2]
      const d = dl * dl + da * da + db * db
      if (d < best[i]) best[i] = d
      total += best[i]
    }

    let target = rand() * total
    let pick = n - 1
    for (let i = 0; i < n; i++) {
      target -= best[i]
      if (target <= 0) {
        pick = i
        break
      }
    }
    centroids[c * 3] = points[pick * 3]
    centroids[c * 3 + 1] = points[pick * 3 + 1]
    centroids[c * 3 + 2] = points[pick * 3 + 2]
  }

  return centroids
}
