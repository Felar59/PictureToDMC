import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { CustomThreadsDialog } from "@/components/converter/custom-threads-dialog"
import { DownloadPanel } from "@/components/converter/download-panel"
import { PublishDialog } from "@/community/publish-dialog"
import { PatternCanvas, type CanvasView } from "@/components/converter/pattern-canvas"
import { PhotoDropzone, type LoadedPhoto } from "@/components/converter/photo-dropzone"
import { ThreadDetailDialog } from "@/components/converter/thread-detail-dialog"
import { ThreadList } from "@/components/converter/thread-list"
import { Button } from "@/components/ui/button"
import { FieldLabel, PanelTitle, Readout, SubPanel } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { Pattern } from "@/engine/convert"
import { runConversion } from "@/engine/run-conversion"
import { findThread, type Thread } from "@/engine/dmc"
import { clearSession, loadSession, saveSession } from "@/engine/storage"
import { useI18n } from "@/i18n"

type ErrorKey = keyof ReturnType<typeof useI18n>["t"]["converter"]["errors"]

export default function Convert() {
  const { t } = useI18n()

  // inputs
  const [photo, setPhoto] = useState<LoadedPhoto | null>(null)
  const [stitchWidth, setStitchWidth] = useState(50)
  const [colorCount, setColorCount] = useState(8)
  const [outline, setOutline] = useState(true)
  const [useCustom, setUseCustom] = useState(false)
  const [customThreads, setCustomThreads] = useState<Thread[]>([])
  const [customOpen, setCustomOpen] = useState(false)

  // results
  const [pattern, setPattern] = useState<Pattern | null>(null)

  // ui
  const [busy, setBusy] = useState(false)
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null)
  const [view, setView] = useState<CanvasView>("pattern")
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<Thread | null>(null)
  const [restored, setRestored] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shared, setShared] = useState(false)

  const handlePhoto = useCallback((next: LoadedPhoto) => {
    setPhoto(next)
    setView("original")
  }, [])

  const patternHeight = useMemo(
    () =>
      photo && photo.width > 0 ? Math.round((stitchWidth * photo.height) / photo.width) : null,
    [photo, stitchWidth],
  )

  /** Bring back whatever was open last time. The pattern itself isn't stored —
   *  rebuilding it takes about as long as reading it would have. */
  useEffect(() => {
    let cancelled = false
    loadSession().then(async (session) => {
      if (cancelled || !session) return setRestored(true)
      try {
        const url = URL.createObjectURL(session.photo)
        const probe = new Image()
        await new Promise<void>((resolve) => {
          probe.onload = () => resolve()
          probe.onerror = () => resolve()
          probe.src = url
        })
        if (cancelled) return
        setPhoto({
          dataUrl: url,
          blob: session.photo,
          width: probe.naturalWidth,
          height: probe.naturalHeight,
        })
        setStitchWidth(session.stitchWidth)
        setColorCount(session.colorCount)
        setOutline(session.outline)
        setUseCustom(session.useCustomPalette)
        setCustomThreads(
          session.customThreadNums.map(findThread).filter((x): x is Thread => Boolean(x)),
        )
        setView("original")
      } finally {
        if (!cancelled) setRestored(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const create = useCallback(async () => {
    if (!photo) return setErrorKey("noImage")
    if (useCustom && customThreads.length < colorCount) return setErrorKey("notEnoughCustom")

    setBusy(true)
    setErrorKey(null)
    setPattern(null)
    setView("pattern")

    try {
      // Runs in a Web Worker in this tab. Nothing is uploaded, so two people
      // converting at once can no longer see each other's pattern, and the UI
      // keeps painting while k-means runs.
      const next = await runConversion(photo.blob, {
        stitchWidth,
        colorCount,
        palette: useCustom ? customThreads : undefined,
      })
      setPattern(next)
      void saveSession({
        photo: photo.blob,
        photoName: photo.name ?? "photo",
        stitchWidth,
        colorCount,
        outline,
        useCustomPalette: useCustom,
        customThreadNums: customThreads.map((c) => c.num),
        substitutions: {},
      })
    } catch (err) {
      console.error(err)
      setErrorKey("generic")
    } finally {
      setBusy(false)
    }
  }, [photo, useCustom, customThreads, colorCount, stitchWidth, outline])

  /** Swap one thread for another. A relabel plus a re-render — the stitches
   *  don't move, so there is nothing to recompute. */
  const replace = useCallback((from: Thread, to: Thread) => {
    setPattern((prev) => {
      if (!prev) return prev
      const at = prev.threads.findIndex((c) => c.num === from.num)
      if (at < 0) return prev
      const threads = [...prev.threads]
      threads[at] = to
      return { ...prev, threads }
    })
    setSelected(to)
  }, [])

  const startOver = () => {
    setPhoto(null)
    setPattern(null)
    setErrorKey(null)
    setSelected(null)
    void clearSession()
  }

  // The canvas draws the pattern itself now, so there is nothing to encode here.
  const hoveredIndex = useMemo(
    () => (pattern && hovered ? pattern.threads.findIndex((c) => c.num === hovered) : -1),
    [pattern, hovered],
  )

  // Revoke the object URL we created for a restored photo.
  const lastUrl = useRef<string | null>(null)
  useEffect(() => {
    if (lastUrl.current && lastUrl.current !== photo?.dataUrl) URL.revokeObjectURL(lastUrl.current)
    lastUrl.current = photo?.dataUrl?.startsWith("blob:") ? photo.dataUrl : null
  }, [photo])

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-10">
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

      <div className="grid gap-7 lg:grid-cols-[296px_1fr] xl:grid-cols-[296px_1fr_312px]">
        {/* left: controls */}
        <div className="flex flex-col gap-4">
          <SubPanel>
            <PanelTitle className="mb-4">{t.converter.settings.heading}</PanelTitle>

            <div className="flex justify-between items-baseline mb-2">
              <FieldLabel>{t.converter.size.stitchesWide}</FieldLabel>
              <Readout>{stitchWidth}</Readout>
            </div>
            <Slider
              value={[stitchWidth]}
              onValueChange={([v]) => setStitchWidth(v)}
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
                ? t.converter.size.note(stitchWidth, patternHeight)
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

        {/* centre: the cloth */}
        <div className="flex flex-col gap-6 lg:border-x-2 lg:border-dashed lg:border-edge-2 lg:px-7">
          {photo ? (
            <PatternCanvas
              pattern={pattern}
              original={photo.dataUrl}
              highlightIndex={hoveredIndex}
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
                {restored ? t.converter.canvas.note : t.converter.canvas.building}
              </p>
            </div>
          )}

          {pattern && pattern.threads.length > 0 && (
            <>
              <DownloadPanel pattern={pattern} onError={(k) => setErrorKey(k as ErrorKey)} />
              {shared ? (
                <p className="font-hand text-[15px] text-nile-deep text-center m-0">
                  {t.publish.done}
                </p>
              ) : (
                <Button variant="secondary" size="block" onClick={() => setShareOpen(true)}>
                  {t.publish.open}
                </Button>
              )}
            </>
          )}
        </div>

        {/* right: the thread drawer */}
        <div className="lg:col-span-2 xl:col-span-1">
          <ThreadList
            threads={pattern?.threads ?? []}
            onSelect={setSelected}
            onHover={setHovered}
          />
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

      {pattern && (
        <PublishDialog
          pattern={pattern}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          onPublished={() => {
            setShareOpen(false)
            setShared(true)
          }}
        />
      )}

      <ThreadDetailDialog
        thread={selected}
        threads={pattern?.threads ?? []}
        onClose={() => setSelected(null)}
        onReplace={replace}
      />
    </div>
  )
}
