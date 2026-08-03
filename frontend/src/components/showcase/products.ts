import cushion from "@/assets/products/cushion.avif"
import hoop from "@/assets/products/hoop.avif"
import shirt from "@/assets/products/shirt.avif"
import tote from "@/assets/products/tote.avif"

/**
 * The four things the motif is shown on.
 *
 * Every photograph is shown whole. They were cropped to a square before, which
 * kept the four cards the same height but sliced the tote and the t-shirt down
 * the sides — a mockup with the product cut out of it is worse than one with some
 * empty card around it. The cards are still the same square; the picture sits
 * inside it now rather than filling it.
 *
 * Because nothing is cropped, `spot` is measured against the whole photograph:
 * `x`/`y` are the motif's centre, `w` how wide it may be, `rot` how far it leans.
 * These are the numbers to move when a product wants the motif somewhere else,
 * which is why they are a table rather than markup.
 */
export type ProductMock = {
  /** Matches the order of `t.showcase.products`. */
  key: string
  src: string
  /** Photo width over height, so the card can letterbox it without measuring. */
  aspect: number
  spot: {
    x: number
    y: number
    /** Width at the reference pattern size below. */
    w: number
    /** Degrees, negative leaning left. */
    rot?: number
  }
}

/** The photograph takes this much of the card, leaving it room to sit in. */
export const IMAGE_INSET = 0.94

/**
 * The pattern size `spot.w` is calibrated for.
 *
 * A motif's size on cloth is not a matter of taste: the fabric count is fixed, so
 * twice the stitches is twice the width. A 30-stitch pattern and a 200-stitch one
 * were coming out the same size on the tote, which made the small one look like a
 * poster and the big one like a badge. The displayed width now follows the stitch
 * count from this reference, within the bounds below — bounded because a
 * 12-stitch pattern still has to be visible and a 300-stitch one still has to fit
 * on the bag.
 */
export const REFERENCE_STITCHES = 60
export const SIZE_BOUNDS = { min: 0.5, max: 1.85 }

export const PRODUCTS: ProductMock[] = [
  // Aida in a wooden hoop: the widest field of the four, so the motif can breathe.
  { key: "hoop", src: hoop, aspect: 1, spot: { x: 0.5, y: 0.5, w: 0.46 } },
  // The bag hangs off a shoulder, so the cloth leans and the stitching leans with
  // it. Perfectly square on a carried bag is the thing that reads as pasted on.
  { key: "tote", src: tote, aspect: 900 / 704, spot: { x: 0.5, y: 0.54, w: 0.27, rot: -5 } },
  // A chest motif is small by nature: waste canvas and a few evenings, not a
  // print. Left of centre, because the wearer is.
  { key: "shirt", src: shirt, aspect: 900 / 600, spot: { x: 0.47, y: 0.38, w: 0.135 } },
  { key: "cushion", src: cushion, aspect: 1, spot: { x: 0.5, y: 0.5, w: 0.36 } },
]
