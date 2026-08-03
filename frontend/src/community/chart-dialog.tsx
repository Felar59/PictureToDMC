import { Bobbin } from "@/components/brand/bobbin"
import { ChartPanel } from "@/components/converter/chart-panel"
import { Dialog } from "@/components/ui/dialog"
import type { Pattern } from "@/engine/convert"
import { useI18n } from "@/i18n"

/**
 * "Get the chart", opened from a published piece.
 *
 * Everything about taking the pattern away lives in here — the preview, the
 * options that change it, the download, and the list of threads you would buy.
 * On the page itself all of that was a column beside the picture, which meant
 * the taller it grew the more empty cloth sat under the pattern, and it grew
 * with the number of colours. A dialog has no such neighbour to leave behind.
 *
 * Wide on purpose: ChartPanel splits into preview-and-controls above 44rem of
 * container, so at this size the options read as adjustments to something you
 * can see rather than a list to guess at.
 */
export function ChartDialog({
  open,
  onClose,
  pattern,
  onError,
}: {
  open: boolean
  onClose: () => void
  pattern: Pattern
  onError: (key: string) => void
}) {
  const { t } = useI18n()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t.chart.heading}
      className="max-w-[1040px] @container"
    >
      <div className="flex flex-col gap-6">
        <ChartPanel pattern={pattern} onError={onError} />

        {/* The shopping list belongs with the chart, not with the picture: it is
            the other half of "what do I need to stitch this". Full width under
            both columns so long thread names have room to sit on one line. */}
        <div className="border-t-2 border-dashed border-edge-2 pt-5">
          <h3 className="font-display font-medium text-[17px] m-0 mb-3">
            {t.chart.threads(pattern.threads.length)}
          </h3>
          <ul className="grid gap-2 list-none p-0 m-0 @min-[34rem]:grid-cols-2 @min-[56rem]:grid-cols-3">
            {pattern.threads.map((thread, i) => (
              <li
                key={thread.num}
                className="flex items-center gap-3 bg-linen rounded-chip px-3 py-2"
              >
                <Bobbin hex={thread.hex} width={22} height={30} radius={6} />
                <span className="flex-1 min-w-0">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[13.5px] font-extrabold">DMC {thread.num}</span>
                    <span className="font-mono text-[11.5px] text-cocoa shrink-0">
                      {t.piece.stitches(pattern.counts[i])}
                    </span>
                  </span>
                  <span className="block text-xs text-stone leading-snug break-words">
                    {thread.name}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Dialog>
  )
}
