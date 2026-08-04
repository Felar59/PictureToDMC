import type { Thread } from "@/engine/dmc"
import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"
import { Bobbin } from "./bobbin"
import { SoloStitch } from "./icons"

/**
 * One thread, as a row: bobbin, reference, name, stitch count.
 *
 * Shared, because this appears in two places with identical contents and two
 * different grounds — a blanc card on the linen page, a linen chip inside the
 * blanc dialog. They were two hand-copied blocks, which is how the same text
 * ended up at 13.5px in one and 12px in the other.
 *
 * With `isolate` the whole row becomes the control rather than carrying a small
 * button of its own: a 34px target inside a three-column grid is the wrong bet
 * for someone who is not confident with a mouse, and a full-row toggle is
 * harmless and reversible. The glyph is then a sign, not a second target.
 */
export function ThreadRow({
  thread,
  count,
  surface,
  isolate,
  dense,
  className,
}: {
  thread: Thread
  count: number
  /** `card` sits on the linen page, `chip` sits inside a blanc dialog. */
  surface: "card" | "chip"
  isolate?: { active: boolean; onToggle: () => void }
  /** One line instead of two, for a list that is scanned rather than clicked. */
  dense?: boolean
  /** How the row sizes itself — the two callers lay their rows out differently. */
  className?: string
}) {
  const { t } = useI18n()

  // Dense puts the row on one line and drops the second baseline. It exists
  // because the same list is read for two different reasons: in the dialog you
  // are picking one thread to work from, and the row is a target you have to be
  // able to hit; on a piece page you are scanning an inventory, and a
  // two-line row per thread buried the comments under a 40-thread wall.
  const body = dense ? (
    <>
      <Bobbin hex={thread.hex} width={15} height={21} radius={4} />
      <span className="text-[13px] font-extrabold text-ink shrink-0">{thread.num}</span>
      <span className="flex-1 min-w-0 truncate text-[12px] text-stone">{thread.name}</span>
      <span className="font-mono text-[12px] text-cocoa shrink-0">{t.piece.stitches(count)}</span>
    </>
  ) : (
    <>
      <Bobbin hex={thread.hex} width={22} height={30} radius={6} />
      <span className="flex-1 min-w-0">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[14px] font-extrabold text-ink">DMC {thread.num}</span>
          <span className="font-mono text-[12.5px] text-cocoa shrink-0">
            {t.piece.stitches(count)}
          </span>
        </span>
        <span className="block text-[13px] text-stone leading-snug break-words">
          {thread.name}
        </span>
      </span>
      {isolate && <SoloStitch active={isolate.active} />}
    </>
  )

  const shape = dense
    ? "flex items-center gap-2 rounded-chip px-2.5 py-1.5"
    : "flex items-center gap-3 rounded-chip px-3 py-2.5 min-h-[56px]"

  if (!isolate) {
    return (
      <li
        className={cn(
          shape,
          surface === "card" ? "bg-blanc border-[1.5px] border-edge shadow-soft" : "bg-linen",
          className,
        )}
      >
        {body}
      </li>
    )
  }

  // `contents` so the button, not the li, is the flex or grid item — otherwise
  // every row would need its layout classes written twice.
  return (
    <li className="contents">
      <button
        type="button"
        onClick={isolate.onToggle}
        aria-pressed={isolate.active}
        // Native title as well: the app already leans on bare title= for bobbin
        // hints, and there is no tooltip component to reach for.
        title={t.chart.isolate.row(thread.num)}
        aria-label={t.chart.isolate.row(thread.num)}
        className={cn(
          "group w-full text-left cursor-pointer transition-colors",
          shape,
          isolate.active
            ? "bg-golden-wash border-[1.5px] border-golden-edge"
            : "bg-linen border-[1.5px] border-transparent hover:bg-aida",
          className,
        )}
      >
        {body}
      </button>
    </li>
  )
}
