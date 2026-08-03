import { useEffect, useRef, useState } from "react"

import { PixelGrid } from "@/components/brand/pixel-grid"
import type { Pattern } from "@/engine/convert"
import { isolateImageData, patternImageData } from "@/engine/render"
import { useI18n } from "@/i18n"
import { BERRY_COLS, berry } from "@/lib/pixel-art"
import { cn } from "@/lib/utils"
import { ReplacePhotoButton, type LoadedPhoto } from "./photo-dropzone"

export type CanvasView = "original" | "pattern"

/** Never draw wider than this, however much room there is. */
const MAX_WIDTH = 560
/** A portrait pattern may be twice as tall as it is wide, and no more. Past
 *  that the preview pushes the whole workbench off the screen, so the width
 *  shrinks to bring the height back under the cap. */
const MAX_ASPECT = 2
/** Tailwind p-6 on the aida frame, per side. */
const AIDA_PADDING = 24

/** Draws an ImageData into a canvas sized to match it. */
function useImageData(data: ImageData | null) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !data) return
    canvas.width = data.width
    canvas.height = data.height
    canvas.getContext("2d")?.putImageData(data, 0, 0)
  }, [data])

  return ref
}

/**
 * Live display size: fills the column's width, capped at MAX_WIDTH, and never
 * taller than twice its width.
 *
 * ResizeObserver rather than a media query — the middle column's width depends
 * on the three-column grid, not on the viewport, and it changes when the
 * browser window is dragged. Watching the element means the canvas resizes as
 * it happens instead of snapping at breakpoints.
 */
function useFittedSize(ratio: number) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [available, setAvailable] = useState(MAX_WIDTH)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => setAvailable(host.clientWidth || MAX_WIDTH)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  // The aida frame around the canvas is p-6, so 48px of it is not drawable.
  let width = Math.max(120, Math.min(available - AIDA_PADDING * 2, MAX_WIDTH))
  let height = width * ratio
  if (ratio > MAX_ASPECT) {
    height = width * MAX_ASPECT
    width = height / ratio
  }

  return { hostRef, width: Math.round(width), height: Math.round(height) }
}

export function PatternCanvas({
  pattern,
  original,
  highlightIndex,
  view,
  onViewChange,
  busy,
  onPhoto,
  aspect = 1,
}: {
  pattern: Pattern | null
  original: string | null
  /** Index into pattern.threads, or -1 for no highlight. */
  highlightIndex: number
  view: CanvasView
  onViewChange: (v: CanvasView) => void
  busy: boolean
  onPhoto: (photo: LoadedPhoto) => void
  /** Photo width / height — the placeholder matches it so the pattern doesn't
   *  cause a layout jump when it lands. */
  aspect?: number
}) {
  const { t } = useI18n()

  // Ratio of whatever is on screen: the pattern's own grid when there is one,
  // otherwise the photo's, so the placeholder occupies the same box the result
  // will.
  const ratio = pattern ? pattern.height / pattern.width : 1 / (aspect || 1)
  const { hostRef, width: boxW, height: boxH } = useFittedSize(ratio)

  // One pixel per stitch; CSS does the enlarging. Recomputed only when the
  // pattern or the hovered thread actually changes.
  const patternRef = useImageData(pattern ? patternImageData(pattern) : null)
  const veilRef = useImageData(
    pattern && highlightIndex >= 0 ? isolateImageData(pattern, highlightIndex) : null,
  )

  const showPattern = view === "pattern" && pattern
  const showOriginal = view === "original" && original

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* toolbar */}
      <div className="flex bg-blanc border-[1.5px] border-edge-3 rounded-full p-1">
        {(["original", "pattern"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange(v)}
            // Pattern stays reachable while it's being built — that's where the
            // loading state lives.
            disabled={v === "original" ? !original : !pattern && !busy}
            aria-pressed={view === v}
            className={cn(
              "font-display text-sm px-[18px] py-2 rounded-full cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-edge-5",
              view === v ? "bg-ink text-blanc" : "text-cocoa hover:text-coral-deep",
            )}
          >
            {t.converter.canvas[v]}
          </button>
        ))}
      </div>

      {/* the cloth */}
      <div ref={hostRef} className="w-full flex justify-center">
        <div className="aida [--aida-size:22.5px] [--aida-ink:.09] bg-aida rounded-[20px] p-6 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] shrink-0">
          {showPattern ? (
            <div className="relative" style={{ width: boxW, height: boxH }}>
              <canvas
                ref={patternRef}
                aria-label={t.converter.canvas.pattern}
                role="img"
                style={{ imageRendering: "pixelated", width: boxW, height: boxH }}
                className="block rounded-[6px]"
              />
              {/* Keyed on the thread so the veil settles in again each time the
                  hover moves — without it the entrance plays once and later
                  threads appear abruptly. */}
              {highlightIndex >= 0 && (
                <canvas
                  key={highlightIndex}
                  ref={veilRef}
                  aria-hidden="true"
                  style={{ imageRendering: "pixelated", width: boxW, height: boxH }}
                  className="absolute inset-0 rounded-[6px] pointer-events-none animate-veil"
                />
              )}
            </div>
          ) : showOriginal ? (
            <img
              src={original}
              alt={t.converter.canvas.original}
              style={{ width: boxW, height: boxH }}
              className="block rounded-[6px] object-contain"
            />
          ) : busy ? (
            <div
              className="relative overflow-hidden rounded-[6px] bg-[#F3ECDC]/60"
              style={{ width: boxW, height: boxH }}
              role="status"
              aria-label={t.converter.canvas.building}
            >
              <div className="absolute inset-0 scale-150 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-shine" />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-4 text-center"
              style={{ width: boxW, minHeight: 320 }}
            >
              <div className="opacity-35">
                <PixelGrid pixels={berry} cols={BERRY_COLS} size={14} radius={2} />
              </div>
              <div>
                <div className="font-display font-medium text-[17px] text-cocoa">
                  {t.converter.canvas.empty}
                </div>
                <div className="font-hand text-sm text-sand mt-1">
                  {t.converter.canvas.emptyHint}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Swapping the source photo belongs next to the source photo. */}
      {view === "original" && <ReplacePhotoButton onPhoto={onPhoto} />}

      <p className="font-hand text-sm text-sand text-center m-0">
        {busy ? t.converter.canvas.building : t.converter.canvas.note}
      </p>
    </div>
  )
}
