import { boostChroma, gridToLab, removeFlatBackground, type Adjustments } from "./adjust"
import { SRGB_TO_LINEAR, linearToSrgb } from "./color"
import { applyCutout, cutoutMask, cutoutSupported } from "./cutout"
import { assignThreads, findThread, refineThreads, type Thread } from "./dmc"
import { kmeans } from "./quantize"

/** A finished pattern: a grid of thread indices plus the threads themselves. */
export type Pattern = {
  width: number
  height: number
  /** width * height entries; -1 means "leave this stitch empty". */
  cells: Int16Array
  /** Distinct threads, ordered light-to-dark by hue then value. */
  threads: Thread[]
  /** Stitch count per entry of `threads`, same order. */
  counts: number[]
  /** Cells that will actually be stitched; the rest stays bare fabric. */
  stitched: number
}

export type ConvertOptions = Adjustments & {
  /** Pattern width in stitches. Height follows the photo's proportions. */
  stitchWidth: number
  /** Number of DMC threads to use. */
  colorCount: number
  /** Restrict matching to these threads (the user's own thread box). */
  palette?: Thread[]
  /** Mirror horizontally / vertically. Free: a canvas transform on the
   *  downscale we were already doing, not a second pass over the pixels. */
  flipH?: boolean
  flipV?: boolean
}

/** Below this alpha a pixel is considered background and left unstitched. */
const ALPHA_FLOOR = 150

/**
 * Photo -> pattern, entirely in the browser.
 *
 * Order matters and is the opposite of what the old backend did: the image is
 * reduced to the stitch grid *first*, then quantised. One stitch is the average
 * colour of its region of the photo, so averaging during the downscale is both
 * the correct model and the reason this runs in milliseconds — the quantiser
 * sees a few thousand cells instead of a few million pixels.
 */
export async function convert(source: Blob, opts: ConvertOptions): Promise<Pattern> {
  const { width, height, data } = await sampleToGrid(source, opts)

  // Split visible from empty before clustering: transparent regions must not
  // drag a centroid towards whatever colour the encoder left under them.
  // Typed arrays, sized once — a growing number[] boxes every index, and a
  // 200-stitch pattern has 30 000 of them.
  const cellCount = width * height
  const cells = new Int16Array(cellCount).fill(-1)

  // Everything from here works on the grid, in Lab.
  const labs = gridToLab(data, cellCount)
  const alpha = new Uint8Array(cellCount)
  for (let i = 0; i < cellCount; i++) {
    alpha[i] = data[i * 4 + 3] >= ALPHA_FLOOR ? 255 : 0
  }

  // Background first, boost second: the background is judged on the photo's own
  // colours, and a lifted chroma would push a soft sky past the tolerance.
  //
  // The network does the cutting when it can. The flood fill stays as the fallback
  // for a browser without WebAssembly, or a first use with no connection — a plain
  // background still comes out, which is better than the checkbox doing nothing.
  if (opts.removeBackground) {
    let cut = false
    if (cutoutSupported()) {
      try {
        const mask = await cutoutMask(source)
        applyCutout(alpha, width, height, mask, {
          flipH: opts.flipH,
          flipV: opts.flipV,
        })
        cut = true
      } catch (error) {
        // Loud, because a silent fall back to the flood fill is indistinguishable
        // from the model working badly — which is exactly how three photographs
        // looked when the weights were failing to load.
        console.warn("cutout unavailable, falling back to the flood fill", error)
        cut = false
      }
    }
    if (!cut) removeFlatBackground(labs, alpha, width, height)
  }
  boostChroma(labs, opts.vividness ?? 0)

  const visibleIndex = new Int32Array(cellCount)
  let visibleCount = 0
  for (let i = 0; i < cellCount; i++) {
    if (alpha[i] !== 0) visibleIndex[visibleCount++] = i
  }

  if (visibleCount === 0) {
    return { width, height, cells, threads: [], counts: [], stitched: 0 }
  }

  const points = new Float64Array(visibleCount * 3)
  for (let n = 0; n < visibleCount; n++) {
    const src = visibleIndex[n] * 3
    points[n * 3] = labs[src]
    points[n * 3 + 1] = labs[src + 1]
    points[n * 3 + 2] = labs[src + 2]
  }

  const { centroids, labels } = kmeans(points, opts.colorCount)
  const k = centroids.length / 3

  const clusterLabs = Array.from({ length: k }, (_, c) =>
    [centroids[c * 3], centroids[c * 3 + 1], centroids[c * 3 + 2]] as const,
  )
  // Snap each centroid to a thread, then improve the choice knowing what each
  // thread has to cover — the centroid is a point in a space that contains no
  // threads, so nearest-to-centroid is not the same question as best-for-cluster.
  const threads = refineThreads(points, assignThreads(clusterLabs, opts.palette), opts.palette)

  // Every stitch now takes the nearest *chosen thread*, not the cluster it landed
  // in. Those differ along cluster boundaries once the centroids have been
  // replaced by real threads, and the thread is what will actually be stitched.
  //
  // labDist2, not CIEDE2000: this runs per stitch, and the choice is between a
  // handful of threads already far apart, where the two metrics agree. CIEDE2000
  // here would cost 200 ms a conversion to change almost nothing.
  const threadLab = new Float64Array(k * 3)
  for (let c = 0; c < k; c++) {
    threadLab[c * 3] = threads[c].lab[0]
    threadLab[c * 3 + 1] = threads[c].lab[1]
    threadLab[c * 3 + 2] = threads[c].lab[2]
  }

  const counts = new Array<number>(k).fill(0)
  for (let n = 0; n < visibleCount; n++) {
    const l = points[n * 3]
    const a = points[n * 3 + 1]
    const b = points[n * 3 + 2]
    let best = labels[n]
    let bestD = Infinity
    for (let c = 0; c < k; c++) {
      const dl = l - threadLab[c * 3]
      const da = a - threadLab[c * 3 + 1]
      const db = b - threadLab[c * 3 + 2]
      const d = dl * dl + da * da + db * db
      if (d < bestD) {
        bestD = d
        best = c
      }
    }
    cells[visibleIndex[n]] = best
    counts[best]++
  }

  return sortByShade(
    dropUnused({ width, height, cells, threads, counts, stitched: visibleCount }),
  )
}

/** Most samples per stitch, per side — so at 12 a cell is the mean of 144.
 *  Past a dozen the remaining gamma error is already in the noise (measured:
 *  worst cell 18 dE2000 -> 1.1) and the cost grows with the square. */
const MAX_SUPERSAMPLE = 12
/** ...and the intermediate never holds more than this many pixels, which is
 *  what actually bounds memory: getImageData hands back 4 bytes each. */
const MAX_SAMPLE_PIXELS = 4_000_000

/**
 * Decode and area-average the photo down to the stitch grid.
 *
 * Two stages, and the split is the point. canvas carries the photograph down to
 * an exact whole multiple of the stitch grid, which it does natively and fast;
 * then the last step — the one that does nearly all of the averaging, and the
 * only one whose inputs differ enough for it to matter — is done here, in linear
 * light.
 *
 * Both halves of that matter:
 *
 *   * **In light.** An sRGB byte is a perceptual code, not a quantity of light,
 *     so the mean of two codes is not the code of the mean. Averaging codes
 *     anyway darkens and desaturates every cell that spans an edge, and on a
 *     50-stitch grid that is most of them. Measured against a correct area
 *     average, letting canvas do the whole reduction costs a mean of 0.5-2.3
 *     dE2000 and as much as 18 on a single cell; this leaves 0.1-0.5 and 1.6.
 *   * **A whole multiple.** With the intermediate at an exact multiple, each
 *     stitch owns exactly step x step of its pixels, so the two stages nest and
 *     the second is a plain box sum. Off by a fraction and cells straddle
 *     sample boundaries, which reintroduces a resampling error of its own — an
 *     earlier attempt at this measured *worse* at 300px than at 200 for exactly
 *     that reason.
 */
async function sampleToGrid(
  source: Blob,
  opts: ConvertOptions,
): Promise<{ width: number; height: number; data: Uint8ClampedArray }> {
  // Decode ONCE. The obvious version asks createImageBitmap for the natural
  // size to work out the aspect ratio, then asks again with resize options —
  // which decodes a 12 Mpx JPEG twice and made the decode, not the clustering,
  // the most expensive step in the pipeline. One decode, then let drawImage
  // scale it.
  const bitmap = await createImageBitmap(source)
  const width = Math.max(1, Math.round(opts.stitchWidth))
  const height = Math.max(1, Math.round((width * bitmap.height) / bitmap.width))
  const step = supersampleStep(width, height, bitmap.width)

  // OffscreenCanvas, not document.createElement: this whole pipeline runs
  // inside a Web Worker, where there is no document. It works on the main
  // thread too, so there is one code path rather than two.
  const canvas = new OffscreenCanvas(width * step, height * step)
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) {
    bitmap.close()
    throw new Error("canvas 2d context unavailable")
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  if (opts.flipH || opts.flipV) {
    ctx.translate(opts.flipH ? width * step : 0, opts.flipV ? height * step : 0)
    ctx.scale(opts.flipH ? -1 : 1, opts.flipV ? -1 : 1)
  }
  ctx.drawImage(
    bitmap,
    0,
    0,
    bitmap.width,
    bitmap.height,
    0,
    0,
    width * step,
    height * step,
  )
  bitmap.close()

  const sampled = ctx.getImageData(0, 0, width * step, height * step).data
  if (step === 1) return { width, height, data: sampled }
  return { width, height, data: averageInLight(sampled, width, height, step) }
}

/** How many samples per stitch we can both use and afford. */
function supersampleStep(width: number, height: number, sourceWidth: number): number {
  // No finer than the photograph itself: past its own resolution the extra
  // samples are interpolation, not information, and averaging a browser's
  // upscale back down just returns what it started from at more cost.
  const useful = Math.floor(sourceWidth / width)
  const affordable = Math.floor(Math.sqrt(MAX_SAMPLE_PIXELS / (width * height)))
  return Math.max(1, Math.min(MAX_SUPERSAMPLE, useful, affordable))
}

/**
 * Collapse each step x step block of samples into one stitch, summing in light.
 *
 * Colour is weighted by opacity. A cell on the edge of a cut-out subject is part
 * background, and background has no colour to contribute — weighting by alpha is
 * what stops whatever the encoder happened to leave in the transparent pixels
 * from tinting the subject's outline.
 */
function averageInLight(
  samples: Uint8ClampedArray,
  width: number,
  height: number,
  step: number,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(width * height * 4)
  const rowStride = width * step * 4
  const perCell = step * step

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0
      let g = 0
      let b = 0
      let alpha = 0
      for (let dy = 0; dy < step; dy++) {
        let p = (y * step + dy) * rowStride + x * step * 4
        for (let dx = 0; dx < step; dx++) {
          const a = samples[p + 3]
          r += SRGB_TO_LINEAR[samples[p]] * a
          g += SRGB_TO_LINEAR[samples[p + 1]] * a
          b += SRGB_TO_LINEAR[samples[p + 2]] * a
          alpha += a
          p += 4
        }
      }
      const o = (y * width + x) * 4
      if (alpha === 0) continue // Uint8ClampedArray starts zeroed: fully transparent
      out[o] = linearToSrgb(r / alpha)
      out[o + 1] = linearToSrgb(g / alpha)
      out[o + 2] = linearToSrgb(b / alpha)
      out[o + 3] = alpha / perCell
    }
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Crossing the worker boundary                                        */
/* ------------------------------------------------------------------ */

/**
 * What actually travels back from the worker.
 *
 * Not the Pattern itself: its `threads` carry precomputed Lab triples, and
 * structured-cloning 20 of those per conversion copies data the main thread
 * already has in THREADS. Sending the references and rehydrating is smaller,
 * and it keeps thread objects identity-equal to the chart entries so React can
 * compare them cheaply.
 */
export type PatternWire = {
  width: number
  height: number
  cells: Int16Array
  threadNums: string[]
  counts: number[]
  stitched: number
}

export function toWire(pattern: Pattern): PatternWire {
  return {
    width: pattern.width,
    height: pattern.height,
    cells: pattern.cells,
    threadNums: pattern.threads.map((t) => t.num),
    counts: pattern.counts,
    stitched: pattern.stitched,
  }
}

export function fromWire(wire: PatternWire): Pattern {
  return {
    width: wire.width,
    height: wire.height,
    cells: wire.cells,
    // A code always resolves — it came out of THREADS in the first place.
    threads: wire.threadNums.map((num) => findThread(num)).filter((t): t is Thread => Boolean(t)),
    counts: wire.counts,
    stitched: wire.stitched,
  }
}

/**
 * Drop threads no stitch ended up using.
 *
 * Reassigning each stitch to its nearest chosen thread can leave a thread with
 * nothing on it — a cluster whose members all turn out to sit closer to a
 * neighbour's thread. Left in, it is a row of the legend and a line of the
 * shopping list asking someone to buy a skein for zero stitches.
 */
function dropUnused(p: Pattern): Pattern {
  const keep: number[] = []
  for (let c = 0; c < p.threads.length; c++) if (p.counts[c] > 0) keep.push(c)
  if (keep.length === p.threads.length) return p

  const remap = new Int16Array(p.threads.length).fill(-1)
  keep.forEach((old, next) => {
    remap[old] = next
  })

  const cells = new Int16Array(p.cells.length)
  for (let i = 0; i < p.cells.length; i++) {
    cells[i] = p.cells[i] < 0 ? -1 : remap[p.cells[i]]
  }

  return {
    ...p,
    cells,
    threads: keep.map((c) => p.threads[c]),
    counts: keep.map((c) => p.counts[c]),
  }
}

/**
 * Order the legend the way a stitcher reads it: by hue, then saturation, then
 * lightness. Same intent as the old backend's HSV sort, kept because grouping
 * neighbouring shades together is genuinely how you pick threads off a card.
 */
function sortByShade(p: Pattern): Pattern {
  const order = p.threads
    .map((t, i) => ({ i, key: hsvKey(t.rgb) }))
    .sort((a, b) => a.key[0] - b.key[0] || a.key[1] - b.key[1] || a.key[2] - b.key[2])
    .map((x) => x.i)

  const remap = new Int16Array(p.threads.length)
  order.forEach((old, next) => {
    remap[old] = next
  })

  const cells = new Int16Array(p.cells.length)
  for (let i = 0; i < p.cells.length; i++) {
    cells[i] = p.cells[i] < 0 ? -1 : remap[p.cells[i]]
  }

  return {
    ...p,
    cells,
    threads: order.map((i) => p.threads[i]),
    counts: order.map((i) => p.counts[i]),
  }
}

function hsvKey(rgb: readonly [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb.map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
    if (h < 0) h += 1
  }
  return [h, max === 0 ? 0 : d / max, max]
}
