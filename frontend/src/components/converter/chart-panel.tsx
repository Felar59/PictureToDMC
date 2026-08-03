import { useCallback, useEffect, useId, useRef, useState } from "react"

import { DownloadGlyph } from "@/components/brand/icons"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { Pattern } from "@/engine/convert"
import { canvasToBlob, renderChart } from "@/engine/render"
import { useI18n } from "@/i18n"

/**
 * The chart panel: the printable chart, visible, with the options that change
 * it sitting next to it.
 *
 * Everything used to be typed in blind — four switches and a Download button,
 * and you only discovered what "outline" did after saving the PNG and opening
 * it. The preview is the same renderChart call the download makes, with the
 * same options, so there is nothing to keep in sync and no second drawing
 * routine to disagree with the file.
 */

/** Stitch size of the saved PNG: big enough to print and count on. */
const FILE_CELL = 14

/**
 * Stitch size of the preview — half the file's.
 *
 * Cell size drives the canvas area, not the number of draw calls (one fillRect
 * per stitch either way), so halving it quarters the pixels touched, and the
 * preview never goes through PNG encoding at all. Going lower is tempting but
 * stops being a preview: the fine grid is 1px and the decade rules 2px, and
 * below ~6px per stitch the two collapse into each other once the browser
 * downscales the bitmap into a 256px column. At 7 a decade block is 70px, so
 * the counting grid still reads as a counting grid. The legend survives the
 * shrink because renderChart floors its row height at 26px whatever the cell
 * size — only its column count follows the drawing width, so a wide chart may
 * pack its DMC codes into more columns in the file than it shows here.
 */
const PREVIEW_CELL = 7

/**
 * A colour input fires continuously while the pointer is down. The chart waits
 * for the hand to settle rather than redrawing a few hundred times across a
 * single drag of the picker.
 */
const SETTLE_MS = 140

function useSettled<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return settled
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="min-w-0">
        <span className="block text-[15px] font-bold text-bark">{label}</span>
        <span className="block text-[13px] text-stone">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

/** Label, hex readout, swatch. Wraps rather than squeezing: the label plus the
 *  readout plus the swatch does not fit one line at 256px. */
function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
      <span className="text-[15px] font-bold text-bark">{label}</span>
      <span className="flex items-center gap-2.5">
        <span className="font-mono text-xs text-stone">{value.toUpperCase()}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-9 rounded-[10px] border-[1.5px] border-edge-3 cursor-pointer bg-transparent p-0"
        />
      </span>
    </label>
  )
}

export function ChartPanel({
  pattern,
  onError,
}: {
  pattern: Pattern
  onError: (key: string) => void
}) {
  const { t } = useI18n()
  const captionId = useId()
  const [grid, setGrid] = useState(true)
  const [legend, setLegend] = useState(true)
  // Lives here rather than in the settings: it changes the chart you
  // download, not the pattern itself.
  const [outline, setOutline] = useState(false)
  const [backcolor, setBackcolor] = useState("#EBE2D7")
  const [outlineColor, setOutlineColor] = useState("#141008")
  const [busy, setBusy] = useState(false)

  const settledColor = useSettled(backcolor, SETTLE_MS)
  const settledOutline = useSettled(outlineColor, SETTLE_MS)
  const stale = settledColor !== backcolor || settledOutline !== outlineColor

  // Held rather than memoised so the retry button can ask for the same draw
  // again: identity depends only on the inputs that change the chart, so a
  // re-render for any other reason does not redraw it.
  const [preview, setPreview] = useState<HTMLCanvasElement | null>(null)
  const [failed, setFailed] = useState(false)

  const drawPreview = useCallback(() => {
    try {
      setPreview(
        renderChart(pattern, {
          cellSize: PREVIEW_CELL,
          grid,
          legend,
          outline,
          outlineColor: settledOutline,
          background: settledColor,
        }),
      )
      setFailed(false)
    } catch {
      // A canvas this size can still be refused on a memory-starved device.
      // Silent: nothing is lost, the download path is independent.
      setPreview(null)
      setFailed(true)
    }
  }, [pattern, grid, legend, outline, settledOutline, settledColor])

  useEffect(drawPreview, [drawPreview])

  // Blitted into the visible canvas rather than mounting renderChart's own
  // node, so the element keeps its React-declared role and label.
  const viewRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const view = viewRef.current
    if (!view || !preview) return
    view.width = preview.width
    view.height = preview.height
    view.getContext("2d")?.drawImage(preview, 0, 0)
  }, [preview])

  const download = async () => {
    setBusy(true)
    try {
      // Drawn here and now, at full size. No upload, no server-side state to
      // get confused about whose pattern this is.
      const canvas = renderChart(pattern, {
        cellSize: FILE_CELL,
        grid,
        legend,
        outline,
        outlineColor,
        background: backcolor,
      })
      const blob = await canvasToBlob(canvas)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "BroderieDMC.png"
      document.body.appendChild(a)
      a.click()
      a.remove()
      // Deferred by one task: revoking in the same turn as the click is a known
      // way to have Safari cancel the download it was just handed.
      window.setTimeout(() => URL.revokeObjectURL(url), 0)
    } catch {
      onError("download")
    } finally {
      setBusy(false)
    }
  }

  return (
    // Container queries, not breakpoints: this sits in the converter's centre
    // column at about 436px and fills a dialog at about 950px, and neither width
    // follows the viewport. No card and no heading of its own — the converter
    // wraps it in a panel, the piece page opens it in a dialog that already has a
    // title, and a card inside a dialog is one frame too many.
    <div className="@container flex flex-col gap-4">
      {/* Side by side only in a genuinely wide container. Neither placement today
          reaches 704px, and splitting either would leave the chart about 200px
          across at 4px per stitch: no longer a preview of anything. So they stack
          on purpose, and the row form is there for a full-width host.
          Every part of the split shares this one threshold. When the two halves
          disagreed — the options pinned to 250px from 480px up while the parent
          only turned into a row at 704px — anything queried between those two
          numbers got the coral download button squeezed into a narrow strip with
          half the panel empty beside it, which is exactly where a 768px tablet
          landed on the piece page. */}
      <div className="flex flex-col gap-5 @min-[44rem]:flex-row @min-[44rem]:items-start">
        {/* The chart leads; the switches below are adjustments to it. */}
        <figure className="m-0 flex flex-col gap-2 min-w-0 @min-[44rem]:flex-1">
          {/* Paper stock rather than another card: this is the sheet you print and
              keep beside you. It had a torn top edge cut with a CSS mask, and the
              mask had to go — it clipped the focus ring of the retry button
              inside it, it put a filter pass over a live canvas, and at a fixed
              pitch it read as a ticket perforation rather than a tear. The colour
              and the lift say "sheet" without any of that. */}
          <div className="rounded-[6px] border-[1.5px] border-edge-4 bg-paper p-2 shadow-card flex items-center justify-center min-h-[120px]">
            {failed ? (
              <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
                <span className="text-[13px] text-stone">{t.chart.previewFailed}</span>
                <Button variant="secondary" size="sm" onClick={drawPreview}>
                  {t.chart.refresh}
                </Button>
              </div>
            ) : (
              <canvas
                ref={viewRef}
                role="img"
                // Named by the caption below rather than repeating it: the two
                // used to say the same sentence twice to a screen reader.
                aria-labelledby={captionId}
                // The intrinsic size is declared here, not only set in the effect
                // that blits: effects flush after paint, so a canvas whose
                // dimensions arrive later is painted once at the element's default
                // 300x150 and then reflows — a several-hundred-pixel jump on the
                // first frame of every piece page.
                width={preview?.width}
                height={preview?.height}
                // Both caps left to the browser: a replaced element keeps its
                // aspect ratio under max-width *and* max-height, which explicit
                // sizing would not. The global reduced-motion rule neutralises
                // the fade.
                style={{ width: "auto", height: "auto", maxHeight: 560 }}
                className={`block max-w-full rounded-[4px] transition-opacity duration-200 ${
                  stale ? "opacity-60" : "opacity-100"
                }`}
              />
            )}
          </div>
          {/* The caption says what the picture can't, and says it accurately: the
              stitches, grid, decade rules and background are the file exactly,
              but the legend reflows — its column count follows the drawing
              width, so a 364px preview lists the DMC codes in one column where
              the 728px file uses three. Claiming "exactly what you'll get"
              would be a promise the legend breaks. */}
          <figcaption id={captionId} className="font-hand text-[13px] text-sand text-center">
            {t.chart.previewHint}
          </figcaption>
        </figure>

        <div className="flex flex-col gap-4 @min-[44rem]:w-[250px] @min-[44rem]:shrink-0">
          <ToggleRow
            label={t.converter.download.grid}
            hint={t.converter.download.gridHint}
            checked={grid}
            onChange={setGrid}
          />
          <ToggleRow
            label={t.converter.download.legend}
            hint={t.converter.download.legendHint}
            checked={legend}
            onChange={setLegend}
          />
          <ToggleRow
            label={t.converter.colors.outline}
            hint={t.converter.colors.outlineHint}
            checked={outline}
            onChange={setOutline}
          />

          {/* Only offered once the outline is on. A colour picker for a line that
              isn't being drawn is a control to read past, and this panel already
              has five. */}
          {outline && (
            <ColorRow
              label={t.chart.outlineColor}
              value={outlineColor}
              onChange={setOutlineColor}
            />
          )}

          <ColorRow
            label={t.converter.download.background}
            value={backcolor}
            onChange={setBackcolor}
          />

          <Button size="block" onClick={download} disabled={busy}>
            <DownloadGlyph />
            {busy ? t.converter.download.working : t.converter.download.button}
          </Button>

          <p className="font-hand text-sm text-sand text-center m-0">
            {t.converter.download.note}
          </p>
        </div>
      </div>
    </div>
  )
}
