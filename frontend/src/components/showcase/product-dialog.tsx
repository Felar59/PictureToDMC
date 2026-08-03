import { Dialog } from "@/components/ui/dialog"
import type { Pattern } from "@/engine/convert"
import { useI18n } from "@/i18n"
import { ProductPreview } from "./product-preview"

/**
 * "See it stitched", opened from a published piece.
 *
 * This is inspiration, not information: four mockups nobody needs in order to
 * use the pattern. On the page it took more height than the piece itself and put
 * an h2 next to the title; behind a button it costs nothing until it is asked
 * for, and it gets the room to be four across when it is.
 */
export function ProductDialog({
  open,
  onClose,
  pattern,
}: {
  open: boolean
  onClose: () => void
  pattern: Pattern
}) {
  const { t } = useI18n()

  return (
    <Dialog open={open} onClose={onClose} title={t.showcase.title} className="max-w-[1040px] @container">
      <ProductPreview pattern={pattern} />
    </Dialog>
  )
}
