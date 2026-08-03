import { convert, fromWire, type ConvertOptions, type Pattern } from "./convert"
import type { ConvertRequest, ConvertResponse } from "./convert.worker"

/**
 * Front door for the conversion: runs it in a worker, falls back to the main
 * thread if a worker can't be had.
 *
 * One long-lived worker rather than one per conversion — spinning up a module
 * worker means fetching and parsing the engine again, which costs more than the
 * conversion itself. It is created on first use so visiting /convert without
 * converting anything doesn't pay for it.
 */

let worker: Worker | null = null
let workerBroken = false
let nextId = 1
const waiting = new Map<number, (r: ConvertResponse) => void>()

function getWorker(): Worker | null {
  if (workerBroken) return null
  if (worker) return worker
  try {
    worker = new Worker(new URL("./convert.worker.ts", import.meta.url), { type: "module" })
    worker.onmessage = (event: MessageEvent<ConvertResponse>) => {
      waiting.get(event.data.id)?.(event.data)
      waiting.delete(event.data.id)
    }
    // A worker-level error leaves every pending call hanging, so fail them all
    // and never try again this session.
    worker.onerror = () => {
      workerBroken = true
      for (const [id, resolve] of waiting) resolve({ id, ok: false, error: "worker failed" })
      waiting.clear()
      worker?.terminate()
      worker = null
    }
    return worker
  } catch {
    workerBroken = true
    return null
  }
}

export async function runConversion(photo: Blob, opts: ConvertOptions): Promise<Pattern> {
  const w = getWorker()

  // Older Safari has no OffscreenCanvas; the engine needs it either way, so
  // there is nothing to fall back to and the caller gets a clear message.
  if (!w) {
    if (typeof OffscreenCanvas === "undefined") {
      throw new Error("this browser cannot render patterns (no OffscreenCanvas)")
    }
    return convert(photo, opts)
  }

  const id = nextId++
  const request: ConvertRequest = {
    id,
    photo,
    stitchWidth: opts.stitchWidth,
    colorCount: opts.colorCount,
    vividness: opts.vividness,
    removeBackground: opts.removeBackground,
    flipH: opts.flipH,
    flipV: opts.flipV,
    paletteNums: opts.palette?.map((t) => t.num),
  }

  const response = await new Promise<ConvertResponse>((resolve) => {
    waiting.set(id, resolve)
    w.postMessage(request)
  })

  if (!response.ok) {
    // The worker died mid-flight: retry once on this thread rather than telling
    // someone their photo is unsupported when it isn't.
    if (workerBroken && typeof OffscreenCanvas !== "undefined") return convert(photo, opts)
    throw new Error(response.error)
  }

  return fromWire(response.pattern)
}
