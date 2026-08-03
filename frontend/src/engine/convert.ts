import { boostChroma, gridToLab, removeFlatBackground, type Adjustments } from "./adjust"
import { assignThreads, findThread, type Thread } from "./dmc"
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

  // Background first, boost second: the background is judged on the photo's
  // own colours, and a lifted chroma would push a soft sky past the tolerance.
  if (opts.removeBackground) removeFlatBackground(labs, alpha, width, height)
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
  const threads = assignThreads(clusterLabs, opts.palette)

  const counts = new Array<number>(k).fill(0)
  for (let n = 0; n < visibleCount; n++) {
    cells[visibleIndex[n]] = labels[n]
    counts[labels[n]]++
  }

  return sortByShade({ width, height, cells, threads, counts, stitched: visibleCount })
}

/**
 * Decode and area-average the photo down to the stitch grid.
 *
 * createImageBitmap's resize does the filtering in the browser's own image
 * pipeline, off the main thread and without ever materialising the full-size
 * pixel buffer in JS — a 12 Mpx getImageData would be 48 MB before we started.
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

  // OffscreenCanvas, not document.createElement: this whole pipeline runs
  // inside a Web Worker, where there is no document. It works on the main
  // thread too, so there is one code path rather than two.
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) {
    bitmap.close()
    throw new Error("canvas 2d context unavailable")
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  if (opts.flipH || opts.flipV) {
    ctx.translate(opts.flipH ? width : 0, opts.flipV ? height : 0)
    ctx.scale(opts.flipH ? -1 : 1, opts.flipV ? -1 : 1)
  }
  ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, width, height)
  bitmap.close()

  return { width, height, data: ctx.getImageData(0, 0, width, height).data }
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
