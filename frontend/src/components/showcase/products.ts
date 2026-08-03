import cushion from "@/assets/products/cushion.avif"
import hoop from "@/assets/products/hoop.avif"
import shirt from "@/assets/products/shirt.avif"
import tote from "@/assets/products/tote.avif"

/**
 * The four things the motif is shown on.
 *
 * Real photographs now, in place of the CSS shells that stood in for them. The
 * shells came from the design document and were always meant to be temporary —
 * a mockup made of border-radius reads as a diagram, and the point of this
 * section is to make someone want the object.
 *
 * `spot` is where the motif lands, in fractions of the image box: `x`/`y` are its
 * centre, `w` how wide it may be. All four are centred for now; these are the
 * numbers to move if a product wants the motif elsewhere, which is why they sit
 * in a table rather than buried in markup.
 */
export type ProductMock = {
  /** Matches the order of `t.showcase.products`. */
  key: string
  src: string
  spot: { x: number; y: number; w: number }
}

/**
 * Every card is a square, and the photographs are cropped to it.
 *
 * The three source aspects (1:1, 1.28:1, 1.5:1) gave four cards of four heights,
 * so the names and the fabric chips landed at four different lines and the row
 * read as a mistake. One shape costs some scenery at the edges of the two
 * landscape shots — which is scenery, not product — and buys a row that lines up.
 */
export const CARD_ASPECT = 1

export const PRODUCTS: ProductMock[] = [
  // Aida in a wooden hoop: the widest field of the four, so the motif can breathe.
  { key: "hoop", src: hoop, spot: { x: 0.5, y: 0.5, w: 0.46 } },
  // The bag face fills the middle of the frame.
  { key: "tote", src: tote, spot: { x: 0.5, y: 0.52, w: 0.34 } },
  // A chest motif is small by nature — waste canvas and a few evenings, not a print.
  { key: "shirt", src: shirt, spot: { x: 0.5, y: 0.44, w: 0.2 } },
  { key: "cushion", src: cushion, spot: { x: 0.5, y: 0.5, w: 0.36 } },
]
