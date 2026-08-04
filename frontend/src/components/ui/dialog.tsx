import { useEffect, useId, useRef, type ReactNode } from "react"

import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"
import { CrossMark } from "@/components/brand/icons"

/**
 * Minimal modal shell in the design's language: blanc card, dashed rule under
 * the title, coral-on-hover close. Escape and backdrop both dismiss.
 *
 * It also keeps the keyboard inside itself, which it did not do before. `aria-modal`
 * tells a screen reader that the rest of the page is unavailable, and Tab then walked
 * straight out of the dialog into the links behind it — so the announcement was a
 * promise the markup did not keep, and a keyboard user could end up operating a page
 * they could not see. Three parts to keeping it: move focus in on open, wrap Tab at
 * the ends, and put focus back where it came from on close.
 */
function focusable(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => el.offsetParent !== null || el === document.activeElement)
}
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
  const panelRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return

    // Whatever had focus before, so it can be handed back. Otherwise closing a dialog
    // drops focus to the top of the document and a keyboard user has to tab all the
    // way back to where they were.
    const opener = document.activeElement as HTMLElement | null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key !== "Tab") return
      const panel = panelRef.current
      if (!panel) return
      const items = focusable(panel)
      if (items.length === 0) {
        // Nothing to focus but the dialog itself — hold the keyboard here rather than
        // letting it escape to the page underneath.
        e.preventDefault()
        panel.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Focus the panel itself, not its first control.
    //
    // The first control is the close button — it is first in the DOM because the header
    // is — and landing there makes Escape and the first Tab the same key. Focusing the
    // panel instead has a screen reader announce the dialog and read its title, and
    // leaves Tab to walk the contents in order from the top.
    panelRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
      // Only if focus is still inside what is being torn down; if something else has
      // taken it deliberately, leave it alone.
      if (!panelRef.current || panelRef.current.contains(document.activeElement)) {
        opener?.focus?.()
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
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
          <h2 id={titleId} className="text-xl m-0">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.converter.detail.close}
            className="size-11 shrink-0 rounded-full bg-linen text-cocoa flex items-center justify-center cursor-pointer transition-colors hover:bg-coral hover:text-blanc"
          >
            <CrossMark size={13} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
