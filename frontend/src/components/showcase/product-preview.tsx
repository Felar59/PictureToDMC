import { useEffect, useMemo, useRef } from "react"

import { Tag } from "@/components/ui/pill"
import type { Pattern } from "@/engine/convert"
import { patternImageData } from "@/engine/render"
import { useI18n } from "@/i18n"
import { MOCK_STAGE, PRODUCTS } from "./products"

/**
 * "See it stitched" — the finished pattern mocked onto four things stitchers
 * actually make.
 *
 * The point is emotional, not functional: a chart on screen is a spreadsheet,
 * the same chart on a cushion is a thing you want to own. So this section is
 * deliberately quiet — no coral, no motion, no buttons (the caller owns those),
 * just the motif shown four ways with the fabric each product needs.
 */

/**
 * The motif, drawn one pixel per stitch and enlarged by CSS.
 *
 * Same idiom as the converter canvas: a single putImageData plus
 * `image-rendering: pixelated`, never a grid of divs — a pattern can be
 * thousands of cells, and there are four of these on screen at once. Bare
 * stitches stay transparent, so the mockup's fabric shows through, which is
 * how it would really look.
 */
function Motif({ image, footprint }: { image: ImageData | null; footprint: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !image) return
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext("2d")?.putImageData(image, 0, 0)
  }, [image])

  if (!image) return null

  // The design's per-product cell sizes were tuned for an 11x11 heart. A real
  // pattern is any shape, so what we honour is the footprint: fit the long side
  // to it and let the short side follow, so the motif never grows past the
  // shell's inner area whatever its aspect.
  const scale = footprint / Math.max(image.width, image.height)
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  return (
    <canvas
      ref={ref}
      style={{ imageRendering: "pixelated", width, height }}
      className="block shrink-0"
    />
  )
}

export function ProductPreview({
  pattern,
  kicker,
}: {
  pattern: Pattern
  /** The converter's default announces a fresh result ("your pattern is ready");
   *  on someone else's published piece nothing has just happened, so that page
   *  passes its own line. */
  kicker?: string
}) {
  const { t } = useI18n()

  // One pass over the grid for all four mockups.
  const image = useMemo(() => patternImageData(pattern), [pattern])

  return (
    <section className="w-full">
      <header className="text-center">
        <div className="font-hand text-[17px] text-quill">{kicker ?? t.showcase.kicker}</div>
        <h2 className="text-[26px] sm:text-[30px] lg:text-[32px] mt-1.5 mb-3 tracking-[-.4px]">
          {t.showcase.title}
        </h2>
        <p className="text-[16px] leading-[1.6] text-clay mx-auto max-w-[560px] m-0">
          {t.showcase.lead}
        </p>
      </header>

      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 list-none p-0 mt-7 mb-0">
        {PRODUCTS.map((product, i) => {
          const copy = t.showcase.products[i]
          return (
            <li
              key={product.key}
              style={{ background: product.bg }}
              className="rounded-card shadow-soft px-3 sm:px-5 py-5 flex flex-col items-center text-center gap-2"
            >
              {/* The shells are drawn at fixed design sizes, so the whole stage
                  is scaled to fit the column instead of each shell being made
                  responsive. lg is tighter than sm because that is where two
                  columns become four. */}
              <div
                aria-hidden="true"
                className="[--mock-scale:.72] sm:[--mock-scale:.9] lg:[--mock-scale:.85] xl:[--mock-scale:1]"
                style={{
                  width: `calc(${MOCK_STAGE}px * var(--mock-scale))`,
                  height: `calc(${MOCK_STAGE}px * var(--mock-scale))`,
                }}
              >
                <div
                  className="flex items-center justify-center origin-top-left"
                  style={{
                    width: MOCK_STAGE,
                    height: MOCK_STAGE,
                    transform: "scale(var(--mock-scale))",
                  }}
                >
                  <product.Mock>
                    <Motif image={image} footprint={product.footprint} />
                  </product.Mock>
                </div>
              </div>

              <div className="font-display font-medium text-[16px] sm:text-[17px] text-ink">
                {copy.name}
              </div>
              <p className="text-[14px] leading-[1.5] text-clay m-0">{copy.tip}</p>
              <Tag className="bg-blanc/75 text-[12.5px] px-3 py-1.5 mt-auto">{copy.fabric}</Tag>
            </li>
          )
        })}
      </ul>

      <p className="font-hand text-sm text-sand text-center mt-5 mb-0">
        {t.showcase.skeins(pattern.threads.length)}
      </p>
    </section>
  )
}
