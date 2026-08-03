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

  /** The stored grid, back into the shape the renderers already understand. */
  const pattern = useMemo<Pattern | null>(() => {
    if (!post) return null
    const threads = post.threadCodes
      .map((code) => findThread(code))
      .filter((x): x is Thread => Boolean(x))
    const cells = base64ToCells(post.cells, threads.length)
    const counts = new Array<number>(threads.length).fill(0)
    let stitched = 0
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] < 0) continue
      counts[cells[i]]++
      stitched++
    }
    return { width: post.width, height: post.height, cells, threads, counts, stitched }
  }, [post])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !pattern) return
    const image = patternImageData(pattern)
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext("2d")?.putImageData(image, 0, 0)
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
            <span className="font-mono text-[12.5px] text-stone">
              {t.gallery.stitches(post.width, post.height)} · {t.gallery.colors(post.threadCount)} ·{" "}
              {t.converter.size.total(pattern.stitched)}
            </span>
          </div>
        </div>

        {/* Not `variant="primary"`: coral belongs to the download and there is
            never a second one on a screen. The liked state reads through the
            coral wash instead, the way the gallery card does it. */}
        <button
          type="button"
          onClick={() => void like()}
          aria-pressed={post.liked}
          aria-label={t.gallery.likeAria(post.title)}
          className={`inline-flex items-center gap-2.5 rounded-full px-5 min-h-[46px] shrink-0 cursor-pointer font-display text-[17px] border-[1.5px] transition-colors ${
            post.liked
              ? "bg-coral-wash border-coral-edge text-coral-deep"
              : "bg-blanc border-edge-3 text-cocoa hover:border-coral hover:text-coral-deep"
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

      <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 mt-8 items-start">
        {/* Look at it. */}
        <div className="flex flex-col gap-4">
          {post.hasPhoto && (
            <img
              src={api.photoUrl(post.id)}
              alt={post.title}
              className="w-full rounded-card shadow-card object-cover max-h-[460px]"
            />
          )}
          <div className="aida [--aida-size:22.5px] [--aida-ink:.09] bg-aida rounded-card p-6 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] flex justify-center">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={post.title}
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

          <div className="bg-blanc rounded-[18px] shadow-soft p-5">
            <div className="flex items-baseline justify-between gap-3 mb-3.5">
              <h2 className="font-display font-medium text-[17px] m-0">{t.piece.threadsToBuy}</h2>
              <span className="font-mono text-[12.5px] text-stone">
                {t.converter.threads.count(pattern.threads.length)}
              </span>
            </div>
            {/* Two columns where there is room, and no inner scrollbar: a nested
                scroll area hides half a shopping list from anyone who does not
                know to look for it. The page scrolls instead. */}
            <ul className="grid sm:grid-cols-2 gap-2 list-none p-0 m-0">
              {pattern.threads.map((thread, i) => (
                <li
                  key={thread.num}
                  className="flex items-center gap-3 bg-linen rounded-chip px-3 py-2"
                >
                  <Bobbin hex={thread.hex} width={22} height={30} radius={6} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13.5px] font-extrabold">DMC {thread.num}</span>
                    <span className="block text-xs text-stone truncate">{thread.name}</span>
                  </span>
                  <span className="font-mono text-[11.5px] text-cocoa shrink-0">
                    {t.piece.stitches(pattern.counts[i])}
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
        <ProductPreview pattern={pattern} kicker={t.showcase.kickerShared} />
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
