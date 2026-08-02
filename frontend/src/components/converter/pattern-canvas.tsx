import { PixelGrid } from "@/components/brand/pixel-grid"
import { useI18n } from "@/i18n"
import { BERRY_COLS, berry } from "@/lib/pixel-art"
import { cn } from "@/lib/utils"
import { ReplacePhotoButton, type LoadedPhoto } from "./photo-dropzone"

export type CanvasView = "original" | "pattern"

/**
 * Rendered width of the preview. Fixed rather than user-adjustable: the
 * pattern is nearest-neighbour pixel art, so a zoom control only ever traded
 * a crisp image for a blurry one, and the chart you actually stitch from is
 * the downloaded PNG, not this.
 */
const CANVAS_WIDTH = 450

export function PatternCanvas({
  pattern,
  original,
  maskSrc,
  view,
  onViewChange,
  busy,
  onPhoto,
  aspect = 1,
}: {
  pattern: string | null
  original: string | null
  maskSrc?: string
  view: CanvasView
  onViewChange: (v: CanvasView) => void
  busy: boolean
  onPhoto: (photo: LoadedPhoto) => void
  /** Photo width / height — the placeholder matches it so the pattern
   *  doesn't cause a layout jump when it lands. */
  aspect?: number
}) {
  const { t } = useI18n()
  const shown = view === "pattern" ? pattern : original

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* toolbar */}
      <div className="flex bg-blanc border-[1.5px] border-edge-3 rounded-full p-1">
        {(["original", "pattern"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange(v)}
            // Pattern stays reachable while it's being built — that's where
            // the loading state lives.
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
      <div className="w-full overflow-auto scroll-linen flex justify-center">
        <div className="aida [--aida-size:22.5px] [--aida-ink:.09] bg-aida rounded-[20px] p-6 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] shrink-0">
          {shown ? (
            <div className="relative" style={{ width: CANVAS_WIDTH }}>
              <img
                src={shown}
                alt={t.converter.canvas[view]}
                style={{ imageRendering: "pixelated", width: CANVAS_WIDTH }}
                className="block h-auto rounded-[6px]"
              />
              {view === "pattern" && maskSrc && (
                <img
                  src={maskSrc}
                  alt=""
                  aria-hidden="true"
                  style={{ imageRendering: "pixelated", width: CANVAS_WIDTH }}
                  className="absolute inset-0 h-auto rounded-[6px] pointer-events-none mix-blend-lighten animate-mask-glow"
                />
              )}
            </div>
          ) : busy ? (
            <div
              className="relative overflow-hidden rounded-[6px] bg-[#F3ECDC]/60"
              style={{ width: CANVAS_WIDTH, height: Math.round(CANVAS_WIDTH / (aspect || 1)) }}
              role="status"
              aria-label={t.converter.canvas.building}
            >
              <div className="absolute inset-0 scale-150 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-shine" />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-4 text-center"
              style={{ width: CANVAS_WIDTH, minHeight: 320 }}
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
