import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { Bobbin } from "@/components/brand/bobbin"
import { ChartPanel } from "@/components/converter/chart-panel"
import { ProductPreview } from "@/components/showcase/product-preview"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/community/auth-context"
import type { Pattern } from "@/engine/convert"
import { findThread, type Thread } from "@/engine/dmc"
import { base64ToCells } from "@/engine/publish"
import { patternImageData } from "@/engine/render"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"

/**
 * One published piece.
 *
 * The page has a single job: hand over the pattern. A visitor arrives from the
 * gallery because a thumbnail caught them, and what they want is to stitch that
 * thing — so the printable chart is the destination, and the photo, the maker's
 * name and the hearts are the evidence that it is worth the evening. The page
 * used to have no download at all, which meant it was evidence and nothing else.
 *
 * That job sets the order: look at it (left), take it away (right), imagine it
 * finished (below). On a narrow screen those stack in the same sequence.
 *
 * The pattern is rebuilt from the stored grid rather than shown as a fixed
 * image — that is the whole reason the grid is stored at all. It means this page
 * can draw it crisp at any size, list every thread with its real stitch count,
 * and render a full printable chart, from 30 KB of data.
 */
export default function Piece() {
  const { t } = useI18n()
  const { user, signIn } = useAuth()
  const { id } = useParams()
  const postId = Number(id)

  const [post, setPost] = useState<api.PostDetail | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")
  const [downloadFailed, setDownloadFailed] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let cancelled = false
    setState("loading")
    api
      .fetchPost(postId)
      .then((p) => {
        if (cancelled) return
        setPost(p)
        setState("ready")
      })
      .catch(() => !cancelled && setState("failed"))
    return () => {
      cancelled = true
    }
  }, [postId])

  // Depend on the stored grid itself, not on `post`. Liking a piece replaces the
  // post object twice — once optimistically, once with the server's count — and
  // with `[post]` that rebuilt the grid, the cloth canvas, the full chart and all
  // four mockups on every heart click. None of those four fields ever change.
  const { cells: storedCells, width, height, threadCodes } = post ?? {}

  /**
   * The stored grid, back into the shape the renderers already understand.
   *
   * The DMC references are resolved with their positions kept. Filtering the
   * unresolvable ones out and handing the shorter length to `base64ToCells`
   * reads as equivalent and is not: the stored bytes index the *original* list,
   * so dropping one shifts every thread after it by a place. The result is a
   * grid drawn in the wrong colours, a wrong shopping list and a wrong
   * downloaded chart, with no error anywhere — and it would happen retroactively
   * to every stored post the day a row leaves `dmc-data.ts`. An unknown
   * reference becomes bare cloth instead: wrong in one visible place rather than
   * wrong everywhere and silent.
   */
  const pattern = useMemo<Pattern | null>(() => {
    if (storedCells === undefined || !width || !height || !threadCodes) return null

    const threads: Thread[] = []
    // Stored index -> index in `threads`, or -1 if our chart has no such thread.
    const remap = threadCodes.map((code) => {
      const thread = findThread(code)
      return thread ? threads.push(thread) - 1 : -1
    })

    // Decoded against the full stored length, so the bytes keep their meaning.
    const stored = base64ToCells(storedCells, threadCodes.length)
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
    return { width, height, cells, threads, counts, stitched }
  }, [storedCells, width, height, threadCodes])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !pattern) return
    const image = patternImageData(pattern)
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext("2d")?.putImageData(image, 0, 0)
  }, [pattern])

  /**
   * The aida weave behind the pattern, pitched to the stitches actually on top
   * of it.
   *
   * `--aida-size` exists so the fabric lines up with the preview — that is what
   * the token is for. Pinning it to a constant while the canvas scales to its
   * container defeats it: bare cells are transparent, so a mismatched weave
   * shows *through* the holes in the motif at some arbitrary pitch. Measuring
   * the drawn width is the only way to get one weave square per stitch.
   */
  const [clothPitch, setClothPitch] = useState(0)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !pattern) return
    const measure = () => setClothPitch(canvas.clientWidth / pattern.width)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [pattern])

  const like = async () => {
    if (!post) return
    if (!user) return signIn(`/piece/${postId}`)
    const optimistic = {
      ...post,
      liked: !post.liked,
      likeCount: post.likeCount + (post.liked ? -1 : 1),
    }
    setPost(optimistic)
    try {
      const res = await api.toggleLike(postId)
      setPost((p) => (p ? { ...p, liked: res.liked, likeCount: res.likeCount } : p))
    } catch {
      setPost(post) // put the truth back
    }
  }

  if (state === "loading") {
    return <p className="text-center text-cocoa py-24">{t.gallery.loading}</p>
  }
  if (state === "failed" || !post || !pattern) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-4">
        <p className="text-coral-deeper m-0">{t.piece.notFound}</p>
        <Button asChild variant="secondary">
          <Link to="/gallery">{t.piece.backToGallery}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-20 py-10">
      <Link
        to="/gallery"
        className="inline-block text-[14px] font-bold text-stone hover:text-coral-deep transition-colors"
      >
        ← {t.piece.backToGallery}
      </Link>

      {/* One header across the page. The three grey chips this replaces said the
          same thing in three boxes; a chart's own header block carries its
          measurements as a line of figures, so that is what this is — set in the
          utility face, because that is what it is: data. */}
      <header className="mt-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <h1 className="text-[27px] sm:text-[34px] leading-[1.15] m-0">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              to={`/brodeur/${post.author.id}`}
              className="inline-flex items-center gap-2.5 group shrink-0"
            >
              {post.author.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="size-9 rounded-full bg-linen"
                />
              ) : (
                <span className="size-9 rounded-full bg-coral text-blanc grid place-items-center font-display font-semibold">
                  {post.author.displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="text-[15.5px] font-bold text-cocoa group-hover:text-coral-deep transition-colors">
                {t.gallery.by(post.author.displayName)}
              </span>
            </Link>
            <span aria-hidden="true" className="text-edge-5">
              ·
            </span>
            {/* Bare dimensions, not `gallery.stitches`: that helper suffixes
                "st"/"pts", which read as a second stitch count directly beside
                "1 963 points à broder". The colour count comes from the threads
                we could actually resolve, so it can never disagree with the list
                below it. */}
            <span className="font-mono text-[12.5px] text-stone">
              {pattern.width} × {pattern.height} · {t.gallery.colors(pattern.threads.length)} ·{" "}
              {t.converter.size.total(pattern.stitched)}
            </span>
          </div>
        </div>

        {/* Never `primary`: coral belongs to the download. The same wash the
            gallery card uses carries the liked state, so the heart looks like one
            control across the site rather than a shape invented per page. The
            count is in the label as well as on screen — `aria-label` replaces the
            visible text, so without it a screen reader hears no number at all. */}
        <button
          type="button"
          onClick={() => void like()}
          aria-pressed={post.liked}
          aria-label={`${t.gallery.likeAria(post.title)} · ${post.likeCount}`}
          className={`inline-flex items-center gap-2.5 rounded-full px-5 min-h-[46px] shrink-0 cursor-pointer font-display text-[17px] transition-colors ${
            post.liked
              ? "bg-coral-wash text-coral-deep"
              : "bg-linen text-cocoa hover:bg-coral-wash hover:text-coral-deep"
          }`}
        >
          <span aria-hidden="true">{post.liked ? "♥" : "♡"}</span>
          {post.likeCount}
        </button>
      </header>

      {/* Same banner the converter uses, so a failed download says the same
          thing in both places. */}
      {downloadFailed && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-4 bg-coral-wash border-2 border-dashed border-coral-edge rounded-field px-5 py-4"
        >
          <p className="flex-1 text-[15px] text-coral-deeper m-0">
            {t.converter.errors.download}
          </p>
          <button
            type="button"
            onClick={() => setDownloadFailed(false)}
            className="text-coral-deep text-sm font-bold cursor-pointer hover:text-coral-deeper shrink-0"
          >
            {t.converter.errors.dismiss}
          </button>
        </div>
      )}

      {/* Equal halves. The chart is the reason for the visit, so giving the
          column it lives in the smaller share contradicted the page's own
          ordering. */}
      <div className="grid lg:grid-cols-2 gap-8 mt-8 items-start">
        {/* Look at it. */}
        <div className="flex flex-col gap-4">
          {post.hasPhoto && (
            <img
              src={api.photoUrl(post.id)}
              alt={t.piece.photoAlt(post.title)}
              className="w-full rounded-card shadow-card object-cover max-h-[460px]"
            />
          )}
          {/* The weave is drawn only once its pitch is known — one square per
              stitch. Until then it stays plain cloth, which is better than a
              wrong pitch showing through the motif's bare cells. */}
          <div
            className={`${clothPitch > 0 ? "aida" : ""} [--aida-ink:.09] bg-aida rounded-card p-6 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] flex justify-center`}
            style={clothPitch > 0 ? { ["--aida-size" as string]: `${clothPitch}px` } : undefined}
          >
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={t.piece.patternAlt(post.title)}
              width={pattern.width}
              height={pattern.height}
              style={{ imageRendering: "pixelated", width: "100%", maxWidth: 520 }}
              className="block h-auto rounded-[6px]"
            />
          </div>
          <p className="font-hand text-sm text-sand text-center m-0">{t.piece.patternNote}</p>
        </div>

        {/* Take it away. The chart first, because that is what the visit is for;
            the shopping list second, because it is what you do next. */}
        <div className="flex flex-col gap-5">
          <ChartPanel pattern={pattern} onError={() => setDownloadFailed(true)} />

          <div className="@container bg-blanc rounded-card shadow-soft p-5">
            <div className="flex items-baseline justify-between gap-3 mb-3.5">
              <h2 className="font-display font-medium text-[17px] m-0">{t.piece.threadsToBuy}</h2>
              <span className="font-mono text-[12.5px] text-stone">
                {t.converter.threads.count(pattern.threads.length)}
              </span>
            </div>
            {/* Two columns where there is room, and no inner scrollbar: a nested
                scroll area hides half a shopping list from anyone who does not
                know to look for it. The page scrolls instead.
                A container query, not `sm:` — this card is full-width below the
                two-column breakpoint and then abruptly narrower above it, so a
                viewport rule splits it exactly where the room runs out. At 1024
                that gave each row 124px and truncated "Snow White" to "Snow W…"
                while "DMC B5200" wrapped onto two lines. */}
            <ul className="grid @min-[26rem]:grid-cols-2 gap-2 list-none p-0 m-0">
              {pattern.threads.map((thread, i) => (
                <li
                  key={thread.num}
                  className="flex items-center gap-3 bg-linen rounded-chip px-3 py-2"
                >
                  <Bobbin hex={thread.hex} width={22} height={30} radius={6} />
                  {/* The stitch count rides on the code's line rather than in its
                      own column, which hands the whole row width to the name.
                      Beside the count, two columns left about 109px for it and
                      real DMC names ("Vert Mousse Très Foncé") clipped; the row
                      is the same height either way. */}
                  <span className="flex-1 min-w-0">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[13.5px] font-extrabold">DMC {thread.num}</span>
                      <span className="font-mono text-[11.5px] text-cocoa shrink-0">
                        {t.piece.stitches(pattern.counts[i])}
                      </span>
                    </span>
                    {/* Wraps rather than truncates. Even with the row width to
                        itself, the longest name in the chart — "Étoile -
                        Pistachio Green - Ultra Dark", 37 characters — still
                        clipped in two columns, and a shopping list that hides
                        which thread to buy is not a shopping list. A grid row
                        stretches to its tallest cell, so a second line costs
                        nothing but height on the one row that needs it. */}
                    <span className="block text-xs text-stone leading-snug break-words">
                      {thread.name}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Imagine it finished. A hairline, not a slab: the page is one visit, not
          three pages stacked. */}
      <div className="border-t border-edge-2 mt-14 pt-12">
        <ProductPreview pattern={pattern} />
      </div>

      {/* The exit. Secondary, because the coral on this page belongs to the
          download — someone else's pattern is the thing on offer here. */}
      <div className="bg-blanc rounded-card-lg shadow-soft mt-14 px-6 py-9 text-center flex flex-col items-center gap-3">
        <h2 className="text-[22px] sm:text-[25px] m-0">{t.piece.exitTitle}</h2>
        <p className="text-[16px] text-clay max-w-[46ch] m-0">{t.piece.exitLead}</p>
        <Button asChild variant="secondary" className="mt-2">
          <Link to="/convert">{t.piece.makeYourOwn}</Link>
        </Button>
      </div>
    </div>
  )
}
