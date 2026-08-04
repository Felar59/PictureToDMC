/// <reference lib="webworker" />
import { convert, toWire, type PatternWire } from "./convert"
import { findThread, type Thread } from "./dmc"

/**
 * The conversion, off the main thread.
 *
 * At 38 ms a blocked main thread is invisible, but the worst case — 200
 * stitches across at 20 threads — is 152 ms of straight-line JS, and that is
 * long enough to freeze the sliders and drop the shimmer animation mid-frame.
 * Here the UI keeps painting while k-means runs.
 *
 * The worker imports the same engine the main thread does; nothing is
 * duplicated. It only needs `createImageBitmap` and `OffscreenCanvas`, both of
 * which exist in a worker scope.
 */

export type ConvertRequest = {
  id: number
  photo: Blob
  stitchWidth: number
  colorCount: number
  vividness?: number
  removeBackground?: boolean
  flipH?: boolean
  flipV?: boolean
  /** Quarter turns clockwise. */
  rotation?: number
  /** DMC references, not Thread objects — the worker resolves them locally. */
  paletteNums?: string[]
}

export type ConvertResponse =
  | { id: number; ok: true; pattern: PatternWire }
  | { id: number; ok: false; error: string }

self.onmessage = async (event: MessageEvent<ConvertRequest>) => {
  const {
    id,
    photo,
    stitchWidth,
    colorCount,
    paletteNums,
    vividness,
    removeBackground,
    flipH,
    flipV,
    rotation,
  } = event.data
  try {
    const palette = paletteNums
      ? paletteNums.map(findThread).filter((t): t is Thread => Boolean(t))
      : undefined

    const pattern = await convert(photo, {
      stitchWidth,
      colorCount,
      palette,
      vividness,
      removeBackground,
      flipH,
      flipV,
      rotation,
    })
    const wire = toWire(pattern)

    // Hand the grid over rather than copying it: 30 000 cells is 60 KB, and
    // the worker has no use for it afterwards.
    ;(self as unknown as Worker).postMessage({ id, ok: true, pattern: wire } satisfies ConvertResponse, [
      wire.cells.buffer,
    ])
  } catch (err) {
    ;(self as unknown as Worker).postMessage({
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    } satisfies ConvertResponse)
  }
}
