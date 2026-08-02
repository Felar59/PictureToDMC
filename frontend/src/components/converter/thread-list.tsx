import { Bobbin } from "@/components/brand/bobbin"
import { ColorWheel } from "@/components/brand/icons"
import { useI18n } from "@/i18n"
import type { DMCColor } from "@/lib/api"

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
}: {
  threads: DMCColor[]
  onSelect: (t: DMCColor) => void
  onHover: (num: string | null) => void
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
                <div
                  className="bg-blanc border-[1.5px] border-edge rounded-[14px] px-3 py-2.5 flex items-center gap-3 transition-colors hover:border-taupe"
                  onMouseEnter={() => onHover(thread.num)}
                  onMouseLeave={() => onHover(null)}
                >
                  <Bobbin hex={thread.hex} />

                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-extrabold">DMC {thread.num}</div>
                    <div className="text-xs text-stone truncate">{thread.name}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelect(thread)}
                    aria-label={t.converter.threads.swapAria(thread.num)}
                    className="size-[30px] shrink-0 rounded-full bg-linen border-[1.5px] border-edge-3 flex items-center justify-center cursor-pointer transition-colors hover:border-coral"
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
