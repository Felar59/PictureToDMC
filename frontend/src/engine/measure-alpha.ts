/**
 * How much of the picture is opaque.
 *
 * Sampled at 64px rather than full size: the ratio is what matters and it is
 * scale-invariant, so there is no reason to pull 48 MB of pixels through JS to
 * find it. JPEGs have no alpha channel at all and short-circuit to 1.
 */
export function measureAlpha(
  img: HTMLImageElement,
  width: number,
  height: number,
): { hasAlpha: boolean; opaqueRatio: number } {
  if (!width || !height) return { hasAlpha: false, opaqueRatio: 1 }
  try {
    const w = Math.max(1, Math.min(64, width))
    const h = Math.max(1, Math.round((w * height) / width))
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return { hasAlpha: false, opaqueRatio: 1 }
    ctx.drawImage(img, 0, 0, w, h)
    const { data } = ctx.getImageData(0, 0, w, h)
    let opaque = 0
    // Same threshold the engine uses, so the estimate and the result agree.
    for (let i = 3; i < data.length; i += 4) if (data[i] >= 150) opaque++
    const total = w * h
    const ratio = total ? opaque / total : 1
    return { hasAlpha: ratio < 0.999, opaqueRatio: ratio }
  } catch {
    // Tainted canvas or an exotic decoder: assume fully opaque rather than
    // refusing the photo.
    return { hasAlpha: false, opaqueRatio: 1 }
  }
}
