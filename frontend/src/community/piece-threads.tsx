import { ThreadRow } from "@/components/brand/thread-row"
import type { Pattern } from "@/engine/convert"
import { useI18n } from "@/i18n"

/**
 * What a published piece is made of.
 *
 * A gallery card shows five palette dots; clicking through to the piece itself
 * used to show fewer — the full list had moved inside the download dialog, so the
 * one page devoted to a piece was the one place you could not find out which
 * colours it used.
 *
 * Wide and short, under the picture, rather than narrow and tall beside it. That
 * is the whole reason the old version left a growing strip of bare cloth next to
 * the pattern: a column of forty rows is fourteen screens tall and the picture
 * cannot grow to meet it. Wrapped across the full width, forty threads are five
 * rows.
 */
export function PieceThreads({ pattern }: { pattern: Pattern }) {
  const { t } = useI18n()
  if (pattern.threads.length === 0) return null

  // Most-stitched first, in both the ribbon and the list — "what is this mostly
  // made of" is the question a palette answers.
  //
  // An index array, sorted; never the threads themselves. Sorting `threads` alone
  // detaches every count from the thread it belongs to, which is the same bug the
  // stored-pattern remap on this page already guards against.
  const order = [...pattern.threads.keys()].sort((a, b) => pattern.counts[b] - pattern.counts[a])

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline gap-3 mb-4">
        <h2 className="font-display font-medium text-[22px] text-ink m-0">
          {t.piece.threads.heading}
        </h2>
        <span className="font-mono text-[12.5px] text-stone">
          {t.gallery.colors(pattern.threads.length)}
        </span>
      </div>

      {/* One contiguous strip, each thread as wide as its share of the stitches.
          It is the only part of this section that gets *better* as the colour
          count rises — two threads read as two frank blocks, forty as a fine warm
          gradient — and it answers at a glance what the list can only be counted
          for. */}
      <figure className="m-0 mb-5">
        <div className="relative h-4 rounded-full overflow-hidden flex" aria-hidden="true">
          {order.map((i, position) => (
            <span
              key={pattern.threads[i].num}
              className="block min-w-[3px]"
              style={{
                flexBasis: `${(pattern.counts[i] / pattern.stitched) * 100}%`,
                background: pattern.threads[i].hex,
                // A hairline rather than a gap: a gap would show linen through the
                // ribbon, and this has to separate Blanc from Blanc-cassé as well
                // as it separates 310 from 3799.
                boxShadow:
                  position === order.length - 1
                    ? undefined
                    : "inset -1px 0 0 rgba(83,63,42,.10)",
              }}
            />
          ))}
          {/* The bobbin shading is an inset shadow, and insets paint under child
              content — so it goes on an overlay, not on the flex container. */}
          <span className="bobbin-sm absolute inset-0 rounded-full pointer-events-none" />
        </div>
        <figcaption className="font-hand text-[13px] text-sand mt-2">
          {t.piece.threads.order}
        </figcaption>
      </figure>

      {/* flex-wrap with a 300px basis, not a fixed column count: the last row's
          cards grow to fill instead of leaving a hole, which is what makes a
          seven-thread piece look deliberate rather than truncated. */}
      <ul className="flex flex-wrap justify-center gap-2.5 list-none p-0 m-0">
        {order.map((i) => (
          <ThreadRow
            key={pattern.threads[i].num}
            thread={pattern.threads[i]}
            count={pattern.counts[i]}
            surface="card"
            className="flex-[1_1_300px] max-w-[420px]"
          />
        ))}
      </ul>
    </section>
  )
}
