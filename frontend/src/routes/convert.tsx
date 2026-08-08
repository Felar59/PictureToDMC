import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

import strawberryPhoto from "@/assets/demo/strawberry.avif"
import { ChartDownloadGlyph, ShareHoopGlyph } from "@/components/brand/icons"
import { CustomThreadsDialog } from "@/components/converter/custom-threads-dialog"
import { ChartDialog } from "@/community/chart-dialog"
import { ProductPreview } from "@/components/showcase/product-preview"
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
import { useHead } from "@/lib/head"
import { convertGraph } from "@/lib/schema"

type ErrorKey = keyof ReturnType<typeof useI18n>["t"]["converter"]["errors"]

/** "Vif" — the middle step of the three the panel offers. Kept in step with
 *  VIVIDNESS_STEPS in settings-panel.tsx, which owns the scale. */
const SAMPLE_VIVIDNESS = 55

export default function Convert() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const sample = params.get("exemple")

  useHead({
    title: t.head.convert.title,
    description: t.head.convert.description,
    // The application node lives here as well as on the home page, and points at
    // the same @id: this is the URL that *is* the tool, so it is the one an answer
    // engine should send someone to when asked where to convert a photo.
    jsonLd: convertGraph(t),
  })

  // inputs
  const [photo, setPhoto] = useState<LoadedPhoto | null>(null)
  const [settings, setSettings] = useState<Settings>({
    stitchWidth: 50,
    colorCount: 8,
    vividness: 0,
    rotation: 0,
    removeBackground: false,
  })
  const patch = useCallback(
    (next: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...next })),
    [],
  )
  /**
   * Bumped whenever a change should rebuild the grid.
   *
   * A counter rather than watching `settings`, because the two are deliberately
   * not the same event: a slider changes `settings` on every pixel of the drag so
   * the readout can follow your thumb, and reconverting there would queue thirty
   * runs to show one answer. The panel commits on release instead, and everything
   * that is a single click commits immediately.
   */
  const [revision, setRevision] = useState(0)
  const commit = useCallback(() => setRevision((r) => r + 1), [])
  /** Identifies the run in flight, so a slower one cannot overwrite a newer. */
  const runIdRef = useRef(0)
  /** Whether a grid has ever been built — adjustments only auto-rebuild after. */
  const hasBuiltRef = useRef(false)
  /** Set once the sample photograph is in state and waiting to be converted. */
  const samplePendingRef = useRef(false)
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
  /**
   * A thread picked out and kept picked out.
   *
   * Hover alone could not work: there is no hover on a phone, and the copy was
   * telling people to survoler a thread on a device where that gesture does not
   * exist. A tap pins one instead, and hovering still previews for a mouse — the
   * pin is what the list is actually for, the hover is a convenience on top.
   */
  const [pinned, setPinned] = useState<string | null>(null)
  const [selected, setSelected] = useState<Thread | null>(null)
  const [restored, setRestored] = useState(false)
  const [chartOpen, setChartOpen] = useState(false)
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

  /**
   * The sample the home page offers, arriving as `/convert?exemple=fraise`.
   *
   * The hero shows a strawberry and the chart it produced; this is the link between
   * the two. It loads that photograph with the settings that made that chart — 76
   * wide, 9 threads, vivid — and converts on arrival, so someone who has no
   * photograph to hand can still see the thing the front page promised.
   *
   * 76 rather than 74: on 14-count aida that is a hair under 14 cm, which lands on
   * a size somebody would actually stitch and frame. The number here is a
   * suggestion made to a stranger with no photograph of their own, so it may as
   * well be a good one.
   *
   * A query parameter rather than router state so the link survives being shared,
   * bookmarked, or opened in a new tab.
   */
  useEffect(() => {
    if (sample !== "fraise") return
    let cancelled = false
    void (async () => {
      try {
        const blob = await (await fetch(strawberryPhoto)).blob()
        const url = URL.createObjectURL(blob)
        const probe = new Image()
        await new Promise<void>((resolve) => {
          probe.onload = () => resolve()
          probe.onerror = () => resolve()
          probe.src = url
        })
        if (cancelled) return
        setSettings((prev) => ({
          ...prev,
          stitchWidth: 76,
          colorCount: 9,
          vividness: SAMPLE_VIVIDNESS,
          rotation: 0,
          removeBackground: false,
        }))
        setPhoto({
          dataUrl: url,
          blob,
          width: probe.naturalWidth,
          height: probe.naturalHeight,
          ...measureAlpha(probe, probe.naturalWidth, probe.naturalHeight),
        })
        // Convert as soon as the photo is in state, which the effect below does —
        // calling create() here would read a `photo` that has not landed yet.
        samplePendingRef.current = true
      } finally {
        if (!cancelled) setRestored(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sample])

  useEffect(() => {
    if (!samplePendingRef.current || !photo) return
    samplePendingRef.current = false
    void createRef.current()
  }, [photo])

  /** Bring back whatever was open last time. The pattern itself isn't stored —
   *  rebuilding it takes about as long as reading it would have. */
  useEffect(() => {
    // The sample wins: someone who followed that link wants the strawberry, not
    // whatever they were working on a week ago.
    if (sample === "fraise") return
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
          rotation: session.rotation ?? 0,
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

  /**
   * Build the grid.
   *
   * `keepPrevious` is what makes an adjustment feel like an adjustment. Clearing
   * the pattern is right the first time — there is nothing to keep, and the
   * shimmer says work is happening. On a re-run it is wrong: the grid you were
   * looking at vanishes, the column collapses to a placeholder, and it comes back a
   * moment later slightly different. Holding the old one until the new one lands
   * turns that into a redraw.
   */
  const create = useCallback(
    async (keepPrevious = false) => {
      if (!photo) return setErrorKey("noImage")
      if (useCustom && customThreads.length < settings.colorCount)
        return setErrorKey("notEnoughCustom")

      setBusy(true)
      setErrorKey(null)
      if (!keepPrevious) setPattern(null)
      setView("pattern")

      // One token per run. Adjustments can be made faster than a conversion
      // finishes — three quarter-turns in a second is easy — and without this the
      // slowest run wins instead of the last one, leaving the grid showing a
      // setting nobody has selected any more.
      const token = ++runIdRef.current

      try {
        // Runs in a Web Worker in this tab. Nothing is uploaded, so two people
        // converting at once can no longer see each other's pattern, and the UI
        // keeps painting while k-means runs.
        const next = await runConversion(photo.blob, {
          ...settings,
          palette: useCustom ? customThreads : undefined,
        })
        if (token !== runIdRef.current) return // a newer run has been started
        setPattern(next)
        hasBuiltRef.current = true
        void saveSession({
          photo: photo.blob,
          photoName: photo.name ?? "photo",
          ...settings,
          useCustomPalette: useCustom,
          customThreadNums: customThreads.map((c) => c.num),
          substitutions: {},
        })
      } catch (err) {
        if (token !== runIdRef.current) return
        console.error(err)
        setErrorKey("generic")
      } finally {
        if (token === runIdRef.current) setBusy(false)
      }
    },
    [photo, useCustom, customThreads, settings],
  )

  // Read through a ref so the effect below can fire on `revision` alone. With
  // `create` in its dependencies it would also run on every keystroke that changes
  // a setting, which is the debounce this was built to avoid.
  const createRef = useRef(create)
  createRef.current = create

  /**
   * Rebuild when a change is committed — but only once there is a grid to rebuild.
   *
   * Before the first conversion the button is the whole point: someone who has just
   * dropped a photograph is still choosing a width, and converting under them on
   * every touch would be both slow and presumptuous. After it, the grid on screen is
   * the answer to the current settings and has to keep being that.
   */
  useEffect(() => {
    if (revision === 0 || !hasBuiltRef.current) return
    void createRef.current(true)
  }, [revision])

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
  // Hover wins while it lasts, then the pin takes over again.
  const hoveredIndex = useMemo(() => {
    const num = hovered ?? pinned
    return pattern && num ? pattern.threads.findIndex((c) => c.num === num) : -1
  }, [pattern, hovered, pinned])

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

      {/* min-w-0 on each column: a grid item's automatic minimum size is its
          min-content width, so any child that refuses to shrink stretches the whole
          track instead. That is how the workbench came to be 560px wide on a 375px
          phone. */}
      <div className="grid gap-7 lg:grid-cols-[296px_1fr] xl:grid-cols-[296px_1fr_312px]">
        {/* left: controls */}
        <div className="flex flex-col gap-4 min-w-0">
          <SettingsPanel
            settings={settings}
            onChange={patch}
            onCommit={commit}
            photoUrl={photo?.dataUrl}
            summary={summary}
          />

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

          {/* Wrapped, not passed straight through: `create` takes a flag, and a
              click handler would hand it a MouseEvent as the first argument. */}
          <Button size="block" onClick={() => void create()} disabled={busy || !photo}>
            {busy ? t.converter.canvas.building : pattern ? t.converter.recreate : t.converter.create}
          </Button>
        </div>

        {/* centre: the cloth */}
        <div className="flex flex-col gap-6 min-w-0 lg:border-x-2 lg:border-dashed lg:border-edge-2 lg:px-7">
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
              {shared ? (
                <p className="font-hand text-[15px] text-nile-deep text-center m-0">
                  {t.publish.done}
                </p>
              ) : (
                <Button variant="secondary" size="block" onClick={() => setShareOpen(true)}>
                  <ShareHoopGlyph />
                  {t.publish.open}
                </Button>
              )}
            </>
          )}
        </div>

        {/* right: the thread drawer, and the way out */}
        <div className="lg:col-span-2 xl:col-span-1 flex flex-col gap-4 min-w-0">
          <ThreadList
            threads={pattern?.threads ?? []}
            onSelect={setSelected}
            onHover={setHovered}
            pinned={pinned}
            onPin={(num) => setPinned((prev) => (prev === num ? null : num))}
          />
          {/* The download sits under the threads and opens the same dialog a
              published piece does — preview on the left, the options that change
              it on the right. It used to be a panel in the middle column, which
              made the workbench scroll a long way past the thing being worked on;
              behind a button it is one click and the page stays short. */}
          {/* Secondary, not coral. "Mettre à jour la grille" already owns the
              coral here and is pressed over and over while the sliders move,
              whereas this is pressed once at the end — and two coral buttons on
              one screen is the one thing the palette forbids. The icon and the
              full width keep it unmistakable. */}
          {pattern && pattern.threads.length > 0 && (
            <Button variant="secondary" size="block" onClick={() => setChartOpen(true)}>
              <ChartDownloadGlyph />
              {t.converter.download.button}
            </Button>
          )}
        </div>
      </div>

      {/* Imagine it finished, once there is something to imagine.
          Below the workbench rather than inside it: the three columns are the
          thing you are working in, and this is the reward for having worked. Same
          section the published-piece page shows, so the motif is seen on the same
          four objects whether you just made it or found it in the gallery. */}
      {pattern && pattern.threads.length > 0 && (
        <div className="@container border-t border-edge-2 mt-14 pt-12">
          <ProductPreview pattern={pattern} />
        </div>
      )}

      {pattern && (
        <ChartDialog
          open={chartOpen}
          onClose={() => setChartOpen(false)}
          pattern={pattern}
          onError={(k) => setErrorKey(k as ErrorKey)}
        />
      )}

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
