import { labDist2, rgbToLab, type Lab } from "./color"

/**
 * Adjustments applied between the downscale and the quantiser.
 *
 * All of them work on the stitch grid, not the photo. That is thousands of
 * cells rather than millions of pixels, and for background removal it is also
 * the *right* resolution: the question is "is this stitch background", and a
 * stitch is the unit the answer is needed in.
 */

export type Adjustments = {
  /** 0 = the photo's own colours, 100 = distinctly punchier thread choices. */
  vividness?: number
  /** Drop a plain background so the subject is stitched on bare fabric. */
  removeBackground?: boolean
}

/**
 * Push colours away from grey, in Lab.
 *
 * Photographs are duller than thread. A mid-saturation photo quantised
 * faithfully picks mid-saturation DMC shades, and the finished piece reads flat
 * next to the picture it came from — so a lift here is corrective, not a filter.
 *
 * L is left alone: scaling lightness would blow out faces and crush shadows.
 * Only a and b move, which is exactly "same brightness, more colour".
 */
export function boostChroma(lab: Float64Array, vividness: number): void {
  if (vividness <= 0) return
  // 100 on the slider = 1.6x chroma. Past roughly that, matches start jumping
  // to neon threads that no DMC card actually contains.
  const gain = 1 + (vividness / 100) * 0.6
  for (let i = 0; i < lab.length; i += 3) {
    lab[i + 1] *= gain
    lab[i + 2] *= gain
  }
}

/* ------------------------------------------------------------------ */
/* Background removal                                                  */
/* ------------------------------------------------------------------ */

/** A neighbour joins the background only if it is this close to the cell we
 *  came from. Small on purpose: it is what lets the fill walk a smooth studio
 *  gradient while refusing to step across the edge of a subject. */
const STEP2 = 8 * 8
/** ...and no further than this from the background's own colour, however many
 *  small steps it took to get there. Without the cap, a long gradient lets the
 *  fill drift arbitrarily far from where it started. */
const DRIFT2 = 30 * 30
/** Only border cells this close to the dominant border colour are seeds. */
const SEED2 = 22 * 22
/** If a fill would leave less than this share of the picture, it is wrong. */
const MIN_SUBJECT_SHARE = 0.06

/**
 * Flood-fill the background inward from the edges.
 *
 * Three things make this survive real photographs:
 *
 * 1. **Seeds come from the dominant border colour, not from every border
 *    cell.** A subject usually touches an edge — a dog's chest runs off the
 *    bottom of the frame — and sampling that fur as "background" is what makes
 *    a naive version delete the dog. The dominant colour is a component-wise
 *    median of the border, which a minority intruder cannot move.
 *
 * 2. **Each step is judged against the neighbour, not against a fixed
 *    reference.** Studio backdrops are never flat; they vignette. A local
 *    tolerance walks that gradient, while a sharp edge — fur against sky — is
 *    too big a jump to cross. A drift cap from the dominant colour stops many
 *    small steps from adding up to a different colour entirely.
 *
 * 3. **It refuses to do something absurd.** If the result would erase nearly
 *    the whole picture, the photo has no plain background to find and the fill
 *    is abandoned rather than handing back an empty pattern.
 *
 * Still honest about its limits: this finds a *plain* background. A cat on a
 * patterned rug will not come out cleanly, and the UI says so.
 *
 * @param labs   Lab triples, one per grid cell
 * @param alpha  modified in place: background cells are set to 0
 * @returns whether the fill was kept
 */
export function removeFlatBackground(
  labs: Float64Array,
  alpha: Uint8Array,
  width: number,
  height: number,
): boolean {
  const count = width * height
  if (count === 0) return false

  const at = (i: number): Lab => [labs[i * 3], labs[i * 3 + 1], labs[i * 3 + 2]]

  const border: number[] = []
  for (let x = 0; x < width; x++) {
    border.push(x, (height - 1) * width + x)
  }
  for (let y = 1; y < height - 1; y++) {
    border.push(y * width, y * width + width - 1)
  }

  const visible = border.filter((i) => alpha[i] !== 0)
  if (visible.length === 0) return false

  const dominant = medianLab(labs, visible)

  // Seeds only, not samples: everything after this is judged step by step.
  const queue = new Int32Array(count)
  const visited = new Uint8Array(count)
  let head = 0
  let tail = 0
  for (const i of visible) {
    if (!visited[i] && labDist2(at(i), dominant) <= SEED2) {
      visited[i] = 1
      queue[tail++] = i
    }
  }
  if (tail === 0) return false // nothing on the border looks like a backdrop

  const removed: number[] = []
  while (head < tail) {
    const i = queue[head++]
    removed.push(i)
    const here = at(i)
    const x = i % width
    const y = (i - x) / width

    // 4-connected: diagonals let the fill squeeze through a one-stitch gap in a
    // subject's outline and hollow it out from the inside.
    if (x > 0) consider(i - 1, here)
    if (x < width - 1) consider(i + 1, here)
    if (y > 0) consider(i - width, here)
    if (y < height - 1) consider(i + width, here)
  }

  function consider(j: number, from: Lab) {
    if (visited[j] || alpha[j] === 0) return
    const there = at(j)
    if (labDist2(there, from) > STEP2) return
    if (labDist2(there, dominant) > DRIFT2) return
    visited[j] = 1
    queue[tail++] = j
  }

  const visibleBefore = countVisible(alpha)
  const left = visibleBefore - removed.length
  if (left < visibleBefore * MIN_SUBJECT_SHARE) return false

  for (const i of removed) alpha[i] = 0

  shaveFringe(labs, alpha, width, height, dominant)
  return true
}

/**
 * Drop the one-stitch halo the fill leaves behind.
 *
 * A cell straddling the subject's edge is a *mixture* of backdrop and subject,
 * so it sits between the two and the step tolerance rightly refuses to cross
 * into it — which leaves a thin outline of backdrop colour tracing the
 * silhouette. Whether such a cell belongs to the background is decided locally:
 * is it nearer the backdrop, or nearer the subject behind it? That comparison is
 * safe in a way a wider global tolerance would not be, because a pale part of
 * the subject is judged against its own neighbours rather than against a
 * threshold that happens to include it.
 */
function shaveFringe(
  labs: Float64Array,
  alpha: Uint8Array,
  width: number,
  height: number,
  dominant: Lab,
): void {
  const at = (i: number): Lab => [labs[i * 3], labs[i * 3 + 1], labs[i * 3 + 2]]
  const doomed: number[] = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      if (alpha[i] === 0) continue

      let touchesBackground = false
      let inwardSum = [0, 0, 0]
      let inwardCount = 0
      const visit = (j: number) => {
        if (alpha[j] === 0) {
          touchesBackground = true
        } else {
          const lab = at(j)
          inwardSum = [inwardSum[0] + lab[0], inwardSum[1] + lab[1], inwardSum[2] + lab[2]]
          inwardCount++
        }
      }
      if (x > 0) visit(i - 1)
      if (x < width - 1) visit(i + 1)
      if (y > 0) visit(i - width)
      if (y < height - 1) visit(i + width)

      if (!touchesBackground || inwardCount === 0) continue

      const subject: Lab = [
        inwardSum[0] / inwardCount,
        inwardSum[1] / inwardCount,
        inwardSum[2] / inwardCount,
      ]
      const here = at(i)
      if (labDist2(here, dominant) < labDist2(here, subject)) doomed.push(i)
    }
  }

  // Applied after the scan, so one shaved cell can't cascade into the next and
  // erode the subject a stitch at a time.
  for (const i of doomed) alpha[i] = 0
}

function countVisible(alpha: Uint8Array): number {
  let n = 0
  for (let i = 0; i < alpha.length; i++) if (alpha[i] !== 0) n++
  return n
}

/**
 * Component-wise median of a set of cells.
 *
 * Median, not mean: a subject running off the edge of the frame contributes a
 * minority of border cells, and a mean would let it drag the reference colour
 * towards the subject — which is precisely the failure this replaces.
 */
function medianLab(labs: Float64Array, indices: number[]): Lab {
  const pick = (offset: number) => {
    const values = indices.map((i) => labs[i * 3 + offset]).sort((a, b) => a - b)
    const mid = values.length >> 1
    return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2
  }
  return [pick(0), pick(1), pick(2)]
}

/** Lab for every cell of an RGBA grid, as a flat array the above can chew on. */
export function gridToLab(data: Uint8ClampedArray, count: number): Float64Array {
  const labs = new Float64Array(count * 3)
  for (let i = 0; i < count; i++) {
    const lab = rgbToLab(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])
    labs[i * 3] = lab[0]
    labs[i * 3 + 1] = lab[1]
    labs[i * 3 + 2] = lab[2]
  }
  return labs
}
