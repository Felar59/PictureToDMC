import type { ReactElement } from "react"

import {
  CushionMock,
  HoopMock,
  ShirtMock,
  ToteMock,
  type MockProps,
} from "./product-mockups"

/**
 * The product table the preview grid maps over, kept apart from the shells it
 * names only because fast refresh requires a component file to export nothing
 * but components. Everything about "which products, in what order, on what
 * background" is decided here; ./product-mockups just draws.
 */

export type ProductMock = {
  /** Matches the order of `t.showcase.products`. */
  key: string
  /** Card background — each product sits on its own warm tint. */
  bg: string
  Mock: (props: MockProps) => ReactElement
  /**
   * Side of the square the motif must fit inside, in px. The design drew an
   * 11-column heart at a fixed cell size; a real pattern is any shape, so what
   * carries over is the footprint (11 x cell), not the cell.
   */
  footprint: number
}

/** Design-space side of the box a mockup is drawn in. The stage is square and
 *  every shell fits inside it, negative offsets (hoop screw, tote handle,
 *  sleeves) included, so the grid scales one box instead of four. */
export const MOCK_STAGE = 180

/** Data-driven like the design source. The copy for cell i comes from
 *  `t.showcase.products[i]`, so the order is load-bearing. */
export const PRODUCTS: ProductMock[] = [
  { key: "hoop", bg: "#EFE6D4", Mock: HoopMock, footprint: 77 },
  { key: "tote", bg: "#F3EADA", Mock: ToteMock, footprint: 60 },
  { key: "shirt", bg: "#EDE8DC", Mock: ShirtMock, footprint: 50 },
  { key: "cushion", bg: "#F1E9D8", Mock: CushionMock, footprint: 77 },
]
