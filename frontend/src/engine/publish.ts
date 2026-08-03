import type { Pattern } from "./convert"
import { patternImageData } from "./render"

/**
 * Turning a Pattern into something publishable.
 *
 * The grid travels as one byte per stitch (thread index + 1, 0 meaning empty),
 * base64'd. For a 200-stitch pattern that is 30 KB — small enough to store as a
 * column, and it means the gallery can redraw a piece at any size instead of
 * being stuck with whatever raster the author happened to upload.
 */

export function cellsToBase64(pattern: Pattern): string {
  const bytes = new Uint8Array(pattern.cells.length)
  for (let i = 0; i < pattern.cells.length; i++) {
    // -1 (unstitched) becomes 0; thread 0 becomes 1.
    bytes[i] = pattern.cells[i] < 0 ? 0 : pattern.cells[i] + 1
  }
  let binary = ""
  // In chunks: String.fromCharCode(...30000 args) overflows the call stack.
  const CHUNK = 8192
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(binary)
}

export function base64ToCells(encoded: string, threadCount: number): Int16Array {
  const binary = atob(encoded)
  const cells = new Int16Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    const byte = binary.charCodeAt(i)
    // Anything out of range is treated as empty rather than trusted as an index.
    cells[i] = byte === 0 || byte > threadCount ? -1 : byte - 1
  }
  return cells
}

/** A card-sized PNG of the pattern, for the gallery listing. */
export function patternThumbnail(pattern: Pattern, targetWidth = 360): string {
  const image = patternImageData(pattern)

  // Draw at 1px per stitch, then scale up with smoothing off — the card wants
  // crisp stitches, not a blurred interpolation.
  const scale = Math.max(1, Math.round(targetWidth / pattern.width))
  const canvas = document.createElement("canvas")
  canvas.width = pattern.width * scale
  canvas.height = pattern.height * scale
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas 2d context unavailable")

  const source = document.createElement("canvas")
  source.width = image.width
  source.height = image.height
  source.getContext("2d")?.putImageData(image, 0, 0)

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL("image/png")
}

/** Shrink a chosen hoop photo before it is uploaded. */
export async function preparePhoto(file: Blob, maxEdge = 1400): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas 2d context unavailable")
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, width, height)
  bitmap.close()

  // JPEG at 0.82: a photo of fabric has no hard edges to preserve, and the
  // server caps the upload at 6 MB. Proper AVIF/WebP encoding is a later pass.
  return canvas.toDataURL("image/jpeg", 0.82)
}
