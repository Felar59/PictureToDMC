/**
 * Cutting the subject out of a photograph.
 *
 * The previous version flood-filled inward from the borders and walked small
 * steps in colour. That cannot work in general, and the three photographs that
 * broke it show why: a dahlia against foliage has a background of many colours,
 * so the fill stopped at every leaf and left green patches; a dog with a bright
 * rim light had an edge colour the border never sampled, so it survived and got
 * quantised into blue thread; a dog lying on grass touched all four borders in
 * fur the same tone as the grass, so the fill walked straight into the animal.
 * All three are the same thing — the algorithm knows adjacency of colour and has
 * no notion of an object. No tuning fixes that.
 *
 * So this asks a network that does. u2netp is the small U²-Net, 4.4 MB, the model
 * `rembg` uses by default and the same family behind remove.bg. It runs here, in
 * the browser, on the same principle as the rest of the pipeline: the server does
 * no image work at all.
 *
 * Both the model and the runtime are fetched on first use and never otherwise, so
 * nobody who leaves the box unticked pays for them.
 */

/** What the network was trained at. Anything else and the mask is nonsense. */
const SIDE = 320
const MEAN = [0.485, 0.456, 0.406]
const STD = [0.229, 0.224, 0.225]

type Session = {
  run(feeds: Record<string, unknown>): Promise<Record<string, { data: Float32Array }>>
  inputNames: readonly string[]
  outputNames: readonly string[]
}

let sessionPromise: Promise<{ session: Session; Tensor: TensorCtor }> | null = null
type TensorCtor = new (type: "float32", data: Float32Array, dims: number[]) => unknown

/**
 * The session, made once and shared.
 *
 * Loaded through a dynamic import so the runtime lands in its own chunk: the
 * converter must not carry it, and nor must any other page.
 */
function loadSession() {
  sessionPromise ??= (async () => {
    const [ort, wasmUrl, mjsUrl] = await Promise.all([
      import("onnxruntime-web/wasm"),
      import("onnxruntime-web/ort-wasm-simd-threaded.wasm?url").then((m) => m.default),
      import("onnxruntime-web/ort-wasm-simd-threaded.mjs?url").then((m) => m.default),
    ])
    // A plain path, not an import: the weights live in public/ and are fetched by
    // the runtime itself. Importing them would push 4.4 MB through the JS graph for
    // no reason, and an absolute specifier is not a module Vite can resolve.
    const modelUrl = `${import.meta.env.BASE_URL}models/u2netp.onnx`

    // One thread: several would need SharedArrayBuffer, which needs the page to be
    // cross-origin isolated, which would cost every other thing on it. A single
    // thread runs this model in well under a second on a desktop.
    ort.env.wasm.numThreads = 1
    ort.env.wasm.wasmPaths = { wasm: wasmUrl, mjs: mjsUrl }

    const session = (await ort.InferenceSession.create(modelUrl, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    })) as unknown as Session
    return { session, Tensor: ort.Tensor as unknown as TensorCtor }
  })()
  return sessionPromise
}

/** Whether a cut-out can be attempted at all. */
export function cutoutSupported(): boolean {
  return typeof WebAssembly === "object" && typeof OffscreenCanvas === "function"
}

/**
 * The subject's alpha, as a SIDE x SIDE map of 0..1.
 *
 * Returned at the network's own resolution rather than the photo's: the caller
 * wants it at the stitch grid's resolution, which is smaller than both, so
 * blowing it up to the photograph first would only be work thrown away.
 */
export async function cutoutMask(source: Blob): Promise<Float32Array> {
  const { session, Tensor } = await loadSession()

  // Squashed to the square, not cropped — rembg does the same, and a crop would
  // throw away whatever falls outside it.
  // EXIF orientation is stated, not assumed. A DOM <img> applies a photograph's
  // orientation tag; createImageBitmap's default for it has moved with the spec and
  // is not worth relying on. If the two disagree the grid comes out turned
  // differently from the photograph shown next to it — which would quietly break the
  // orientation tiles, since those are <img> elements showing this same file. Saying
  // it explicitly makes both paths agree, and costs nothing where it was already the
  // default.
  const bitmap = await createImageBitmap(source, { imageOrientation: "from-image" })
  const canvas = new OffscreenCanvas(SIDE, SIDE)
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) {
    bitmap.close()
    throw new Error("canvas 2d context unavailable")
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, SIDE, SIDE)
  bitmap.close()
  const pixels = ctx.getImageData(0, 0, SIDE, SIDE).data

  // NCHW, one plane per channel, normalised the way the training set was.
  const input = new Float32Array(3 * SIDE * SIDE)
  const plane = SIDE * SIDE
  for (let p = 0; p < plane; p++) {
    input[p] = (pixels[p * 4] / 255 - MEAN[0]) / STD[0]
    input[plane + p] = (pixels[p * 4 + 1] / 255 - MEAN[1]) / STD[1]
    input[plane * 2 + p] = (pixels[p * 4 + 2] / 255 - MEAN[2]) / STD[2]
  }

  const out = await session.run({
    [session.inputNames[0]]: new Tensor("float32", input, [1, 3, SIDE, SIDE]),
  })
  // u2net emits a stack of side outputs at decreasing depth; the first is the
  // fused one and the only one worth having.
  const pred = out[session.outputNames[0]].data

  // The raw map is unbounded, so it is stretched to 0..1 over its own range —
  // which is what rembg does, and what makes a faint subject usable.
  let lo = Infinity
  let hi = -Infinity
  for (let i = 0; i < plane; i++) {
    if (pred[i] < lo) lo = pred[i]
    if (pred[i] > hi) hi = pred[i]
  }
  const span = Math.max(1e-6, hi - lo)

  const mask = new Float32Array(plane)
  for (let i = 0; i < plane; i++) mask[i] = (pred[i] - lo) / span
  return mask
}

/**
 * Applies a SIDE x SIDE mask to a stitch grid, in place.
 *
 * Each cell takes the average of the mask over its own footprint rather than a
 * single sample: a cell covers several mask pixels, and averaging is what keeps
 * the silhouette from going jagged as the grid gets coarse. The flips are applied
 * here rather than by running the network twice — the mask is symmetric to them
 * in exactly the way the sampling is.
 */
export function applyCutout(
  alpha: Uint8Array,
  width: number,
  height: number,
  mask: Float32Array,
  opts: { flipH?: boolean; flipV?: boolean; rotation?: number; threshold?: number } = {},
): void {
  const threshold = opts.threshold ?? 0.5
  const rotation = opts.rotation ?? 0
  // At a quarter turn the grid's rows run down the mask's columns, so a row of
  // stitches spans mask *columns* and the two ranges trade places.
  const turned = rotation === 90 || rotation === 270

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      if (alpha[i] === 0) continue

      // The cell's own footprint, as a fraction of the grid.
      const u0 = x / width
      const u1 = (x + 1) / width
      const v0 = y / height
      const v1 = (y + 1) / height

      // Undo the turn: where on the *file* does this cell come from? Rotating the
      // picture clockwise by 90 sends source (su,sv) to grid (1-sv, su), so the
      // inverse is su = v, sv = 1-u — and likewise round the other three.
      let a0: number
      let a1: number
      let b0: number
      let b1: number
      if (rotation === 90) {
        a0 = v0
        a1 = v1
        b0 = 1 - u1
        b1 = 1 - u0
      } else if (rotation === 180) {
        a0 = 1 - u1
        a1 = 1 - u0
        b0 = 1 - v1
        b1 = 1 - v0
      } else if (rotation === 270) {
        a0 = 1 - v1
        a1 = 1 - v0
        b0 = u0
        b1 = u1
      } else {
        a0 = u0
        a1 = u1
        b0 = v0
        b1 = v1
      }

      // The mirrors are applied in the grid's frame, after the turn, so they act on
      // whichever source axis now runs across the picture.
      if (opts.flipH) {
        const lo = turned ? 1 - b1 : 1 - a1
        const hi = turned ? 1 - b0 : 1 - a0
        if (turned) {
          b0 = lo
          b1 = hi
        } else {
          a0 = lo
          a1 = hi
        }
      }
      if (opts.flipV) {
        const lo = turned ? 1 - a1 : 1 - b1
        const hi = turned ? 1 - a0 : 1 - b0
        if (turned) {
          a0 = lo
          a1 = hi
        } else {
          b0 = lo
          b1 = hi
        }
      }

      const x0 = Math.floor(a0 * SIDE)
      const x1 = Math.max(x0 + 1, Math.floor(a1 * SIDE))
      const y0 = Math.floor(b0 * SIDE)
      const y1 = Math.max(y0 + 1, Math.floor(b1 * SIDE))

      let sum = 0
      let n = 0
      for (let my = y0; my < y1 && my < SIDE; my++) {
        for (let mx = x0; mx < x1 && mx < SIDE; mx++) {
          sum += mask[my * SIDE + mx]
          n++
        }
      }
      if (n > 0 && sum / n < threshold) alpha[i] = 0
    }
  }
}
