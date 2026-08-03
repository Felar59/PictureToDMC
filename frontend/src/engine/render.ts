import type { Pattern } from "./convert"

/**
 * Everything that turns a Pattern into pixels. All of it runs on a canvas in
 * the browser, so the preview, the hover highlight and the downloadable chart
 * are the same code path — the old build sent three separate requests and had
 * the server render each one differently.
 */

function surface(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas 2d context unavailable")
  ctx.imageSmoothingEnabled = false
  return [canvas, ctx]
}

/** The preview: one square per stitch, nothing else. */
export function renderPattern(
  pattern: Pattern,
  opts: { cellSize?: number; background?: string | null } = {},
): HTMLCanvasElement {
  const cell = opts.cellSize ?? 8
  const [canvas, ctx] = surface(pattern.width * cell, pattern.height * cell)

  if (opts.background) {
    ctx.fillStyle = opts.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  for (let y = 0; y < pattern.height; y++) {
    for (let x = 0; x < pattern.width; x++) {
      const t = pattern.cells[y * pattern.width + x]
      if (t < 0) continue
      ctx.fillStyle = pattern.threads[t].hex
      ctx.fillRect(x * cell, y * cell, cell, cell)
    }
  }

  return canvas
}

/**
 * White where a given thread is stitched, transparent everywhere else.
 *
 * The old version had the server build one full-resolution PNG per thread and
 * base64 them all into a single JSON response — megabytes, downloaded whether
 * or not anyone hovered. Here it is a loop over the grid, on demand.
 */
export function renderHighlight(
  pattern: Pattern,
  threadIndex: number,
  cellSize = 8,
): HTMLCanvasElement {
  const [canvas, ctx] = surface(pattern.width * cellSize, pattern.height * cellSize)
  ctx.fillStyle = "#FFFFFF"
  for (let y = 0; y < pattern.height; y++) {
    for (let x = 0; x < pattern.width; x++) {
      if (pattern.cells[y * pattern.width + x] !== threadIndex) continue
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
  }
  return canvas
}

export type ChartOptions = {
  /** Rendered size of one stitch, in pixels. */
  cellSize?: number
  grid?: boolean
  legend?: boolean
  background?: string
  /** Heavier rule every N stitches, the usual counting aid. */
  heavyEvery?: number
}

/** The printable chart: stitches, counting grid, and the thread legend. */
export function renderChart(pattern: Pattern, opts: ChartOptions = {}): HTMLCanvasElement {
  const cell = opts.cellSize ?? 14
  const grid = opts.grid ?? true
  const legend = opts.legend ?? true
  const heavyEvery = opts.heavyEvery ?? 10
  const background = opts.background ?? "#EBE2D7"

  const artW = pattern.width * cell
  const artH = pattern.height * cell
  const margin = Math.round(cell * 1.5)

  const legendCols = Math.max(1, Math.min(4, Math.floor(artW / 190)))
  const legendRowH = Math.max(26, Math.round(cell * 1.6))
  const legendRows = legend ? Math.ceil(pattern.threads.length / legendCols) : 0
  const legendH = legend ? legendRows * legendRowH + margin * 2 : 0

  const [canvas, ctx] = surface(artW + margin * 2, artH + margin * 2 + legendH)

  ctx.fillStyle = background
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // stitches
  for (let y = 0; y < pattern.height; y++) {
    for (let x = 0; x < pattern.width; x++) {
      const t = pattern.cells[y * pattern.width + x]
      if (t < 0) continue
      ctx.fillStyle = pattern.threads[t].hex
      ctx.fillRect(margin + x * cell, margin + y * cell, cell, cell)
    }
  }

  if (grid) {
    ctx.lineWidth = 1
    ctx.strokeStyle = "rgba(30,25,20,.35)"
    ctx.beginPath()
    for (let x = 0; x <= pattern.width; x++) {
      const px = margin + x * cell + 0.5
      ctx.moveTo(px, margin)
      ctx.lineTo(px, margin + artH)
    }
    for (let y = 0; y <= pattern.height; y++) {
      const py = margin + y * cell + 0.5
      ctx.moveTo(margin, py)
      ctx.lineTo(margin + artW, py)
    }
    ctx.stroke()

    // Heavy decade rules, drawn after so they sit on top of the fine ones.
    ctx.lineWidth = 2
    ctx.strokeStyle = "rgba(20,16,12,.85)"
    ctx.beginPath()
    for (let x = 0; x <= pattern.width; x += heavyEvery) {
      const px = margin + x * cell
      ctx.moveTo(px, margin)
      ctx.lineTo(px, margin + artH)
    }
    for (let y = 0; y <= pattern.height; y += heavyEvery) {
      const py = margin + y * cell
      ctx.moveTo(margin, py)
      ctx.lineTo(margin + artW, py)
    }
    ctx.stroke()
  }

  if (legend && pattern.threads.length) {
    const top = margin * 2 + artH
    ctx.strokeStyle = "rgba(20,16,12,.45)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(margin, top - margin / 2)
    ctx.lineTo(canvas.width - margin, top - margin / 2)
    ctx.stroke()

    const colW = artW / legendCols
    const swatch = Math.round(legendRowH * 0.62)
    ctx.textBaseline = "middle"
    ctx.font = `600 ${Math.round(legendRowH * 0.44)}px "Nunito Sans", system-ui, sans-serif`

    pattern.threads.forEach((thread, i) => {
      const col = i % legendCols
      const row = Math.floor(i / legendCols)
      const x = margin + col * colW
      const y = top + row * legendRowH + legendRowH / 2

      ctx.fillStyle = thread.hex
      ctx.fillRect(x, y - swatch / 2, swatch, swatch)
      ctx.strokeStyle = "rgba(20,16,12,.55)"
      ctx.lineWidth = 1
      ctx.strokeRect(x + 0.5, y - swatch / 2 + 0.5, swatch - 1, swatch - 1)

      ctx.fillStyle = "#33261A"
      const label = `DMC ${thread.num}`
      ctx.fillText(label, x + swatch + 8, y)
      ctx.fillStyle = "rgba(51,38,26,.6)"
      ctx.fillText(
        `${pattern.counts[i]} pts`,
        x + swatch + 8 + ctx.measureText(label).width + 10,
        y,
      )
    })
  }

  return canvas
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/png")
  })
}
