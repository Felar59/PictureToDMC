import { Bobbin } from "@/components/brand/bobbin"
import { ColorWheel } from "@/components/brand/icons"
import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"
import type { Thread } from "@/engine/dmc"

/** Rows that fit in the drawer before it starts scrolling (max-h / row height). */
const VISIBLE_ROWS = 7

/**
 * The thread drawer.
 *
 * This is the only part of the workbench that grows with the user's input —
 * 2 threads or 20 — so it scrolls inside a fixed frame rather than stretching
 * the whole grid row and stranding the canvas in dead space. The count sits
 * in the header, outside the scroll, so "20 colors" is readable without
 * scrolling to find out.
 */
export function ThreadList({
  threads,
  onSelect,
  onHover,
  pinned,
  onPin,
}: {
  threads: Thread[]
  onSelect: (t: Thread) => void
  onHover: (num: string | null) => void
  /** The thread currently kept picked out, if any. */
  pinned?: string | null
  onPin?: (num: string) => void
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-baseline gap-2">
        <span className="font-display font-medium text-[17px]">{t.converter.threads.heading}</span>
        {threads.length > 0 && (
          <span className="text-[13px] font-extrabold text-cocoa bg-blanc border-[1.5px] border-edge-3 rounded-full px-3 py-1">
            {t.converter.threads.count(threads.length)}
          </span>
        )}
      </div>

      {threads.length === 0 ? (
        <p className="text-sm text-stone m-0">{t.converter.threads.empty}</p>
      ) : (
        <div className="relative">
          <ul className="flex flex-col gap-2 list-none p-0 m-0 max-h-[min(52vh,560px)] overflow-y-auto scroll-linen pr-1.5">
            {threads.map((thread) => (
              <li key={thread.num}>
                {/* The row is a button now, not a div with mouse handlers.
                    It listened only for mouseenter and mouseleave, so on a phone —
                    where there is no hover at all — picking a thread out of the grid
                    was simply unavailable, while the hint underneath told people to
                    survoler one. A keyboard could not reach it either. Tapping pins
                    the thread; hovering still previews for a mouse. */}
                <div
                  className={cn(
                    "border-[1.5px] rounded-[14px] flex items-center gap-3 transition-colors",
                    pinned === thread.num
                      ? "bg-golden-wash border-golden-edge"
                      : "bg-blanc border-edge hover:border-taupe",
                  )}
                >
                  <button
                    type="button"
                    aria-pressed={pinned === thread.num}
                    aria-label={t.converter.threads.pinAria(thread.num)}
                    onClick={() => onPin?.(thread.num)}
                    onMouseEnter={() => onHover(thread.num)}
                    onMouseLeave={() => onHover(null)}
                    // 44px tall, which is the floor for a target a thumb has to find.
                    className="flex-1 min-w-0 flex items-center gap-3 text-left px-3 py-2.5 min-h-[44px] cursor-pointer"
                  >
                    <Bobbin hex={thread.hex} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13.5px] font-extrabold">DMC {thread.num}</span>
                      <span className="block text-[12.5px] text-stone truncate">{thread.name}</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelect(thread)}
                    aria-label={t.converter.threads.swapAria(thread.num)}
                    className="size-11 mr-1.5 shrink-0 rounded-full bg-linen border-[1.5px] border-edge-3 flex items-center justify-center cursor-pointer transition-colors hover:border-coral"
                  >
                    <ColorWheel />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* A row clipped flat at the fold reads as a bug; a fade reads as
              "keep going". The drawer holds ~7 rows before it overflows. */}
          {threads.length > VISIBLE_ROWS && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-linen to-transparent"
            />
          )}
        </div>
      )}

      {threads.length > 0 && (
        <p className="text-[13px] leading-snug text-stone text-center m-0">
          {t.converter.threads.hints}
        </p>
      )}
    </div>
  )
}
