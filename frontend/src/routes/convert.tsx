import { useCallback, useMemo, useState } from "react"

import { CustomThreadsDialog } from "@/components/converter/custom-threads-dialog"
import { DownloadPanel } from "@/components/converter/download-panel"
import { PatternCanvas, type CanvasView } from "@/components/converter/pattern-canvas"
import { PhotoDropzone, type LoadedPhoto } from "@/components/converter/photo-dropzone"
import { ThreadDetailDialog } from "@/components/converter/thread-detail-dialog"
import { ThreadList } from "@/components/converter/thread-list"
import { Button } from "@/components/ui/button"
import { FieldLabel, PanelTitle, Readout, SubPanel } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useI18n } from "@/i18n"
import {
  ApiError,
  fetchWhiteMasks,
  replaceColor as replaceColorRequest,
  uploadImage,
  type DMCColor,
} from "@/lib/api"

type ErrorKey = keyof ReturnType<typeof useI18n>["t"]["converter"]["errors"]

/** Turn a backend failure into something a stitcher can act on. */
function classify(err: unknown): ErrorKey {
  if (err instanceof ApiError) {
    if (err.kind === "network") return "network"
    // KMeans refuses when the photo has fewer distinct colors than clusters:
    // "n_samples=6 should be >= n_clusters=8".
    if (err.detail?.includes("n_clusters")) return "tooFewColors"
  }
  return "generic"
}

export default function Convert() {
  const { t } = useI18n()

  // inputs
  const [photo, setPhoto] = useState<LoadedPhoto | null>(null)
  const [imageSize, setImageSize] = useState(50)
  const [colorCount, setColorCount] = useState(8)
  const [outline, setOutline] = useState(true)
  const [useCustom, setUseCustom] = useState(false)
  const [customThreads, setCustomThreads] = useState<DMCColor[]>([])
  const [customOpen, setCustomOpen] = useState(false)

  // results
  const [pattern, setPattern] = useState<string | null>(null)
  const [threads, setThreads] = useState<DMCColor[]>([])
  const [masks, setMasks] = useState<Record<string, string>>({})

  // ui
  const [busy, setBusy] = useState(false)
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null)
  const [view, setView] = useState<CanvasView>("pattern")
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<DMCColor | null>(null)

  /** Picking a photo shows it straight away — the canvas is now the only
   *  place it appears, so landing on an empty "Pattern" tab would leave no
   *  confirmation that the file was even read. */
  const handlePhoto = useCallback((next: LoadedPhoto) => {
    setPhoto(next)
    setView("original")
  }, [])

  const patternHeight = useMemo(
    () => (photo && photo.width > 0 ? Math.round((imageSize * photo.height) / photo.width) : null),
    [photo, imageSize],
  )

  const create = useCallback(async () => {
    if (!photo) return setErrorKey("noImage")
    if (useCustom && customThreads.length < colorCount) return setErrorKey("notEnoughCustom")

    setBusy(true)
    setErrorKey(null)
    setPattern(null)
    setThreads([])
    setMasks({})
    // Switch now, not on success: the work is happening on the Pattern tab,
    // so that's where the loading state belongs. Staying on Original would
    // show a finished photo while the grid is still being matched.
    setView("pattern")

    try {
      const { image, values } = await uploadImage({
        image: photo.dataUrl,
        colorCount,
        imageSize,
        outline,
        colors: useCustom ? customThreads : [],
      })
      setPattern(`data:image/png;base64,${image}`)
      setThreads(values)

      // Highlight masks are a bonus; losing them must not lose the pattern.
      try {
        const { whitemasks } = await fetchWhiteMasks()
        const next: Record<string, string> = {}
        for (const v of values) {
          const b64 = whitemasks[v.num]
          if (b64) next[v.num] = `data:image/png;base64,${b64}`
        }
        setMasks(next)
      } catch {
        setMasks({})
      }
    } catch (err) {
      setErrorKey(classify(err))
    } finally {
      setBusy(false)
    }
  }, [photo, useCustom, customThreads, colorCount, imageSize, outline])

  const replace = useCallback(async (from: DMCColor, to: DMCColor) => {
    try {
      const { image } = await replaceColorRequest(from, to)
      setPattern(`data:image/png;base64,${image}`)
      setThreads((prev) => prev.map((c) => (c.num === from.num ? to : c)))
      // The old mask still describes the right stitches — it just answers to
      // a new code now. Rebuilt immutably so React actually re-renders.
      setMasks((prev) => {
        if (!(from.num in prev)) return prev
        const { [from.num]: mask, ...rest } = prev
        return { ...rest, [to.num]: mask }
      })
      setSelected(to)
    } catch (err) {
      setErrorKey(classify(err))
      setSelected(null)
    }
  }, [])

  const startOver = () => {
    setPhoto(null)
    setPattern(null)
    setThreads([])
    setMasks({})
    setErrorKey(null)
    setSelected(null)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-10">
      {/* ---------------- page head ---------------- */}
      <div className="flex items-end justify-between gap-4 flex-wrap mb-7">
        <div>
          <h1 className="text-[30px] sm:text-[34px] m-0">{t.converter.title}</h1>
          <p className="text-[15.5px] text-clay m-0 mt-1">{t.converter.lead}</p>
        </div>
        {(photo || pattern) && (
          <Button variant="quiet" onClick={startOver}>
            {t.converter.startOver}
          </Button>
        )}
      </div>

      {errorKey && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-4 bg-coral-wash border-2 border-dashed border-coral-edge rounded-[16px] px-5 py-4"
        >
          <p className="flex-1 text-[15px] text-coral-deeper m-0">{t.converter.errors[errorKey]}</p>
          <button
            type="button"
            onClick={() => setErrorKey(null)}
            className="text-coral-deep text-sm font-bold cursor-pointer hover:text-coral-deeper shrink-0"
          >
            {t.converter.errors.dismiss}
          </button>
        </div>
      )}

      {/* ---------------- the workbench ----------------
          settings left, fabric centre, threads right — the same spatial
          logic as a real craft table. */}
      <div className="grid gap-7 lg:grid-cols-[296px_1fr] xl:grid-cols-[296px_1fr_312px]">
        {/* left: controls. Size and colour used to be two panels, but both
            answer the same question — how the pattern comes out — so the
            split was chrome, not structure. */}
        <div className="flex flex-col gap-4">
          <SubPanel>
            <PanelTitle className="mb-4">{t.converter.settings.heading}</PanelTitle>

            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>{t.converter.size.stitchesWide}</FieldLabel>
              <Readout>{imageSize}</Readout>
            </div>
            <Slider
              value={[imageSize]}
              onValueChange={([v]) => setImageSize(v)}
              min={20}
              max={200}
              step={2}
              aria-label={t.converter.size.stitchesWide}
            />
            <div className="flex justify-between text-xs text-sand mt-1.5 mb-5">
              <span>20</span>
              <span>200</span>
            </div>

            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>{t.converter.colors.threadColors}</FieldLabel>
              <Readout>{colorCount}</Readout>
            </div>
            <Slider
              value={[colorCount]}
              onValueChange={([v]) => setColorCount(v)}
              min={2}
              max={20}
              step={1}
              aria-label={t.converter.colors.threadColors}
            />
            <div className="flex justify-between text-xs text-sand mt-1.5 mb-4">
              <span>2</span>
              <span>20</span>
            </div>

            <label className="flex items-center justify-between gap-3 cursor-pointer pt-4 border-t-2 border-dashed border-edge">
              <span>
                <span className="block text-sm font-bold text-bark">
                  {t.converter.colors.outline}
                </span>
                <span className="block text-[13px] text-stone">
                  {outline ? t.converter.colors.outlineOn : t.converter.colors.outlineOff}
                </span>
              </span>
              <Switch checked={outline} onCheckedChange={setOutline} />
            </label>

            <p className="bg-linen rounded-[12px] px-3.5 py-2.5 text-[13.5px] text-clay m-0 mt-4">
              {patternHeight
                ? t.converter.size.note(imageSize, patternHeight)
                : t.converter.size.unknown}
            </p>
          </SubPanel>

          <SubPanel className="flex flex-col gap-3">
            <div>
              <span className="block font-display font-medium text-[15px] text-ink">
                {t.converter.custom.heading}
              </span>
              <span className="block text-[13px] text-stone leading-snug">
                {useCustom ? t.converter.custom.toggleOn : t.converter.custom.toggleOff}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setCustomOpen(true)}
            >
              {t.converter.custom.open}
              {customThreads.length > 0 && ` (${customThreads.length})`}
            </Button>
          </SubPanel>

          <Button size="block" onClick={create} disabled={busy || !photo}>
            {busy ? t.converter.canvas.building : pattern ? t.converter.recreate : t.converter.create}
          </Button>
        </div>

        {/* centre: the cloth, and getting it off the screen. Download lives
            under the pattern it downloads — see it, then take it — which also
            evens the three columns out instead of stranding this one short. */}
        <div className="flex flex-col gap-6 lg:border-x-2 lg:border-dashed lg:border-edge-2 lg:px-7">
          {photo ? (
            <PatternCanvas
              pattern={pattern}
              original={photo.dataUrl}
              maskSrc={hovered ? masks[hovered] : undefined}
              view={view}
              onViewChange={setView}
              busy={busy}
              onPhoto={handlePhoto}
              aspect={photo.width > 0 ? photo.width / photo.height : 1}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <PhotoDropzone onPhoto={handlePhoto} />
              <p className="font-hand text-sm text-sand text-center m-0">
                {t.converter.canvas.note}
              </p>
            </div>
          )}

          {threads.length > 0 && <DownloadPanel onError={(k) => setErrorKey(k as ErrorKey)} />}
        </div>

        {/* right: the thread drawer */}
        <div className="lg:col-span-2 xl:col-span-1">
          <ThreadList threads={threads} onSelect={setSelected} onHover={setHovered} />
        </div>
      </div>

      <CustomThreadsDialog
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        enabled={useCustom}
        onEnabledChange={setUseCustom}
        threads={customThreads}
        onThreadsChange={setCustomThreads}
      />

      <ThreadDetailDialog
        thread={selected}
        threads={threads}
        onClose={() => setSelected(null)}
        onReplace={replace}
      />
    </div>
  )
}
