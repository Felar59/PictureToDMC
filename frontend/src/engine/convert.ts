import { rgbToLab } from "./color"
import { assignThreads, type Thread } from "./dmc"
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
}

export type ConvertOptions = {
  /** Pattern width in stitches. Height follows the photo's proportions. */
  stitchWidth: number
  /** Number of DMC threads to use. */
  colorCount: number
  /** Restrict matching to these threads (the user's own thread box). */
  palette?: Thread[]
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
  const { width, height, data } = await sampleToGrid(source, opts.stitchWidth)

  // Split visible from empty before clustering: transparent regions must not
  // drag a centroid towards whatever colour the encoder left underneath them.
  const visibleIndex: number[] = []
  for (let i = 0; i < width * height; i++) {
    if (data[i * 4 + 3] >= ALPHA_FLOOR) visibleIndex.push(i)
  }

  const cells = new Int16Array(width * height).fill(-1)
  if (visibleIndex.length === 0) {
    return { width, height, cells, threads: [], counts: [] }
  }

  const points = new Float64Array(visibleIndex.length * 3)
  visibleIndex.forEach((src, n) => {
    const lab = rgbToLab(data[src * 4], data[src * 4 + 1], data[src * 4 + 2])
    points[n * 3] = lab[0]
    points[n * 3 + 1] = lab[1]
    points[n * 3 + 2] = lab[2]
  })

  const { centroids, labels } = kmeans(points, opts.colorCount)
  const k = centroids.length / 3

  const clusterLabs = Array.from({ length: k }, (_, c) =>
    [centroids[c * 3], centroids[c * 3 + 1], centroids[c * 3 + 2]] as const,
  )
  const threads = assignThreads(clusterLabs, opts.palette)

  const counts = new Array<number>(k).fill(0)
  visibleIndex.forEach((src, n) => {
    cells[src] = labels[n]
    counts[labels[n]]++
  })

  return sortByShade({ width, height, cells, threads, counts })
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
  stitchWidth: number,
): Promise<{ width: number; height: number; data: Uint8ClampedArray }> {
  const probe = await createImageBitmap(source)
  const ratio = probe.height / probe.width
  const width = Math.max(1, Math.round(stitchWidth))
  const height = Math.max(1, Math.round(width * ratio))
  probe.close()

  const bitmap = await createImageBitmap(source, {
    resizeWidth: width,
    resizeHeight: height,
    resizeQuality: "high",
  })

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("canvas 2d context unavailable")
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  return { width, height, data: ctx.getImageData(0, 0, width, height).data }
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
