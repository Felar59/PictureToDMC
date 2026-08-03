import { useEffect, useMemo, useRef, useState } from "react"

import type { Pattern } from "@/engine/convert"
import { patternImageData } from "@/engine/render"
import { createStitchRenderer, loadParams, type StitchRenderer } from "@/engine/stitch-shader"

/**
 * Paints the motif as thread, at whatever size is asked for.
 *
 * One WebGL context serves every product. It lives on a canvas that is never in
 * the document; a caller hands over its own visible 2D canvas and the size it
 * needs, and gets that size drawn into it. Four contexts would work — browsers
 * allow about sixteen — but each would compile the same shader to draw the same
 * picture.
 *
 * Each product is painted at *its own* size rather than sharing one large render.
 * That matters more than it sounds: a single 416px render shrunk into the
 * t-shirt's 110px box is a four-fold bilinear reduction of a picture made almost
 * entirely of one-pixel highlights, and it comes out looking like a bad JPEG. At
 * its own size nothing is resampled, and the shader's own level-of-detail fade
 * takes over — below about six pixels per stitch it drops the ply, the fibres,
 * the speculars and the jitter, because at that size they land on single pixels
 * and read as dirt rather than as floss.
 *
 * When WebGL2 is missing, `flatImage` is set instead and callers draw the chart.
 */
export type StitchPainter = {
  /** Draws into `target`, sized to `deviceWidth` and the pattern's aspect. */
  paint(target: HTMLCanvasElement, deviceWidth: number): void
  /** Bumped whenever the painter's output would change, to retrigger callers. */
  revision: number
}

/** Above this there is nothing left to gain, and a lot of pixels to pay for. */
const MAX_DEVICE_WIDTH = 1400
/**
 * Device pixels per stitch the shader is drawn at, whatever size it is shown at.
 *
 * This is the number everything hinges on. A product mockup in a four-up grid
 * gives the motif about a hundred pixels, which for a 52-stitch pattern is two
 * pixels per stitch — and at two pixels a stitch cannot be drawn: one screen
 * pixel is wider than the cell, so the antialiasing that keeps the legs smooth
 * covers the whole thing and the result is a pale smear. Asking a per-fragment
 * distance field to do a mip-map's job never works.
 *
 * So the motif is always drawn at seven pixels per stitch, where the geometry has
 * room, and then resampled down to the size it is shown at by an actual image
 * resampler. That is a photograph of embroidery, shrunk — which is exactly the
 * thing being imitated.
 */
const DRAW_PX_PER_STITCH = 7

export function useStitchPainter(pattern: Pattern): {
  painter: StitchPainter | null
  flatImage: ImageData | null
} {
  const image = useMemo(() => patternImageData(pattern), [pattern])
  const [flat, setFlat] = useState(false)
  const [revision, setRevision] = useState(0)
  const surfaceRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<StitchRenderer | null>(null)

  useEffect(() => {
    const surface = document.createElement("canvas")
    surfaceRef.current = surface
    try {
      rendererRef.current = createStitchRenderer(surface)
      setRevision((n) => n + 1)
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

  // A new pattern is new output, so callers repaint.
  useEffect(() => setRevision((n) => n + 1), [image])

  const painter = useMemo<StitchPainter | null>(() => {
    if (flat) return null
    return {
      revision,
      paint(target, deviceWidth) {
        const renderer = rendererRef.current
        const surface = surfaceRef.current
        if (!renderer || !surface) return

        const shown = Math.max(16, Math.min(Math.round(deviceWidth), MAX_DEVICE_WIDTH))
        // Drawn at a size the geometry fits in, never at the size it is shown.
        const drawn = Math.min(
          MAX_DEVICE_WIDTH,
          Math.max(shown, Math.round(image.width * DRAW_PX_PER_STITCH)),
        )
        const drawnH = Math.max(16, Math.round((drawn * image.height) / image.width))
        surface.width = drawn
        surface.height = drawnH

        // Read the tuned set at paint time, so a pass through /atelier shows up
        // here without a rebuild.
        renderer.render(image, loadParams(), 1, true, { width: drawn, height: drawnH })

        const shownH = Math.max(16, Math.round((shown * image.height) / image.width))
        target.width = shown
        target.height = shownH
        const ctx = target.getContext("2d")
        if (!ctx) return
        ctx.clearRect(0, 0, shown, shownH)

        if (drawn <= shown * 2) {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = "high"
          ctx.drawImage(surface, 0, 0, shown, shownH)
          return
        }
        // More than a two-fold reduction, so halve repeatedly. One bilinear step
        // from 7 pixels per stitch down to 2 samples a quarter of the pixels and
        // throws the rest away, which is what made this look like a bad JPEG.
        let stepW = drawn
        let stepH = drawnH
        let from: HTMLCanvasElement = surface
        while (stepW > shown * 2) {
          const nextW = Math.max(shown, Math.round(stepW / 2))
          const nextH = Math.max(shownH, Math.round(stepH / 2))
          const buffer = document.createElement("canvas")
          buffer.width = nextW
          buffer.height = nextH
          const bctx = buffer.getContext("2d")
          if (!bctx) break
          bctx.imageSmoothingEnabled = true
          bctx.imageSmoothingQuality = "high"
          bctx.drawImage(from, 0, 0, nextW, nextH)
          from = buffer
          stepW = nextW
          stepH = nextH
        }
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(from, 0, 0, shown, shownH)
      },
    }
    // `revision` is what callers watch; the paint body reads through refs.
  }, [flat, revision, image])

  return { painter, flatImage: flat ? image : null }
}
