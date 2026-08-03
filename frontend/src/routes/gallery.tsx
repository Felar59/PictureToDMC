import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { BrandMark } from "@/components/brand/logo"
import { useAuth } from "@/community/auth-context"
import { Button } from "@/components/ui/button"
import { Pill } from "@/components/ui/pill"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"

const FILTER_KEYS = ["all", "pets", "portraits", "flowers", "landscapes", "little"] as const

function GalleryCard({
  post,
  onLike,
  onDelete,
}: {
  post: api.PostCard
  onLike: (id: number) => void
  onDelete: (id: number) => void
}) {
  const { t } = useI18n()
  const { user } = useAuth()
  const mine = user && (user.id === post.author.id || user.isAdmin)

  return (
    <article className="bg-blanc rounded-[20px] shadow-card-sm p-3.5 flex flex-col gap-3 transition-shadow hover:shadow-lift">
      {/* The finished piece if they photographed it, otherwise the pattern. */}
      {post.hasPhoto ? (
        <img
          src={api.photoUrl(post.id)}
          alt={post.title}
          loading="lazy"
          className="w-full h-[230px] object-cover rounded-[14px] bg-linen"
        />
      ) : (
        <img
          src={api.thumbUrl(post.id)}
          alt={post.title}
          loading="lazy"
          style={{ imageRendering: "pixelated" }}
          className="w-full h-[230px] object-contain rounded-[14px] bg-aida p-2"
        />
      )}

      <div className="px-1 flex items-center gap-2.5">
        {post.author.avatarUrl ? (
          <img
            src={post.author.avatarUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="size-9 rounded-full shrink-0 bg-linen"
          />
        ) : (
          <span className="size-9 rounded-full bg-coral text-blanc grid place-items-center font-display font-semibold shrink-0">
            {post.author.displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[16.5px] leading-tight truncate">{post.title}</h3>
          <div className="text-[13px] text-stone truncate">
            {t.gallery.by(post.author.displayName)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onLike(post.id)}
          aria-label={t.gallery.likeAria(post.title)}
          aria-pressed={post.liked}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0 cursor-pointer transition-colors ${
            post.liked ? "bg-coral-wash text-coral-deep" : "bg-linen text-cocoa hover:bg-coral-wash"
          }`}
        >
          <span aria-hidden="true">{post.liked ? "♥" : "♡"}</span>
          <span className="text-[12.5px] font-extrabold">{post.likeCount}</span>
        </button>
      </div>

      <div className="flex gap-1.5 px-1 pb-1 flex-wrap items-center">
        <span className="text-[11.5px] font-extrabold bg-linen rounded-full px-2.5 py-1 text-cocoa">
          {t.gallery.stitches(post.width, post.height)}
        </span>
        <span className="text-[11.5px] font-extrabold bg-linen rounded-full px-2.5 py-1 text-cocoa">
          {t.gallery.colors(post.threadCount)}
        </span>
        <Link
          to="/convert"
          className="text-[11.5px] font-extrabold text-coral-deep bg-coral-wash rounded-full px-2.5 py-1 hover:bg-coral hover:text-blanc transition-colors"
        >
          {t.gallery.getPattern}
        </Link>
        {mine && (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            aria-label={t.gallery.deleteAria(post.title)}
            className="ml-auto text-[11.5px] font-bold text-stone hover:text-coral-deep cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
    </article>
  )
}

export default function Gallery() {
  const { t } = useI18n()
  const { user, signIn } = useAuth()

  const [filter, setFilter] = useState<string>("all")
  const [sort, setSort] = useState<"new" | "top">("new")
  const [posts, setPosts] = useState<api.PostCard[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")

  // The sign-in redirect lands back here with a reason when Google refused.
  const [notice, setNotice] = useState<string | null>(null)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("signin") !== "failed") return
    const reason = params.get("reason")
    setNotice(
      reason === "state"
        ? t.account.failedState
        : reason === "banned"
          ? t.account.failedBanned
          : t.account.failed,
    )
    // Clear the query so a reload doesn't show the message again.
    window.history.replaceState({}, "", window.location.pathname)
  }, [t])

  const load = useCallback(
    async (nextPage: number, replace: boolean) => {
      setState((s) => (replace ? "loading" : s))
      try {
        const res = await api.fetchPosts({ category: filter, sort, page: nextPage })
        setPosts((prev) => (replace ? res.posts : [...prev, ...res.posts]))
        setHasMore(res.hasMore)
        setPage(nextPage)
        setState("ready")
      } catch {
        setState("failed")
      }
    },
    [filter, sort],
  )

  useEffect(() => {
    void load(0, true)
  }, [load])

  const like = async (id: number) => {
    if (!user) return signIn("/gallery")
    // Optimistic: the heart has to answer the click immediately.
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) } : p,
      ),
    )
    try {
      const res = await api.toggleLike(id)
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, liked: res.liked, likeCount: res.likeCount } : p)),
      )
    } catch {
      void load(0, true) // put the truth back
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm(t.gallery.confirmDelete)) return
    setPosts((prev) => prev.filter((p) => p.id !== id))
    await api.deletePost(id).catch(() => void load(0, true))
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-20">
      <header className="text-center pt-12 lg:pt-13 pb-2.5">
        <div className="font-hand text-[17px] text-quill">{t.gallery.kicker}</div>
        <h1 className="text-[34px] sm:text-[40px] lg:text-[44px] mt-1.5 mb-3 tracking-[-.5px]">
          {t.gallery.title}
        </h1>
        <p className="text-[17px] leading-[1.6] text-clay mx-auto max-w-[560px] m-0">
          {t.gallery.lead}
        </p>
      </header>

      {notice && (
        <p
          role="alert"
          className="mx-auto max-w-[560px] bg-coral-wash border-2 border-dashed border-coral-edge text-coral-deeper rounded-[16px] px-5 py-3 text-[15px] text-center"
        >
          {notice}
        </p>
      )}

      <div className="flex justify-center gap-2 pt-6 pb-2 flex-wrap">
        {FILTER_KEYS.map((key) => (
          <Pill key={key} selected={filter === key} onClick={() => setFilter(key)}>
            {t.gallery.filters[key]}
          </Pill>
        ))}
      </div>

      <div className="flex justify-center gap-2 pb-2">
        <Pill selected={sort === "new"} onClick={() => setSort("new")}>
          {t.gallery.sortNew}
        </Pill>
        <Pill selected={sort === "top"} onClick={() => setSort("top")}>
          {t.gallery.sortTop}
        </Pill>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-7 pb-7">
        {posts.map((post) => (
          <GalleryCard key={post.id} post={post} onLike={like} onDelete={remove} />
        ))}

        {state === "loading" && (
          <p className="sm:col-span-2 lg:col-span-3 text-center text-cocoa py-10 m-0">
            {t.gallery.loading}
          </p>
        )}
        {state === "failed" && (
          <p className="sm:col-span-2 lg:col-span-3 text-center text-coral-deeper py-10 m-0">
            {t.gallery.failed}
          </p>
        )}
        {state === "ready" && posts.length === 0 && (
          <p className="sm:col-span-2 lg:col-span-3 text-center text-cocoa py-10 m-0">
            {t.gallery.empty}
          </p>
        )}

        {/* The invitation sits inside the grid — an offer, not a demand. */}
        <div className="aida [--aida-size:14px] [--aida-ink:.06] bg-[#F7F1E5] border-[2.5px] border-dashed border-coral-dash rounded-[20px] flex flex-col items-center justify-center gap-3 p-6 text-center min-h-[300px]">
          <BrandMark size={72} />
          <h2 className="text-[21px] m-0">{t.gallery.shareTitle}</h2>
          <p className="text-[14.5px] leading-[1.55] text-cocoa max-w-[240px] m-0">
            {t.gallery.shareBody}
          </p>
          {user ? (
            <Button asChild size="sm">
              <Link to="/convert">{t.gallery.shareCta}</Link>
            </Button>
          ) : (
            <Button size="sm" onClick={() => signIn("/gallery")}>
              {t.account.signIn}
            </Button>
          )}
          <div className="font-hand text-[13.5px] text-sand">{t.account.whySignIn}</div>
        </div>
      </div>

      <div className="text-center pb-14">
        {hasMore && (
          <Button variant="secondary" onClick={() => void load(page + 1, false)}>
            {t.gallery.showMore}
          </Button>
        )}
      </div>
    </div>
  )
}
