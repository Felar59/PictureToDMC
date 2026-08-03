import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { Bobbin } from "@/components/brand/bobbin"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/pill"
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
 * The pattern is rebuilt from the stored grid rather than shown as a fixed
 * image — that is the whole reason the grid is stored at all. It means this page
 * can draw it crisp at any size, and list every thread with its real stitch
 * count, from 30 KB of data.
 */
export default function Piece() {
  const { t } = useI18n()
  const { user, signIn } = useAuth()
  const { id } = useParams()
  const postId = Number(id)

  const [post, setPost] = useState<api.PostDetail | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")
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

  /** The stored grid, back into the shape the renderer already understands. */
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
    const optimistic = { ...post, liked: !post.liked, likeCount: post.likeCount + (post.liked ? -1 : 1) }
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
      <Link to="/gallery" className="text-[14px] font-bold text-stone hover:text-coral-deep">
        ← {t.piece.backToGallery}
      </Link>

      <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-9 mt-5 items-start">
        <div className="flex flex-col gap-4">
          {/* The finished piece, if the maker photographed it. */}
          {post.hasPhoto && (
            <img
              src={api.photoUrl(post.id)}
              alt={post.title}
              className="w-full rounded-[20px] shadow-card object-cover max-h-[460px]"
            />
          )}
          <div className="aida [--aida-size:22.5px] [--aida-ink:.09] bg-aida rounded-[20px] p-6 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] flex justify-center">
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

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-[30px] sm:text-[34px] m-0">{post.title}</h1>
            <Link
              to={`/brodeur/${post.author.id}`}
              className="inline-flex items-center gap-2.5 mt-3 group"
            >
              {post.author.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="size-10 rounded-full bg-linen"
                />
              ) : (
                <span className="size-10 rounded-full bg-coral text-blanc grid place-items-center font-display font-semibold">
                  {post.author.displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="text-[15.5px] font-bold text-cocoa group-hover:text-coral-deep transition-colors">
                {post.author.displayName}
              </span>
            </Link>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Tag>{t.gallery.stitches(post.width, post.height)}</Tag>
            <Tag>{t.gallery.colors(post.threadCount)}</Tag>
            <Tag>{t.converter.size.total(pattern.stitched)}</Tag>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => void like()} variant={post.liked ? "primary" : "secondary"}>
              <span aria-hidden="true">{post.liked ? "♥" : "♡"}</span>
              {post.likeCount}
            </Button>
            <Button asChild variant="secondary">
              <Link to="/convert">{t.piece.makeYourOwn}</Link>
            </Button>
          </div>

          {/* The shopping list: what you would actually buy to stitch this. */}
          <div className="bg-blanc rounded-[18px] shadow-soft p-5">
            <h2 className="font-display font-medium text-[17px] m-0 mb-3">{t.piece.threads}</h2>
            <ul className="flex flex-col gap-2 list-none p-0 m-0 max-h-[420px] overflow-y-auto scroll-linen pr-1.5">
              {pattern.threads.map((thread, i) => (
                <li
                  key={thread.num}
                  className="flex items-center gap-3 bg-linen rounded-[12px] px-3 py-2"
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
    </div>
  )
}
