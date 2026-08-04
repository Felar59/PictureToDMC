import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"

/**
 * The little flower beside the name of whoever runs the place.
 *
 * It says "admin" without saying it in capitals. Someone whose piece has just
 * been deleted, or who is reading a comment that closed a thread, should be able
 * to see where it came from — and the honest way to show that on a craft site is
 * a bloom pinned to the name, not a badge that looks like a moderation console.
 *
 * The label is a tooltip rather than visible text for one reason: the name is the
 * thing being read, and a word after every name would compete with it. It sits in
 * the hand face, which is what the design uses for an aside.
 *
 * `tabIndex` because a tooltip only reachable by hovering is a tooltip half the
 * people cannot read. Screen readers get the same sentence from the `aria-label`
 * on the outer span, so the bubble itself is hidden from them rather than read
 * out twice.
 */
export function AdminFlower({ className }: { className?: string }) {
  const { t } = useI18n()

  return (
    <span
      className={cn("group relative inline-flex align-middle cursor-default", className)}
      role="img"
      aria-label={t.account.adminBadge}
      tabIndex={0}
    >
      <span aria-hidden="true" className="leading-none select-none">
        🌸
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-chip bg-ink px-2.5 py-1 font-hand text-[12.5px] leading-tight text-blanc opacity-0 shadow-soft transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {t.account.adminBadge}
      </span>
    </span>
  )
}
