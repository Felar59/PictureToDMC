import { useEffect, useRef } from "react"

import { Tag } from "@/components/ui/pill"
import type { Pattern } from "@/engine/convert"
import { useI18n } from "@/i18n"
import { CARD_ASPECT, PRODUCTS, type ProductMock } from "./products"
import { useStitchPainter, type StitchPainter } from "./use-stitch-painter"

/**
 * "See it stitched" — the motif on four things stitchers actually make.
 *
 * The point is emotional, not functional: a chart on screen is a spreadsheet,
 * the same chart on a cushion is a thing you want to own. So this section is
 * deliberately quiet — no coral, no motion, no buttons (the caller owns those),
 * just the motif laid onto each photograph.
 */

/**
 * One product's motif, painted at the size it is actually shown.
 *
 * The canvas measures itself and asks the painter for exactly that many device
 * pixels, so nothing is resampled — the previous version shared one large render
 * across all four, and shrinking a picture made of one-pixel highlights by four
 * times looks like a compression artefact rather than like thread.
 *
 * Sized and placed as a percentage of the photograph, so it tracks the image at
 * every card width. Bare stitches come out transparent from either renderer, so
 * the cloth in the photograph shows through them.
 */
function Motif({
  painter,
  flatImage,
  spot,
  ratio,
}: {
  painter: StitchPainter | null
  flatImage: ImageData | null
  spot: ProductMock["spot"]
  /** Pattern width over height. */
  ratio: number
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    if (flatImage) {
      canvas.width = flatImage.width
      canvas.height = flatImage.height
      canvas.getContext("2d")?.putImageData(flatImage, 0, 0)
      return
    }
    if (!painter) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const paint = () => {
      const css = canvas.clientWidth
      if (css > 0) painter.paint(canvas, css * dpr)
    }
    paint()
    // The card is fluid, so the right size is only known once it is laid out.
    const observer = new ResizeObserver(paint)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [painter, flatImage])

  if (!painter && !flatImage) return null

  // The long side takes the allowance and the short side follows, so a portrait
  // pattern never spills past the area the product can carry.
  const portrait = ratio < 1
  const width = portrait ? spot.w * ratio : spot.w

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        // Only the flat fallback wants hard pixel edges. The shaded render is
        // drawn at its display size, so it needs no scaling at all.
        imageRendering: flatImage ? "pixelated" : "auto",
        position: "absolute",
        left: `${spot.x * 100}%`,
        top: `${spot.y * 100}%`,
        width: `${width * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
      className="block"
    />
  )
}

export function ProductPreview({ pattern }: { pattern: Pattern }) {
  const { t } = useI18n()

  // One WebGL context, painting each product at its own size.
  const { painter, flatImage } = useStitchPainter(pattern)
  const ratio = pattern.width / pattern.height

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
                <Motif
                  painter={painter}
                  flatImage={flatImage}
                  spot={product.spot}
                  ratio={ratio}
                />
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
