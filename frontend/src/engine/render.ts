import { labDist2 } from "./color"
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
  /** Backstitch: a line along every seam between two colours the eye can tell
   *  apart, in `outlineColor`. See BACKSTITCH_APART. */
  backstitch?: boolean
  /** Keyline around the stitched area. */
  outline?: boolean
  /** Its colour. A dark line is right on pale fabric and disappears on a dark
   *  background, which is a choice the person printing the chart has to make. */
  outlineColor?: string
  background?: string
  /** Heavier rule every N stitches, the usual counting aid. */
  heavyEvery?: number
  /** The line above the legend. Passed in rather than built here, because this
   *  module has no locale and a French user should not download an English
   *  chart. */
  legendTitle?: string
  /** What a stitch count is called — "pts", "st". Same reason. */
  countSuffix?: string
  /** How to write a thread's name. Same reason again: the chart carries 483 of
   *  them and they come out of the DMC spreadsheet in English. Defaults to the
   *  stored name, so a caller that does not care gets what it always got. */
  threadName?: (name: string) => string
  /**
   * Draw one thread only: the sheet you work from with a single skein in hand.
   *
   * Index into `pattern.threads`. The stitches of every other thread are left
   * blank, but the keyline still traces the *whole* piece rather than this
   * thread's own scattered patches — that silhouette is the only thing telling you
   * where on the cloth these stitches go, and without it a pale thread covering a
   * tenth of the grid prints as a few marks in an empty field. So `outline`
   * defaults to on here, unlike on the full chart.
   *
   * The legend narrows to the one thread, since the rest are not on the page.
   */
  onlyThread?: number
}

/**
 * Browsers refuse a canvas beyond roughly 16,384px on a side, and asking for one
 * yields a null 2d context rather than an error worth reading.
 */
const MAX_CANVAS_SIDE = 16000

/**
 * How different two neighbouring threads must be for the seam between them to be
 * worth a backstitch line, as a squared Lab distance.
 *
 * The same 26 the gallery card uses to decide whether two swatches are worth
 * showing separately, and for the same reason: below it the two sides read as one
 * colour, so a line there is a line drawn through the middle of a single shape.
 * Above it there is a real edge — 310 Black to 3799 Pewter is 24.3 and stays
 * unruled, green to blue is 70.9 and gets its line.
 *
 * What this buys is the thing that makes a converted photo look like a drawing
 * rather than a mosaic: the boundary that matters (cat against sky, petal against
 * leaf) is outlined, while the four steps of shading inside the cat are not. What
 * it costs is that a subject shading gently into its background gets no contour
 * there, which is correct — there is no edge to stitch.
 */
const BACKSTITCH_APART = 26 * 26

/** The printable chart: stitches, counting grid, and the thread legend. */
export function renderChart(pattern: Pattern, opts: ChartOptions = {}): HTMLCanvasElement {
  const grid = opts.grid ?? true
  const legend = opts.legend ?? true
  // -1 rather than undefined from here on, so the hot loop compares two numbers.
  const only =
    opts.onlyThread !== undefined && opts.onlyThread >= 0 && opts.onlyThread < pattern.threads.length
      ? opts.onlyThread
      : -1
  // On a one-thread sheet the keyline is what makes it readable, so it is on
  // unless the caller says otherwise.
  const outline = opts.outline ?? only >= 0
  const backstitch = opts.backstitch ?? false
  const outlineColor = opts.outlineColor ?? "#141008"
  const heavyEvery = opts.heavyEvery ?? 10
  const background = opts.background ?? "#EBE2D7"

  /** The legend's rows: every thread, or just the one being drawn. */
  const shown = only >= 0 ? [only] : pattern.threads.map((_, i) => i)

  const layout = (cell: number) => {
    const artW = pattern.width * cell
    const artH = pattern.height * cell
    const margin = Math.round(cell * 1.5)
    // The legend is sized against the page, not against a stitch.
    //
    // It used to be `max(30, cell * 1.8)`, which sounds reasonable and is not: the
    // body type is 40% of the row, so a 14px cell produced 12px text on a chart
    // 1300px wide. Printed, that is unreadable; on screen you zoom. The row is now
    // a fraction of the art's width, which is the thing the reader's eye is scaled
    // to, and the floor and ceiling keep a postage-stamp chart and a 200-stitch
    // monster both sane.
    const legendRowH = Math.min(72, Math.max(34, Math.round(artW / 26)))
    // A column has to hold a swatch, a reference, a name and a count, so how many
    // fit depends on how big that type now is rather than on a fixed 290px.
    const legendCols = Math.max(1, Math.min(3, Math.floor(artW / (legendRowH * 7.5))))
    const legendRows = legend ? Math.ceil(shown.length / legendCols) : 0
    // The band between the picture and the first legend row, holding the title line
    // and the rule under it.
    //
    // Taken from the row height, not from the margin. The margin is a function of
    // the stitch and the title is a function of the type, and the two came apart
    // once the legend was resized: at a 20px stitch the title's baseline landed
    // 13px below the bottom of the picture, close enough to read as though it were
    // sitting on it.
    const legendLead = legend ? Math.round(legendRowH * 1.5) : 0
    const legendH = legend ? legendRows * legendRowH + legendLead + margin : 0
    return {
      cell,
      artW,
      artH,
      margin,
      legendCols,
      legendRowH,
      legendLead,
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
  const { cell, artW, artH, margin, legendCols, legendRowH, legendLead } = box

  const [canvas, ctx] = surface(box.canvasW, box.canvasH)

  ctx.fillStyle = background
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // stitches
  for (let y = 0; y < pattern.height; y++) {
    for (let x = 0; x < pattern.width; x++) {
      const t = pattern.cells[y * pattern.width + x]
      if (t < 0) continue
      if (only >= 0 && t !== only) continue
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

  /**
   * Backstitch — the line you sew over the finished cross stitches to give a
   * shape its edge back.
   *
   * It is not a keyline around the whole piece, which is what `outline` above
   * draws. It runs along the seams *inside* the motif, between colours that are
   * actually different, plus the silhouette where the stitching meets bare cloth.
   * On a real chart this is a separate pass in one dark thread, held in the hand
   * after the cross stitching is done, and it is most of what stops a converted
   * photograph reading as a grid of coloured squares.
   *
   * Drawn before the grid, like the outline, so the counting rules stay readable
   * on top of it.
   */
  if (backstitch) {
    // Off the grid counts as bare cloth, which is what closes the contour along
    // the four edges of a motif that runs to the border.
    const at = (x: number, y: number) =>
      x < 0 || y < 0 || x >= pattern.width || y >= pattern.height
        ? -1
        : pattern.cells[y * pattern.width + x]

    const seam = (a: number, b: number) => {
      if (a === b) return false
      // Bare cloth is different from every thread: that seam is the silhouette.
      if (a < 0 || b < 0) return true
      return labDist2(pattern.threads[a].lab, pattern.threads[b].lab) > BACKSTITCH_APART
    }

    ctx.strokeStyle = outlineColor
    // Thinner than the outline's keyline (cell/5): this is a thread laid along a
    // seam, not a border drawn around the work, and it has to read as the lighter
    // of the two when both are on.
    ctx.lineWidth = Math.max(1.5, cell / 7)
    // Butt caps leave a notch at every corner where two segments meet at a right
    // angle, and a contour is nothing but corners.
    ctx.lineCap = "round"
    ctx.beginPath()
    // Each seam is visited once, from the cell to its right or below — the other
    // half of the pair is the neighbour already behind us. Walking all four sides
    // of every cell would test every interior seam twice for the same lines.
    for (let y = 0; y < pattern.height; y++) {
      for (let x = 0; x <= pattern.width; x++) {
        if (!seam(at(x - 1, y), at(x, y))) continue
        const px = margin + x * cell
        const py = margin + y * cell
        ctx.moveTo(px, py)
        ctx.lineTo(px, py + cell)
      }
    }
    for (let x = 0; x < pattern.width; x++) {
      for (let y = 0; y <= pattern.height; y++) {
        if (!seam(at(x, y - 1), at(x, y))) continue
        const px = margin + x * cell
        const py = margin + y * cell
        ctx.moveTo(px, py)
        ctx.lineTo(px + cell, py)
      }
    }
    ctx.stroke()
    ctx.lineCap = "butt"
  }

  if (grid) {
    // Both rules scale with the stitch. Fixed at 1px and 2px, a chart drawn at a
    // 20px cell had a counting grid proportionally half as strong as the same chart
    // at 10px — so the bigger and more readable the chart got, the fainter the
    // thing you actually count on became.
    const hair = Math.max(1, Math.round(cell / 16))
    const rule = Math.max(2, Math.round(cell / 6))

    ctx.lineWidth = hair
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
    //
    // The four edges always get one, whether or not they land on a decade. A
    // 52-wide pattern was ruled at 0, 10 ... 50 and then finished on a hairline,
    // so the chart was framed on the left and top and simply stopped on the right
    // and bottom. A grid you count on has to be closed.
    ctx.lineWidth = rule
    ctx.strokeStyle = "rgba(20,16,12,.85)"
    ctx.beginPath()
    const verticals = new Set<number>([0, pattern.width])
    for (let x = 0; x <= pattern.width; x += heavyEvery) verticals.add(x)
    const horizontals = new Set<number>([0, pattern.height])
    for (let y = 0; y <= pattern.height; y += heavyEvery) horizontals.add(y)
    for (const x of verticals) {
      const px = margin + x * cell
      ctx.moveTo(px, margin)
      ctx.lineTo(px, margin + artH)
    }
    for (const y of horizontals) {
      const py = margin + y * cell
      ctx.moveTo(margin, py)
      ctx.lineTo(margin + artW, py)
    }
    ctx.stroke()
  }

  if (legend && shown.length) {
    /* The shopping list, and the one part of the chart that is read rather than
       counted — so it is set like a list and not like a grid. Each row is a
       swatch, the reference, the thread's name, and how many stitches of it you
       need, with the counts right-aligned in their column so the eye can run down
       them. The names are clipped to the space left rather than allowed to collide
       with the count, which is what happened when every field was laid out from
       the left. */
    // Where the first row of the legend begins, a clear band below the picture.
    const top = margin + artH + legendLead
    const bodySize = Math.max(11, Math.round(legendRowH * 0.4))
    // Was 0.34 of the row, which on a 1200px chart came to 15px — the line that
    // says what the whole page is, set smaller than the thread names under it.
    const headSize = Math.max(13, Math.round(legendRowH * 0.46))
    const swatch = Math.round(legendRowH * 0.58)
    const gap = Math.round(swatch * 0.55)
    const colW = artW / legendCols

    const ink = "#33261A"
    const faded = "rgba(51,38,26,.55)"

    ctx.textBaseline = "middle"
    ctx.textAlign = "left"

    // A header, so the block says what it is on a printed page with no context.
    // Positioned within the lead band rather than measured back from the first row:
    // 45% of the way down it sits clear of the picture above and the rule below,
    // whatever the type size works out to.
    ctx.font = `800 ${headSize}px "Nunito Sans", system-ui, sans-serif`
    ctx.fillStyle = ink
    ctx.fillText(opts.legendTitle ?? "DMC", margin, margin + artH + legendLead * 0.45)

    // The rule under the header, lighter than the grid so it separates without
    // competing with it.
    const ruleY = Math.round(margin + artH + legendLead * 0.78) + 0.5
    ctx.strokeStyle = "rgba(20,16,12,.3)"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(margin, ruleY)
    ctx.lineTo(canvas.width - margin, ruleY)
    ctx.stroke()

    // Every reference is aligned on the same column, so the names start together
    // however wide the numbers are.
    ctx.font = `800 ${bodySize}px "Nunito Sans", system-ui, sans-serif`
    let codeW = 0
    for (const index of shown) {
      codeW = Math.max(codeW, ctx.measureText(pattern.threads[index].num).width)
    }
    const suffix = opts.countSuffix ?? "pts"
    const countW = ctx.measureText(`0000 ${suffix}`).width

    shown.forEach((index, i) => {
      const thread = pattern.threads[index]
      const col = i % legendCols
      const row = Math.floor(i / legendCols)
      const x = margin + col * colW
      const y = top + row * legendRowH + legendRowH / 2

      // A hairline under each row, kept inside the column so the columns read as
      // columns rather than as one wide table.
      if (row > 0) {
        ctx.strokeStyle = "rgba(20,16,12,.09)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, Math.round(y - legendRowH / 2) + 0.5)
        ctx.lineTo(x + colW - gap, Math.round(y - legendRowH / 2) + 0.5)
        ctx.stroke()
      }

      // The swatch carries a border of its own: a pale thread on pale paper is
      // otherwise an empty square.
      ctx.fillStyle = thread.hex
      ctx.fillRect(x, y - swatch / 2, swatch, swatch)
      ctx.strokeStyle = "rgba(20,16,12,.45)"
      ctx.lineWidth = 1
      ctx.strokeRect(x + 0.5, y - swatch / 2 + 0.5, swatch - 1, swatch - 1)

      const codeX = x + swatch + gap
      ctx.font = `800 ${bodySize}px "Nunito Sans", system-ui, sans-serif`
      ctx.fillStyle = ink
      ctx.fillText(thread.num, codeX, y)

      // Counts right-aligned at the column's edge, so they line up down the page.
      ctx.textAlign = "right"
      ctx.font = `600 ${bodySize}px "Nunito Sans", system-ui, sans-serif`
      ctx.fillStyle = faded
      ctx.fillText(`${pattern.counts[index]} ${suffix}`, x + colW - gap, y)
      ctx.textAlign = "left"

      // Whatever room is left goes to the name, clipped rather than allowed to
      // run into the count.
      const nameX = codeX + codeW + gap
      const nameRoom = x + colW - gap - countW - gap - nameX
      if (nameRoom > bodySize * 2) {
        ctx.font = `500 ${bodySize}px "Nunito Sans", system-ui, sans-serif`
        ctx.fillStyle = faded
        // Ellipsis rather than a hard clip. Clipping cut "Pewter Gray - Very Dark"
        // to "Pewter Gray - Very Da", which does not read as a shortened name — it
        // reads as a chart with a mistake in it.
        const label = opts.threadName ? opts.threadName(thread.name) : thread.name
        ctx.fillText(ellipsise(ctx, label, nameRoom), nameX, y)
      }
    })
  }

  return canvas
}

/**
 * Trim text to a width, ending in an ellipsis if anything was dropped.
 *
 * Binary search rather than a character-by-character walk: measureText is the
 * expensive call, and a thread name is short enough that a dozen probes settle it.
 */
function ellipsise(ctx: CanvasRenderingContext2D, text: string, room: number): string {
  if (ctx.measureText(text).width <= room) return text
  let lo = 0
  let hi = text.length
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (ctx.measureText(`${text.slice(0, mid).trimEnd()}…`).width <= room) lo = mid
    else hi = mid - 1
  }
  return lo > 0 ? `${text.slice(0, lo).trimEnd()}…` : "…"
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/png")
  })
}
