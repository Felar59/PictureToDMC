import { useEffect, useMemo, useRef } from "react"

import { Tag } from "@/components/ui/pill"
import type { Pattern } from "@/engine/convert"
import { patternImageData } from "@/engine/render"
import { useI18n } from "@/i18n"
import { CARD_ASPECT, PRODUCTS, type ProductMock } from "./products"

/**
 * "See it stitched" — the motif on four things stitchers actually make.
 *
 * The point is emotional, not functional: a chart on screen is a spreadsheet,
 * the same chart on a cushion is a thing you want to own. So this section is
 * deliberately quiet — no coral, no motion, no buttons (the caller owns those),
 * just the motif laid onto each photograph.
 */

/**
 * The motif, drawn one pixel per stitch and enlarged by CSS.
 *
 * Same idiom as the converter canvas: a single putImageData plus
 * `image-rendering: pixelated`, never a grid of divs — a pattern can be
 * thousands of cells and there are four of these on screen at once. Bare
 * stitches stay transparent, so the cloth in the photograph shows through them,
 * which is how it would really look.
 *
 * Sized and placed as a percentage of the photo rather than in pixels, so it
 * tracks the image at every card width without a second measurement.
 */
function Motif({ image, spot }: { image: ImageData | null; spot: ProductMock["spot"] }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !image) return
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext("2d")?.putImageData(image, 0, 0)
  }, [image])

  if (!image) return null

  // The long side gets the allowance and the short side follows, so a portrait
  // pattern never spills past the area the product can carry.
  const portrait = image.height > image.width
  const long = `${spot.w * 100}%`
  const short = `${((spot.w * Math.min(image.width, image.height)) / Math.max(image.width, image.height)) * 100}%`

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        imageRendering: "pixelated",
        position: "absolute",
        left: `${spot.x * 100}%`,
        top: `${spot.y * 100}%`,
        width: portrait ? short : long,
        transform: "translate(-50%, -50%)",
      }}
      className="block"
    />
  )
}

export function ProductPreview({ pattern }: { pattern: Pattern }) {
  const { t } = useI18n()

  // One pass over the grid for all four photographs.
  const image = useMemo(() => patternImageData(pattern), [pattern])

  return (
    <section className="w-full">
      <header className="text-center">
        {/* No heading of its own: the only host is a dialog whose title already
            says "where will it live?", and repeating it would be the second h2
            for one idea. */}
        <div className="font-hand text-[17px] text-quill mb-2">{t.showcase.kicker}</div>
        <p className="text-[16px] leading-[1.6] text-clay mx-auto max-w-[560px] m-0">
          {t.showcase.lead}
        </p>
      </header>

      <ul className="grid grid-cols-2 @min-[46rem]:grid-cols-4 gap-3 sm:gap-4 list-none p-0 mt-7 mb-0">
        {PRODUCTS.map((product, i) => {
          const copy = t.showcase.products[i]
          return (
            <li key={product.key} className="flex flex-col gap-2.5">
              {/* One aspect for all four, reserved up front, so the row keeps its
                  shape while the photographs load and the captions below line up. */}
              <div
                className="relative overflow-hidden rounded-card shadow-soft bg-linen"
                style={{ aspectRatio: String(CARD_ASPECT) }}
              >
                <img
                  src={product.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <Motif image={image} spot={product.spot} />
              </div>

              <div className="text-center flex flex-col items-center gap-1.5 px-1">
                <div className="font-display font-medium text-[16px] sm:text-[17px] text-ink">
                  {copy.name}
                </div>
                <p className="text-[14px] leading-[1.45] text-clay m-0">{copy.tip}</p>
                <Tag className="text-[12.5px] px-3 py-1 mt-0.5">{copy.fabric}</Tag>
              </div>
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
