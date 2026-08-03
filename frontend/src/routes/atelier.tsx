import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

import type { Pattern } from "@/engine/convert"
import { findThread, type Thread } from "@/engine/dmc"
import { base64ToCells } from "@/engine/publish"
import { patternImageData } from "@/engine/render"
import {
  DEFAULT_PARAMS,
  PARAM_GROUPS,
  clearSavedParams,
  createStitchRenderer,
  loadParams,
  saveParams,
  type StitchParams,
  type StitchRenderer,
} from "@/engine/stitch-shader"
import { PRODUCTS } from "@/components/showcase/products"
import * as api from "@/lib/community"

/**
 * The bench for the fabric shader.
 *
 * Not a page of the site: no header copy, no polish, no link to it. It exists so
 * the numbers in `DEFAULT_PARAMS` can be found by moving them and looking, which
 * is the only way anyone finds them. Drag a slider, watch the cloth, and when it
 * looks right press "copier les réglages" and paste what comes out — that becomes
 * the permanent set.
 *
 * Two things can be chosen independently, because tuning needs both. The
 * *pattern* is either a built-in sampler — deliberately awkward: single stitches,
 * long runs, a hard edge, a pale thread against a dark one, the four cases a
 * fabric shader gets wrong — or a published piece via `?piece=2`. The *surface*
 * is either the shader's own cloth, where the geometry is easiest to read, or one
 * of the real product photographs, which is the only place you can tell whether
 * a setting looks right where it will actually be used.
 *
 * On a photograph the shader stops drawing cloth: the fabric in the picture is
 * the fabric, and all it adds is thread and the shadow the thread casts.
 */

/** A test card, not a picture: every case that breaks a stitch renderer. */
function samplerPattern(): Pattern {
  const codes = ["347", "3712", "760", "3713", "B5200", "3363", "310"]
  const threads = codes.map((c) => findThread(c)).filter((t): t is Thread => Boolean(t))
  const W = 28
  const H = 22
  const cells = new Int16Array(W * H).fill(-1)
  const set = (x: number, y: number, t: number) => {
    if (x >= 0 && y >= 0 && x < W && y < H) cells[y * W + x] = t
  }

  // A solid block, so runs and interiors can be judged.
  for (let y = 2; y < 9; y++) for (let x = 2; x < 11; x++) set(x, y, 0)
  // A shaded ramp beside it: five threads, one column each.
  for (let y = 2; y < 9; y++) for (let x = 0; x < 5; x++) set(13 + x, y, x)
  // Scattered single stitches — the case that reads as noise when it goes wrong.
  for (let i = 0; i < 14; i++) set(2 + ((i * 7) % 24), 11 + ((i * 5) % 3), i % 2 === 0 ? 4 : 6)
  // A diagonal, for the aliasing.
  for (let i = 0; i < 12; i++) set(3 + i, 15 + (i % 2), 5)
  // Pale against dark, touching: the hardest pair to keep apart.
  for (let y = 18; y < 21; y++) for (let x = 2; x < 8; x++) set(x, y, 4)
  for (let y = 18; y < 21; y++) for (let x = 8; x < 14; x++) set(x, y, 6)

  const counts = new Array<number>(threads.length).fill(0)
  let stitched = 0
  for (const c of cells) {
    if (c < 0) continue
    counts[c]++
    stitched++
  }
  return { width: W, height: H, cells, threads, counts, stitched }
}

/** Button labels, in the order the selector shows them: cloth, then PRODUCTS. */
const SURFACES = ["toile seule", "tambour", "tote bag", "t-shirt", "coussin"]

function hexToRgb01(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
function rgb01ToHex([r, g, b]: [number, number, number]): string {
  const to = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * 255)))
      .toString(16)
      .padStart(2, "0")
  return `#${to(r)}${to(g)}${to(b)}`
}

export default function Atelier() {
  const [search] = useSearchParams()
  const pieceId = search.get("piece")

  // Picks up where the last session left off, and every change is written back:
  // the product previews on the real pages read the same set, so a setting can be
  // judged where it will actually be used rather than only on this bench.
  const [params, setParams] = useState<StitchParams>(() => loadParams())

  useEffect(() => {
    saveParams(params)
  }, [params])
  const [zoom, setZoom] = useState(1)
  // -1 is the shader's own cloth; 0..3 index PRODUCTS.
  const [surface, setSurface] = useState(0)
  const onPhoto = surface >= 0
  const [pattern, setPattern] = useState<Pattern>(() => samplerPattern())
  const [note, setNote] = useState<string>("échantillon de test")
  const [error, setError] = useState<string | null>(null)
  const [dump, setDump] = useState<string | null>(null)

  // Optionally render a real published piece instead of the sampler.
  useEffect(() => {
    if (!pieceId) return
    let cancelled = false
    api
      .fetchPost(Number(pieceId))
      .then((post) => {
        if (cancelled) return
        const threads: Thread[] = []
        const remap = post.threadCodes.map((code) => {
          const thread = findThread(code)
          return thread ? threads.push(thread) - 1 : -1
        })
        const stored = base64ToCells(post.cells, post.threadCodes.length)
        const cells = new Int16Array(stored.length)
        const counts = new Array<number>(threads.length).fill(0)
        let stitched = 0
        for (let i = 0; i < stored.length; i++) {
          const t = stored[i] < 0 ? -1 : remap[stored[i]]
          cells[i] = t
          if (t < 0) continue
          counts[t]++
          stitched++
        }
        setPattern({ width: post.width, height: post.height, cells, threads, counts, stitched })
        setNote(`${post.title} — ${post.width}×${post.height}`)
      })
      .catch(() => !cancelled && setNote("pièce introuvable, échantillon affiché"))
    return () => {
      cancelled = true
    }
  }, [pieceId])

  const image = useMemo(() => patternImageData(pattern), [pattern])

  // ---- the shaded canvas
  const glRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<StitchRenderer | null>(null)

  // Keyed on which branch is mounted: the two layouts render different canvas
  // elements, and a context bound to a detached one silently draws nothing.
  useEffect(() => {
    const canvas = glRef.current
    if (!canvas) return
    try {
      rendererRef.current = createStitchRenderer(canvas)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "WebGL2 indisponible")
      return
    }
    const renderer = rendererRef.current
    return () => {
      renderer?.dispose()
      rendererRef.current = null
    }
  }, [onPhoto])

  // Redraw on any change, and whenever the canvas is resized.
  useEffect(() => {
    const draw = () => rendererRef.current?.render(image, params, onPhoto ? 1 : zoom, onPhoto)
    draw()
    const canvas = glRef.current
    if (!canvas) return
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [image, params, zoom, onPhoto])

  // ---- the flat renderer, side by side, because "better" needs a reference
  const flatRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = flatRef.current
    if (!canvas) return
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext("2d")?.putImageData(image, 0, 0)
  }, [image])

  const set = <K extends keyof StitchParams>(key: K, value: StitchParams[K]) =>
    setParams((p) => ({ ...p, [key]: value }))

  const copy = () => {
    const body =
      "export const DEFAULT_PARAMS: StitchParams = " +
      JSON.stringify(params, null, 2).replace(/"([^"]+)":/g, "$1:") +
      "\n"
    setDump(body)
    void navigator.clipboard?.writeText(body).catch(() => {})
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
        <h1 className="text-[24px] m-0">Atelier — rendu tissu</h1>
        <span className="font-mono text-[12.5px] text-stone">{note}</span>
      </div>

      {error && (
        <p role="alert" className="text-coral-deeper font-mono text-[13px]">
          {error}
        </p>
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
        {/* the render */}
        <div className="flex flex-col gap-3 lg:sticky lg:top-4">
          {/* Which surface. The photographs are the ones the site uses, at the
              same spot and the same size, so what is on screen here is what a
              visitor will see. */}
          <div className="flex gap-1.5 flex-wrap">
            {SURFACES.map((label, i) => {
              const index = i - 1
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setSurface(index)
                    setZoom(1)
                  }}
                  className={`rounded-full font-mono text-[12px] px-3 py-1.5 cursor-pointer transition-colors ${
                    surface === index ? "bg-ink text-blanc" : "bg-blanc text-cocoa hover:bg-linen"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {surface < 0 ? (
            <canvas
              ref={glRef}
              className="w-full block rounded-card shadow-card bg-linen"
              style={{ aspectRatio: `${pattern.width} / ${pattern.height}` }}
            />
          ) : (
            // The zoom is a magnifier here, not a stitch size: it scales the
            // photograph and the motif together, centred on the motif, so the
            // proportions stay the ones the product actually has.
            <div className="relative overflow-hidden rounded-card shadow-card bg-linen aspect-square">
              <div
                className="absolute inset-0"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: `${PRODUCTS[surface].spot.x * 100}% ${PRODUCTS[surface].spot.y * 100}%`,
                }}
              >
                <img
                  src={PRODUCTS[surface].src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <canvas
                  ref={glRef}
                  style={{
                    position: "absolute",
                    left: `${PRODUCTS[surface].spot.x * 100}%`,
                    top: `${PRODUCTS[surface].spot.y * 100}%`,
                    width: `${PRODUCTS[surface].spot.w * 100}%`,
                    aspectRatio: `${pattern.width} / ${pattern.height}`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="block"
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="font-mono text-[12px] text-stone shrink-0">
              {surface < 0 ? "taille du point" : "loupe"}
            </label>
            <input
              type="range"
              min={onPhoto ? 1 : 0.3}
              max={onPhoto ? 6 : 4}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-coral"
            />
            <span className="font-mono text-[12px] text-cocoa w-12 text-right">
              {zoom.toFixed(2)}
            </span>
          </div>
          <details className="bg-blanc rounded-card shadow-soft p-3">
            <summary className="cursor-pointer font-mono text-[12.5px] text-cocoa">
              la même grille, rendu plat
            </summary>
            <canvas
              ref={flatRef}
              style={{ imageRendering: "pixelated", width: "100%" }}
              className="block h-auto mt-3 rounded-[6px]"
            />
          </details>
        </div>

        {/* the knobs */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={copy}
              className="rounded-full bg-coral text-blanc font-display text-[14px] px-4 py-2 cursor-pointer hover:bg-coral-deep"
            >
              copier les réglages
            </button>
            <button
              type="button"
              onClick={() => {
                clearSavedParams()
                setParams(DEFAULT_PARAMS)
              }}
              className="rounded-full bg-linen text-cocoa font-display text-[14px] px-4 py-2 cursor-pointer hover:bg-edge-3"
            >
              remettre à zéro
            </button>
          </div>

          <p className="font-mono text-[11.5px] text-stone m-0 leading-snug">
            ces réglages sont gardés dans ce navigateur et s'appliquent aux aperçus
            produit du site — envoyez-les-moi pour les rendre définitifs pour tout
            le monde.
          </p>

          <label className="flex items-center justify-between gap-3 bg-blanc rounded-chip px-3 py-2">
            <span className="font-mono text-[12.5px] text-bark">couleur de la toile</span>
            <input
              type="color"
              value={rgb01ToHex(params.clothColor)}
              onChange={(e) => set("clothColor", hexToRgb01(e.target.value))}
              className="w-12 h-8 rounded-[8px] border-[1.5px] border-edge-3 cursor-pointer bg-transparent p-0"
            />
          </label>

          {PARAM_GROUPS.map((group) => (
            <fieldset
              key={group.title}
              className="bg-blanc rounded-card shadow-soft p-3 border-0 m-0"
            >
              <legend className="font-display font-medium text-[14px] text-ink px-1">
                {group.title}
              </legend>
              <div className="flex flex-col gap-1.5 mt-1">
                {group.items.map((item) => (
                  <label key={item.key} className="grid grid-cols-[1fr_auto] gap-x-2 items-center">
                    <span className="font-mono text-[11.5px] text-stone col-span-2">
                      {item.label}
                    </span>
                    <input
                      type="range"
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      value={params[item.key] as number}
                      onChange={(e) => set(item.key, Number(e.target.value) as never)}
                      className="w-full accent-coral"
                    />
                    <span className="font-mono text-[11.5px] text-cocoa w-12 text-right">
                      {(params[item.key] as number).toFixed(3)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {dump && (
        <div className="mt-6">
          <p className="font-mono text-[12.5px] text-stone m-0 mb-2">
            copié dans le presse-papier — collez-le tel quel
          </p>
          <textarea
            readOnly
            value={dump}
            rows={14}
            className="w-full font-mono text-[12px] rounded-field border-[1.5px] border-edge-3 bg-blanc p-3"
          />
        </div>
      )}
    </div>
  )
}
