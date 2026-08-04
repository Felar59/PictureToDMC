import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"

/**
 * The mark on the name of whoever runs the place: a flower, and on a profile the
 * word that goes with it.
 *
 * Two shapes, for two jobs. On a profile page there is room beside the name and the
 * question being asked is "who is this", so the badge says `🌸 ADMIN` outright — the
 * same call emoji-art makes on the same box, and it means nobody has to hover to
 * find out. In a comment thread or under a piece the question is only "who wrote
 * this", the name is the thing being read, and a word after every one of them would
 * compete with it; there the flower stands alone and the label is a tooltip.
 *
 * Why show it at all: someone whose piece has just been deleted, or who is reading a
 * comment that closed a thread, should be able to see it came from the people who
 * run the gallery. A deletion should never be anonymous.
 *
 * Not coral. Coral is the colour that asks for a click on this site and this asks
 * for nothing, so the pill wears lavender — DMC 209, which the design system keeps
 * for decoration.
 *
 * `tabIndex` on the compact form because a tooltip only reachable by hovering is a
 * tooltip half the people cannot read. Screen readers get the same sentence from the
 * `aria-label`, so the bubble is hidden from them rather than read out twice.
 */
export function AdminFlower({
  variant = "compact",
  className,
}: {
  variant?: "compact" | "pill"
  className?: string
}) {
  const { t } = useI18n()

  if (variant === "pill") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 align-middle rounded-full",
          "border-[1.5px] border-lavender/45 bg-lavender/12 px-2.5 py-0.5",
          "font-mono text-[10.5px] font-extrabold uppercase tracking-[.12em] text-cocoa",
          className,
        )}
        // One label for the pair, so it is not read out as "flower, admin".
        role="img"
        aria-label={t.account.adminBadge}
        title={t.account.adminBadge}
      >
        <span aria-hidden="true" className="text-[12px] leading-none">
          🌸
        </span>
        {t.account.adminLabel}
      </span>
    )
  }

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
