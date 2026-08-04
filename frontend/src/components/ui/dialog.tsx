import { useEffect, type ReactNode } from "react"

import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"

/**
 * Minimal modal shell in the design's language: blanc card, dashed rule under
 * the title, coral-on-hover close. Escape and backdrop both dismiss.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}) {
  const { t } = useI18n()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-blanc rounded-[24px] shadow-screen w-full max-w-xl max-h-[90vh] overflow-y-auto scroll-linen animate-stitch-in",
          className,
        )}
      >
        {/* z-10, because `sticky` alone does not win.
            A sticky element with `z-index: auto` paints among the positioned boxes
            in DOM order — and anything below it carrying a transform (the toggle
            switches' thumbs animate with translate-x) gets its own stacking context
            that behaves like z-index 0. Later in the document, so it won: scrolling
            the chart dialog dragged little white knobs straight across the title. */}
        <div className="flex items-center justify-between gap-4 p-6 border-b-2 border-dashed border-edge-2 sticky top-0 z-10 bg-blanc rounded-t-[24px]">
          <h2 className="text-xl m-0">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.converter.detail.close}
            className="size-9 shrink-0 rounded-full bg-linen text-cocoa flex items-center justify-center cursor-pointer transition-colors hover:bg-coral hover:text-blanc"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
