import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { CustomThreadsDialog } from "@/components/converter/custom-threads-dialog"
import { DownloadPanel } from "@/components/converter/download-panel"
import { PublishDialog } from "@/community/publish-dialog"
import { PatternCanvas, type CanvasView } from "@/components/converter/pattern-canvas"
import { PhotoDropzone, type LoadedPhoto } from "@/components/converter/photo-dropzone"
import { measureAlpha } from "@/engine/measure-alpha"
import { SettingsPanel, type Settings } from "@/components/converter/settings-panel"
import { ThreadDetailDialog } from "@/components/converter/thread-detail-dialog"
import { ThreadList } from "@/components/converter/thread-list"
import { Button } from "@/components/ui/button"
import { SubPanel } from "@/components/ui/card"
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
  const [settings, setSettings] = useState<Settings>({
    stitchWidth: 50,
    colorCount: 8,
    vividness: 0,
    flipH: false,
    flipV: false,
    removeBackground: false,
  })
  const patch = useCallback(
    (next: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...next })),
    [],
  )
  const { stitchWidth } = settings
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

  /** What the person actually needs to know before buying fabric: how big, and
   *  how many stitches there are to sew.
   *
   *  Before a conversion these are predictions from the photo's proportions —
   *  and for a PNG with transparency, the transparent share is measured on load,
   *  so the count already excludes what will stay bare instead of promising
   *  stitches that never appear. Once converted, the pattern knows exactly. */
  const summary = useMemo(() => {
    if (!patternHeight) {
      return (
        <p className="bg-linen rounded-[12px] px-3.5 py-2.5 text-[13.5px] text-clay m-0">
          {t.converter.size.unknown}
        </p>
      )
    }

    const total = stitchWidth * patternHeight
    const exact = pattern?.stitched
    const stitched = exact ?? Math.round(total * (photo?.opaqueRatio ?? 1))
    const bare = total - stitched

    return (
      <div className="bg-linen rounded-[12px] px-3.5 py-3">
        <div className="font-mono text-[13px] text-cocoa">
          {t.converter.size.grid(stitchWidth, patternHeight)}
        </div>
        <div className="font-display font-medium text-[19px] text-ink leading-tight mt-0.5">
          {t.converter.size.total(stitched)}
        </div>
        {bare > 0 && (
          <div className="text-[12.5px] text-stone leading-snug mt-1">
            {t.converter.size.split(stitched, bare)}
            {photo?.hasAlpha && <> — {t.converter.size.transparentNote}</>}
          </div>
        )}
      </div>
    )
  }, [t, stitchWidth, patternHeight, pattern, photo])

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
          // Re-measured rather than stored: it is a couple of milliseconds, and
          // a stored ratio could disagree with the engine that reads it.
          ...measureAlpha(probe, probe.naturalWidth, probe.naturalHeight),
        })
        setSettings((prev) => ({
          ...prev,
          stitchWidth: session.stitchWidth,
          colorCount: session.colorCount,
          vividness: session.vividness ?? 0,
          flipH: session.flipH ?? false,
          flipV: session.flipV ?? false,
          removeBackground: session.removeBackground ?? false,
        }))
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
    if (useCustom && customThreads.length < settings.colorCount)
      return setErrorKey("notEnoughCustom")

    setBusy(true)
    setErrorKey(null)
    setPattern(null)
    setView("pattern")

    try {
      // Runs in a Web Worker in this tab. Nothing is uploaded, so two people
      // converting at once can no longer see each other's pattern, and the UI
      // keeps painting while k-means runs.
      const next = await runConversion(photo.blob, {
        ...settings,
        palette: useCustom ? customThreads : undefined,
      })
      setPattern(next)
      void saveSession({
        photo: photo.blob,
        photoName: photo.name ?? "photo",
        ...settings,
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
  }, [photo, useCustom, customThreads, settings])

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
          <SettingsPanel settings={settings} onChange={patch} summary={summary} />

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
