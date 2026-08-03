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

/**
 * Flood-fill the background inward from the edges.
 *
 * A connected fill, not a global colour match: a subject that happens to share
 * the background's colour survives as long as it doesn't touch the border. That
 * is the difference between "remove the sky" and "remove every blue stitch",
 * and it is why a flood fill is worth the extra code over a plain threshold.
 *
 * Honest about its limits — this finds a *plain* background. A cat on a busy
 * rug will not come out cleanly, and the UI says so rather than promising
 * magic.
 *
 * @param labs   Lab triples, one per grid cell
 * @param alpha  modified in place: background cells are set to 0
 */
export function removeFlatBackground(
  labs: Float64Array,
  alpha: Uint8Array,
  width: number,
  height: number,
): void {
  const count = width * height
  if (count === 0) return

  const at = (i: number): Lab => [labs[i * 3], labs[i * 3 + 1], labs[i * 3 + 2]]

  // Seed from every already-visible border cell, and keep their colours as the
  // reference set — a gradient sky is several distinct samples, not one.
  const seeds: number[] = []
  const samples: Lab[] = []
  const pushEdge = (i: number) => {
    if (alpha[i] === 0) return
    seeds.push(i)
    samples.push(at(i))
  }
  for (let x = 0; x < width; x++) {
    pushEdge(x)
    pushEdge((height - 1) * width + x)
  }
  for (let y = 1; y < height - 1; y++) {
    pushEdge(y * width)
    pushEdge(y * width + width - 1)
  }
  if (seeds.length === 0) return

  // Tolerance in squared Lab distance. ~18 Lab units: comfortably more than
  // JPEG noise and a soft gradient, comfortably less than the step from a sky
  // to the thing standing in front of it.
  const TOLERANCE2 = 18 * 18

  const nearSample = (lab: Lab): boolean => {
    for (const s of samples) if (labDist2(lab, s) <= TOLERANCE2) return true
    return false
  }

  const visited = new Uint8Array(count)
  const queue = new Int32Array(count)
  let head = 0
  let tail = 0
  for (const s of seeds) {
    if (!visited[s] && nearSample(at(s))) {
      visited[s] = 1
      queue[tail++] = s
    }
  }

  while (head < tail) {
    const i = queue[head++]
    alpha[i] = 0
    const x = i % width
    const y = (i - x) / width
    // 4-connected: diagonals let the fill leak through single-stitch gaps in a
    // subject's outline and eat the middle of it.
    if (x > 0) consider(i - 1)
    if (x < width - 1) consider(i + 1)
    if (y > 0) consider(i - width)
    if (y < height - 1) consider(i + width)
  }

  function consider(j: number) {
    if (visited[j] || alpha[j] === 0) return
    if (!nearSample(at(j))) return
    visited[j] = 1
    queue[tail++] = j
  }
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
