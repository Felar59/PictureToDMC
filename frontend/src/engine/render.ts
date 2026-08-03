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

/**
 * The preview, at exactly one pixel per stitch.
 *
 * The screen size is then a CSS transform with `image-rendering: pixelated`,
 * which is both crisper and far cheaper than drawing scaled-up rectangles: a
 * single putImageData writes the whole grid, where fillRect-per-cell costs one
 * canvas call per stitch. Nothing is encoded — the previous version produced a
 * PNG and base64'd it on every render, including every hover.
 */
export function patternImageData(pattern: Pattern): ImageData {
  const image = new ImageData(pattern.width, pattern.height)
  const out = image.data

  // Unpack thread colours once rather than per pixel.
  const r = new Uint8Array(pattern.threads.length)
  const g = new Uint8Array(pattern.threads.length)
  const b = new Uint8Array(pattern.threads.length)
  pattern.threads.forEach((thread, i) => {
    r[i] = thread.rgb[0]
    g[i] = thread.rgb[1]
    b[i] = thread.rgb[2]
  })

  for (let i = 0; i < pattern.cells.length; i++) {
    const t = pattern.cells[i]
    if (t < 0) continue // leave it transparent
    out[i * 4] = r[t]
    out[i * 4 + 1] = g[t]
    out[i * 4 + 2] = b[t]
    out[i * 4 + 3] = 255
  }

  return image
}

/**
 * Three sub-pixels per stitch, so the keyline below can be drawn a third of a
 * stitch thick instead of a whole one. Small enough that the overlay stays a
 * fraction of a megabyte even for a large grid.
 */
const ISOLATE_SCALE = 3
/**
 * The veil pulls the other threads back towards bare cloth — but a shade darker
 * than the cloth itself (--color-aida is #EDE3D0). Matching the cloth exactly
 * looked tidier and was worse: DMC Blanc, Ecru and 3866 are all within a few
 * points of aida, so the one colour being pointed at came out the same tone as
 * everything around it. A step down means every pale thread reads as lighter
 * than its surroundings, and dark threads still read as darker.
 */
const VEIL = [0xe4, 0xda, 0xc6] as const
const VEIL_ALPHA = 208
/** --color-ink, for the keyline. */
const KEYLINE = [0x33, 0x26, 0x1a] as const
const KEYLINE_ALPHA = 235

/**
 * Isolate one thread: veil every *other* stitch and trace the run of this one.
 *
 * The obvious version of this — paint the matching stitches white and blend
 * them over the pattern — cannot work, because the answer depends on the very
 * colour it is trying to point at. Lighten a white thread with white and
 * nothing happens; DMC B5200 and Blanc simply vanished, which is exactly the
 * threads a stitcher most needs to locate, since they are also the hardest to
 * pick out of the grid unaided.
 *
 * So this inverts the question. The hovered thread is left completely untouched
 * and everything around it recedes — legible for white, for black, and for
 * every shade between, because the highlighted colour is never composited with
 * anything. Bare fabric is left alone too: it is already not the thread, and
 * veiling it would erase the silhouette that gives the shape its context.
 *
 * The keyline is what makes a scattered thread findable. A dozen single
 * stitches of pale grey read as noise however the rest is dimmed; outlined,
 * they read as a dozen marks.
 *
 * It is drawn on the cells *around* the thread rather than inside it, and that
 * detail matters more than it sounds. Inked inwards, a lone stitch — all four
 * edges facing something else, which is precisely the case the keyline exists
 * for — loses eight of its nine sub-pixels to the outline and reads as a dark
 * dot rather than as its own colour. Drawn outwards the matching cells are never
 * touched at all, so the outline hugs the outside of the silhouette and the
 * thread keeps every pixel of itself whatever shape it takes. Bare cloth next to
 * the thread is outlined too but never veiled: an outline against bare fabric is
 * where a pale thread needs the help most.
 */
export function isolateImageData(pattern: Pattern, threadIndex: number): ImageData {
  const scale = ISOLATE_SCALE
  const { width, height, cells } = pattern
  const image = new ImageData(width * scale, height * scale)
  const out = image.data
  const stride = width * scale * 4

  const mine = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < width && y < height && cells[y * width + x] === threadIndex

  const paint = (px: number, py: number, rgb: readonly number[], alpha: number) => {
    const o = py * stride + px * 4
    out[o] = rgb[0]
    out[o + 1] = rgb[1]
    out[o + 2] = rgb[2]
    out[o + 3] = alpha
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = cells[y * width + x]
      if (cell === threadIndex) continue // left entirely alone

      // Which sides of this cell face the hovered thread — those get the ink.
      const above = mine(x, y - 1)
      const below = mine(x, y + 1)
      const before = mine(x - 1, y)
      const after = mine(x + 1, y)

      const stitched = cell >= 0
      if (!stitched && !(above || below || before || after)) continue // plain cloth

      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const edge =
            (above && dy === 0) ||
            (below && dy === scale - 1) ||
            (before && dx === 0) ||
            (after && dx === scale - 1)
          if (edge) paint(x * scale + dx, y * scale + dy, KEYLINE, KEYLINE_ALPHA)
          else if (stitched) paint(x * scale + dx, y * scale + dy, VEIL, VEIL_ALPHA)
        }
      }
    }
  }

  return image
}

export type ChartOptions = {
  /** Rendered size of one stitch, in pixels. */
  cellSize?: number
  grid?: boolean
  legend?: boolean
  /** Keyline around the stitched area. */
  outline?: boolean
  /** Its colour. A dark line is right on pale fabric and disappears on a dark
   *  background, which is a choice the person printing the chart has to make. */
  outlineColor?: string
  background?: string
  /** Heavier rule every N stitches, the usual counting aid. */
  heavyEvery?: number
}

/**
 * Browsers refuse a canvas beyond roughly 16,384px on a side, and asking for one
 * yields a null 2d context rather than an error worth reading.
 */
const MAX_CANVAS_SIDE = 16000

/** The printable chart: stitches, counting grid, and the thread legend. */
export function renderChart(pattern: Pattern, opts: ChartOptions = {}): HTMLCanvasElement {
  const grid = opts.grid ?? true
  const legend = opts.legend ?? true
  const outline = opts.outline ?? false
  const outlineColor = opts.outlineColor ?? "#141008"
  const heavyEvery = opts.heavyEvery ?? 10
  const background = opts.background ?? "#EBE2D7"

  const layout = (cell: number) => {
    const artW = pattern.width * cell
    const artH = pattern.height * cell
    const margin = Math.round(cell * 1.5)
    const legendCols = Math.max(1, Math.min(4, Math.floor(artW / 190)))
    const legendRowH = Math.max(26, Math.round(cell * 1.6))
    const legendRows = legend ? Math.ceil(pattern.threads.length / legendCols) : 0
    const legendH = legend ? legendRows * legendRowH + margin * 2 : 0
    return {
      cell,
      artW,
      artH,
      margin,
      legendCols,
      legendRowH,
      legendH,
      canvasW: artW + margin * 2,
      canvasH: artH + margin * 2 + legendH,
    }
  }

  // A tall photo at the 200-stitch maximum can reach 200x2000 stitches, which at
  // 14px a stitch asks for a chart 28,000px tall — refused. Shrinking the stitch
  // to fit beats the alternative: the smaller preview drew happily while the
  // download failed every time, and told the user it was out of memory.
  let box = layout(opts.cellSize ?? 14)
  if (box.canvasW > MAX_CANVAS_SIDE || box.canvasH > MAX_CANVAS_SIDE) {
    const factor = Math.min(MAX_CANVAS_SIDE / box.canvasW, MAX_CANVAS_SIDE / box.canvasH)
    box = layout(Math.max(1, Math.floor(box.cell * factor)))
  }
  const { cell, artW, artH, margin, legendCols, legendRowH } = box

  const [canvas, ctx] = surface(box.canvasW, box.canvasH)

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

  // Before the grid, so the counting rules stay legible on top of it.
  if (outline) {
    const stitched = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < pattern.width && y < pattern.height &&
      pattern.cells[y * pattern.width + x] >= 0
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = Math.max(2, Math.round(cell / 5))
    ctx.beginPath()
    for (let y = 0; y < pattern.height; y++) {
      for (let x = 0; x < pattern.width; x++) {
        if (!stitched(x, y)) continue
        const px = margin + x * cell
        const py = margin + y * cell
        // Only the edges that face bare fabric — an interior cell
        // contributes nothing, so the result is the silhouette.
        if (!stitched(x, y - 1)) { ctx.moveTo(px, py); ctx.lineTo(px + cell, py) }
        if (!stitched(x, y + 1)) { ctx.moveTo(px, py + cell); ctx.lineTo(px + cell, py + cell) }
        if (!stitched(x - 1, y)) { ctx.moveTo(px, py); ctx.lineTo(px, py + cell) }
        if (!stitched(x + 1, y)) { ctx.moveTo(px + cell, py); ctx.lineTo(px + cell, py + cell) }
      }
    }
    ctx.stroke()
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
