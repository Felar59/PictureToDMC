import { useEffect, useMemo, useRef, useState } from "react"

import { Bobbin } from "@/components/brand/bobbin"
import { ThreadRow } from "@/components/brand/thread-row"
import { ChartPanel } from "@/components/converter/chart-panel"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import type { Pattern } from "@/engine/convert"
import { canvasToBlob, isolateImageData, patternImageData, renderChart } from "@/engine/render"
import { threadName } from "@/engine/dmc-names-fr"
import { useI18n } from "@/i18n"

/**
 * "Get the chart", opened from a published piece.
 *
 * Everything about taking the pattern away lives in here — the preview, the
 * options that change it, the download, and the list of threads you would buy.
 * On the page itself all of that was a column beside the picture, which meant
 * the taller it grew the more empty cloth sat under the pattern, and it grew
 * with the number of colours. A dialog has no such neighbour to leave behind.
 *
 * Wide on purpose: ChartPanel splits into preview-and-controls above 44rem of
 * container, so at this size the options read as adjustments to something you
 * can see rather than a list to guess at.
 */
export function ChartDialog({
  open,
  onClose,
  pattern,
  onError,
}: {
  open: boolean
  onClose: () => void
  pattern: Pattern
  onError: (key: string) => void
}) {
  const { t } = useI18n()
  /** Index into pattern.threads of the thread being shown alone, or null. */
  const [solo, setSolo] = useState<number | null>(null)

  // A pattern this dialog was opened for is a different pattern's palette: an
  // index into the old one would isolate an unrelated colour, or none.
  useEffect(() => setSolo(null), [pattern])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t.chart.heading}
      className="max-w-[1040px] @container"
    >
      <div className="flex flex-col gap-6">
        <ChartPanel pattern={pattern} onError={onError} />

        {/* The shopping list belongs with the chart, not with the picture: it is
            the other half of "what do I need to stitch this". Full width under
            both columns so long thread names have room to sit on one line. */}
        <div className="border-t-2 border-dashed border-edge-2 pt-5">
          <h3 className="font-display font-medium text-[17px] m-0">
            {t.chart.threads(pattern.threads.length)}
          </h3>
          {/* Taught, not guessed at. An icon-only control with no hint is a coin
              toss for someone who has never seen this, and the converter already
              teaches its hover behaviour the same way. Only when there is more
              than one thread, because isolating the only colour changes nothing. */}
          {solo !== null || pattern.threads.length > 1 ? (
            <p className="font-hand text-[13px] text-sand m-0 mt-1">{t.chart.isolate.hint}</p>
          ) : null}

          {solo !== null && (
            <SoloPlanche
              pattern={pattern}
              index={solo}
              onClose={() => setSolo(null)}
              onError={onError}
            />
          )}

          <ul className="grid gap-2.5 list-none p-0 m-0 mt-4 @min-[34rem]:grid-cols-2 @min-[56rem]:grid-cols-3">
            {pattern.threads.map((thread, i) => (
              <ThreadRow
                key={thread.num}
                thread={thread}
                count={pattern.counts[i]}
                surface="chip"
                isolate={
                  pattern.threads.length > 1
                    ? { active: solo === i, onToggle: () => setSolo(solo === i ? null : i) }
                    : undefined
                }
              />
            ))}
          </ul>
        </div>
      </div>
    </Dialog>
  )
}

/**
 * The pattern with one thread left in colour and the rest veiled.
 *
 * Deliberately *not* a re-render of the printable chart: the preview above
 * carries a caption promising it is the file you are about to download, and
 * repainting it with a single colour would make that caption a lie. This is a
 * separate view of the same grid, in the veil-and-keyline language the converter
 * already uses when you hover a thread.
 *
 * It also stays open below the heading with the list still on screen, rather than
 * opening a layer. Dialog registers its own document-level Escape handler, so a
 * nested one would close both at once — and for a forty-thread list, keeping your
 * place matters more than a bigger picture.
 */
function SoloPlanche({
  pattern,
  index,
  onClose,
  onError,
}: {
  pattern: Pattern
  index: number
  onClose: () => void
  onError: (key: string) => void
}) {
  const { t, lang } = useI18n()
  const thread = pattern.threads[index]
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [saving, setSaving] = useState(false)

  /**
   * The sheet for this one skein, as a PNG.
   *
   * With two threads a shade apart, this is how you get both done in one sitting:
   * take the two sheets, work one and then the other, and the pair that is hard to
   * tell apart on a full chart never has to be told apart at all.
   *
   * The keyline is left at its default, which `onlyThread` turns on — a single
   * thread covers a fraction of the grid, and without the silhouette of the whole
   * piece around it the page is a scatter of marks in an empty field. For a white
   * thread on pale paper it would be an empty field full stop.
   */
  const download = async () => {
    if (saving) return
    setSaving(true)
    try {
      const canvas = renderChart(pattern, {
        onlyThread: index,
        legendTitle: t.chart.isolate.legendTitle(
          thread.num,
          pattern.counts[index],
          pattern.width,
          pattern.height,
        ),
        countSuffix: t.chart.countSuffix,
        // La grille imprimee suit la langue de l'interface, comme son titre de
        // legende juste au-dessus. Le numero reste imprime en premier et en gras :
        // c'est lui qu'on achete.
        threadName: (n) => threadName(n, lang),
      })
      const blob = await canvasToBlob(canvas)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `BroderieDMC-${thread.num}.png`
      a.click()
      // Deferred: revoking in the same tick is a way to have Safari cancel the
      // download it was just handed.
      setTimeout(() => URL.revokeObjectURL(url), 0)
    } catch {
      onError("download")
    } finally {
      setSaving(false)
    }
  }

  // isolateImageData allocates three sub-pixels per stitch per side, so a tall
  // pattern at the slider's maximum is a multi-megabyte buffer the browser is
  // allowed to refuse. Both are built behind the same guard so a refusal shows a
  // message instead of tearing down the dialog.
  //
  // The failure is the null, not a state flag — setting state while rendering is
  // how you get a second render before the first has painted.
  const images = useMemo(() => {
    void attempt // a retry rebuilds even though nothing else changed
    try {
      return { base: patternImageData(pattern), veil: isolateImageData(pattern, index) }
    } catch {
      return null
    }
  }, [pattern, index, attempt])

  useEffect(() => {
    hostRef.current?.scrollIntoView({ block: "nearest" })
  }, [index])

  return (
    <div
      ref={hostRef}
      role="group"
      aria-label={t.chart.isolate.planche(thread.num)}
      className="mt-4 mb-1 p-4 sm:p-5 bg-linen rounded-card-lg border-2 border-dashed border-golden-edge flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <Bobbin hex={thread.hex} />
        <div className="min-w-0">
          <div className="font-display font-medium text-[19px] text-ink">DMC {thread.num}</div>
          <div className="text-[14px] text-cocoa break-words">{threadName(thread.name, lang)}</div>
        </div>
        <div className="font-mono text-[13px] text-stone ml-auto shrink-0">
          {t.piece.stitches(pattern.counts[index])}
        </div>
      </div>

      {!images ? (
        <div className="flex flex-col items-center gap-3">
          <p role="status" className="text-[14px] text-cocoa text-center m-0">
            {t.chart.isolate.failed}
          </p>
          <Button variant="secondary" size="sm" onClick={() => setAttempt((n) => n + 1)}>
            {t.chart.isolate.retry}
          </Button>
        </div>
      ) : (
        <>
          {/* w-fit, not a full-width panel: a portrait grid in a stretched box
              leaves a wide margin of bare cloth either side, which is the same
              emptiness this dialog was built to get rid of. The cloth wraps the
              grid and the pair is centred. */}
          <div className="bg-aida rounded-card p-4 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] w-fit max-w-full mx-auto">
            {/* Bounded on both axes, and the height cap is the one that matters: a
                portrait pattern at 420 wide is 540 tall, which pushed the thread
                list and the way out clean off the dialog — and keeping the list in
                reach is the whole reason this opens inline instead of as a layer.
                aspect-ratio rather than a computed height, so it still shrinks to
                the container at 375px. */}
            <div
              className="relative"
              style={{
                width: Math.min(420, (MAX_SOLO_HEIGHT * pattern.width) / pattern.height),
                maxWidth: "100%",
                aspectRatio: `${pattern.width} / ${pattern.height}`,
              }}
            >
              <Painted
                image={images.base}
                role="img"
                label={t.chart.isolate.canvas(thread.num)}
              />
              <Painted image={images.veil} overlay />
            </div>
          </div>
          <p className="font-hand text-[13px] text-sand text-center m-0">
            {t.chart.isolate.caption}
          </p>
        </>
      )}

      {/* The download is the point of the panel, so it is the coral one — and the
          only coral inside this block. Getting out of it is quiet. */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm" onClick={() => void download()} disabled={saving}>
          {saving ? t.chart.isolate.saving : t.chart.isolate.download(thread.num)}
        </Button>
        <Button variant="quiet" size="sm" onClick={onClose}>
          {t.chart.isolate.close}
        </Button>
      </div>
      <p className="font-hand text-[13px] text-sand text-center m-0 -mt-2">
        {t.chart.isolate.downloadHint}
      </p>
    </div>
  )
}

/** Tallest the isolated grid is drawn. Tall enough to count stitches on, short
 *  enough that the list it came from is still one small scroll away. */
const MAX_SOLO_HEIGHT = 300

/** A canvas sized to its ImageData, painted through a ref callback so a remount
 *  repaints it — an effect keyed on the data alone misses that. */
function Painted({
  image,
  overlay,
  role,
  label,
}: {
  image: ImageData
  overlay?: boolean
  role?: string
  label?: string
}) {
  return (
    <canvas
      ref={(canvas) => {
        if (!canvas) return
        canvas.width = image.width
        canvas.height = image.height
        canvas.getContext("2d")?.putImageData(image, 0, 0)
      }}
      role={role}
      aria-label={label}
      aria-hidden={overlay ? "true" : undefined}
      // Both fill the same box absolutely, so the veil cannot drift out of
      // register with the grid under it whatever the two buffers' real sizes are.
      style={{ imageRendering: "pixelated" }}
      className={
        overlay
          ? "absolute inset-0 w-full h-full rounded-[6px] pointer-events-none animate-veil"
          : "absolute inset-0 w-full h-full rounded-[6px]"
      }
    />
  )
}
