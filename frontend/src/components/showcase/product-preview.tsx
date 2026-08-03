import { useEffect, useRef } from "react"

import { Tag } from "@/components/ui/pill"
import type { Pattern } from "@/engine/convert"
import { useI18n } from "@/i18n"
import {
  IMAGE_INSET,
  PRODUCTS,
  REFERENCE_STITCHES,
  SIZE_BOUNDS,
  type ProductMock,
} from "./products"
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
 * The canvas measures itself and asks the painter for that many device pixels;
 * the painter draws at seven pixels per stitch and resamples down, because at the
 * sizes these cards use a stitch is two pixels across and cannot be drawn.
 *
 * Its width follows the stitch count. `spot.w` is the width for a
 * REFERENCE_STITCHES-wide pattern, and everything else scales from there: the
 * fabric count is fixed in reality, so twice the stitches really is twice the
 * cloth. Bounded at both ends, because a tiny pattern still has to be visible and
 * a huge one still has to fit on the bag.
 *
 * Placed in percentages of the photograph, so it tracks the image at every card
 * width. Bare stitches come out transparent from either renderer, so the cloth in
 * the photograph shows through them.
 */
function Motif({
  painter,
  flatImage,
  spot,
  pattern,
}: {
  painter: StitchPainter | null
  flatImage: ImageData | null
  spot: ProductMock["spot"]
  pattern: Pattern
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

  const long = Math.max(pattern.width, pattern.height)
  const scale = Math.min(
    SIZE_BOUNDS.max,
    Math.max(SIZE_BOUNDS.min, long / REFERENCE_STITCHES),
  )
  // The long side takes the allowance and the short side follows, so a portrait
  // pattern never spills past the area the product can carry.
  const portrait = pattern.height > pattern.width
  const width = spot.w * scale * (portrait ? pattern.width / pattern.height : 1)

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
        transform: `translate(-50%, -50%) rotate(${spot.rot ?? 0}deg)`,
      }}
      className="block"
    />
  )
}

export function ProductPreview({ pattern }: { pattern: Pattern }) {
  const { t } = useI18n()

  // One WebGL context, painting each product at its own size.
  const { painter, flatImage } = useStitchPainter(pattern)

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
              {/* A square slot with the whole photograph inside it, not filling
                  it. object-cover kept the four cards level but cut the tote and
                  the t-shirt down the sides; letterboxing keeps the product whole
                  at the cost of some empty slot. The slot itself is bare and the
                  photograph carries the shadow — a card behind a letterboxed image
                  turns that emptiness into four white slabs, and the row stops
                  reading as four photographs. The motif is positioned against the
                  inner box, so its percentages still refer to the picture. */}
              <div className="relative aspect-square grid place-items-center">
                <div
                  className="relative"
                  style={{
                    aspectRatio: String(product.aspect),
                    width: product.aspect >= 1 ? `${IMAGE_INSET * 100}%` : "auto",
                    height: product.aspect >= 1 ? "auto" : `${IMAGE_INSET * 100}%`,
                    maxWidth: `${IMAGE_INSET * 100}%`,
                    maxHeight: `${IMAGE_INSET * 100}%`,
                  }}
                >
                  <img
                    src={product.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-contain rounded-card shadow-soft"
                  />
                  {/* Clipped to the cloth. The mask spans the photograph exactly,
                      because the inner box is the photograph, so whatever the
                      motif overhangs simply stops at the edge of the object
                      rather than floating over the scenery behind it. */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      WebkitMaskImage: `url(${product.mask})`,
                      WebkitMaskSize: "100% 100%",
                      WebkitMaskRepeat: "no-repeat",
                      maskImage: `url(${product.mask})`,
                      maskSize: "100% 100%",
                      maskRepeat: "no-repeat",
                    }}
                  >
                    <Motif
                      painter={painter}
                      flatImage={flatImage}
                      spot={product.spot}
                      pattern={pattern}
                    />
                  </div>
                </div>
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
