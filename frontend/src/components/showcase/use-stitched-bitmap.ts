import { useEffect, useMemo, useRef, useState } from "react"

import type { Pattern } from "@/engine/convert"
import { patternImageData } from "@/engine/render"
import { createStitchRenderer, loadParams, type StitchRenderer } from "@/engine/stitch-shader"

/**
 * The motif rendered as thread once, for every product to copy.
 *
 * One WebGL context serves all four. It lives on a canvas that is never in the
 * document; each product then copies from it into its own 2D canvas, because a
 * canvas can only be in one place. Four contexts would work — browsers allow
 * about sixteen — but each would compile the same shader and upload the same
 * texture to draw the same picture, four times over, for no difference on screen.
 *
 * The shared render is deliberately larger than any product shows it. The biggest
 * motif in the grid is around 230 CSS pixels and the t-shirt's is nearer 110, so
 * at eight device pixels per stitch every product is downscaling, which is the
 * direction that looks good. Rendering per product at its own size would put the
 * t-shirt at two pixels per stitch, where none of the shading survives.
 *
 * When WebGL2 is missing, `flat` is set and the caller falls back to the chart
 * renderer: the mockups still read, they just look like a chart instead of cloth.
 */

/** Device pixels per stitch in the shared render. */
const RENDER_DETAIL = 8
/** Neither side goes past this, so a 200-stitch pattern cannot ask for 1600px. */
const RENDER_CAP = 1100

export function useStitchedBitmap(pattern: Pattern): {
  /** The shaded motif, or null while it is being prepared or unavailable. */
  source: HTMLCanvasElement | null
  /** Set when the shader could not start; use `flatImage` instead. */
  flat: boolean
  flatImage: ImageData | null
} {
  const image = useMemo(() => patternImageData(pattern), [pattern])
  const [drawn, setDrawn] = useState(0)
  const [flat, setFlat] = useState(false)
  const surfaceRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<StitchRenderer | null>(null)

  useEffect(() => {
    const surface = document.createElement("canvas")
    surfaceRef.current = surface
    try {
      rendererRef.current = createStitchRenderer(surface)
    } catch {
      setFlat(true)
      return
    }
    const renderer = rendererRef.current
    return () => {
      renderer?.dispose()
      rendererRef.current = null
      surfaceRef.current = null
    }
  }, [])

  useEffect(() => {
    const renderer = rendererRef.current
    const surface = surfaceRef.current
    if (!renderer || !surface) return

    const scale = Math.min(RENDER_DETAIL, RENDER_CAP / Math.max(image.width, image.height))
    const width = Math.max(16, Math.round(image.width * scale))
    const height = Math.max(16, Math.round(image.height * scale))
    surface.width = width
    surface.height = height

    // Read the tuned set at draw time rather than at module load, so a pass
    // through /atelier shows up here on the next visit without a rebuild.
    renderer.render(image, loadParams(), 1, true, { width, height })
    setDrawn((n) => n + 1)
  }, [image])

  return {
    source: flat || drawn === 0 ? null : surfaceRef.current,
    flat,
    flatImage: flat ? image : null,
  }
}
