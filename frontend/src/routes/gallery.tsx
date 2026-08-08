import { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { BrandMark } from "@/components/brand/logo"
import { SortArrow } from "@/components/brand/icons"
import { GalleryCard } from "@/community/gallery-card"
import { ShareWorkDialog } from "@/community/share-work-dialog"
import { useAuth } from "@/community/auth-context"
import { Button } from "@/components/ui/button"
import { Pill } from "@/components/ui/pill"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { paths } from "@/lib/routes"
import { useHead } from "@/lib/head"
import { breadcrumb, collection, graph } from "@/lib/schema"

const FILTER_KEYS = ["all", "pets", "flowers", "landscapes"] as const

/**
 * The two galleries, in one page and under one entry in the navigation bar.
 *
 * They hold different things — charts this site generated, and photographs of
 * finished work that may have been stitched from anywhere — but they are the same
 * question asked twice ("what have people made?"), so splitting them into two
 * places in the header would have made a visitor choose before they knew what they
 * were choosing between.
 *
 * Each tab is a real URL, not a piece of component state: they are both shareable,
 * both reloadable, both in the back button, and both indexable under their own
 * title. That is also why the tabs are links rather than buttons.
 */
export default function Gallery() {
  const { t, lang } = useI18n()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // The path decides, so a cold load of either URL opens the right tab.
  const kind: api.PostKind = pathname === paths.galleryStitches ? "photo" : "pattern"
  const photos = kind === "photo"
  const copy = photos ? t.gallery.finished : t.gallery.patterns

  const { user, signIn } = useAuth()

  const [filter, setFilter] = useState<string>("all")
  const [sort, setSort] = useState<"new" | "top">("new")
  /** Which way `sort` runs. Newest and most-loved first is what people want on
   *  arrival, so both start descending. */
  const [direction, setDirection] = useState<"desc" | "asc">("desc")

  /**
   * Pick a sort, or turn the one already picked around.
   *
   * Choosing the other field resets to descending rather than carrying the
   * direction across: having asked for the oldest charts, "les plus aimés" should
   * hand you the best-loved ones, not the least-loved — the direction was a
   * statement about dates, not a standing preference for the bottom of lists.
   */
  const chooseSort = (key: "new" | "top") => {
    if (key !== sort) {
      setSort(key)
      setDirection("desc")
      return
    }
    setDirection((d) => (d === "desc" ? "asc" : "desc"))
  }

  const [posts, setPosts] = useState<api.PostCard[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")
  const [sharing, setSharing] = useState(false)

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
        const res = await api.fetchPosts({
          category: filter,
          sort,
          direction,
          page: nextPage,
          kind,
        })
        setPosts((prev) => (replace ? res.posts : [...prev, ...res.posts]))
        setHasMore(res.hasMore)
        setPage(nextPage)
        setState("ready")
      } catch {
        setState("failed")
      }
    },
    [filter, sort, direction, kind],
  )

  // `kind` is in `load`'s dependencies, so switching tab refetches from page 0 —
  // without which the charts would sit under the photo gallery's heading for as
  // long as the request took.
  useEffect(() => {
    void load(0, true)
  }, [load])

  // Declared down here because the graph lists what is actually on screen, so it
  // has to come after the posts do. It rewrites as pages load, which is correct:
  // pressing "voir plus" really does change what this page contains.
  const head = photos ? t.head.galleryStitches : t.head.gallery
  useHead({
    title: head.title,
    description: head.description,
    jsonLd: graph(
      collection({
        path: photos ? paths.galleryStitches : paths.gallery,
        name: copy.title,
        description: head.description,
        lang,
        pieces: posts,
      }),
      breadcrumb(
        photos
          ? [
              { name: t.site.short, path: paths.home },
              { name: t.nav.gallery, path: paths.gallery },
              { name: t.gallery.tabs.finished, path: paths.galleryStitches },
            ]
          : [
              { name: t.site.short, path: paths.home },
              { name: t.nav.gallery, path: paths.gallery },
            ],
      ),
    ),
  })

  const like = async (id: number) => {
    if (!user) return signIn(pathname)
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
    // Only an admin ever sees the ✕ on a piece that isn't theirs, and they see it
    // on every card in the gallery. So the prompt says whose it is.
    const own = posts.find((p) => p.id === id)?.author.id === user?.id
    if (!window.confirm(own ? t.gallery.confirmDelete : t.gallery.confirmDeleteOther)) return
    setPosts((prev) => prev.filter((p) => p.id !== id))
    await api.deletePost(id).catch(() => void load(0, true))
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-20">
      {/* Title, and then only what the title does not already say.
          The charts tab used to open with a handwritten kicker and three lines
          restating its own heading, which pushed the first actual chart most of a
          screen down — on the one page whose whole job is to show them. The photo
          tab keeps a single line because it carries a rule people cannot guess:
          the chart may come from anywhere. */}
      <header className="text-center pt-12 lg:pt-13 pb-2.5">
        <h1 className="text-[34px] sm:text-[40px] lg:text-[44px] mt-0 mb-0 tracking-[-.5px]">
          {copy.title}
        </h1>
        {photos && (
          <p className="text-[17px] leading-[1.6] text-clay mx-auto max-w-[560px] mt-3 mb-0">
            {t.gallery.finished.lead}
          </p>
        )}
      </header>

      {/* Navigation, not a tablist: these are two pages. Marked up as links so a
          middle-click opens one in a tab and a screen reader announces where it
          goes, with the running-stitch dashes the rest of the site uses to say
          "this lands on cloth" carried by the selected one. */}
      <nav aria-label={t.nav.gallery} className="flex justify-center pt-5">
        {/* `bg-aida`, not `bg-linen`: linen is the page, so a linen well on a linen
            page was a border around nothing and the unselected tab looked like
            plain text that happened to be there. Aida is the next shade down —
            the cloth — so the well reads as a groove and the selected tab as a
            chip resting in it. */}
        <div className="inline-flex gap-1 bg-aida border-[1.5px] border-edge-4 rounded-full p-1">
          {(
            [
              [paths.gallery, t.gallery.tabs.patterns, !photos],
              [paths.galleryStitches, t.gallery.tabs.finished, photos],
            ] as const
          ).map(([to, label, active]) => (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              // The unselected tab is `cocoa`, not `stone`: measured on the cloth
              // the well is made of, stone came to 3.4:1 and this is 15px text
              // somebody has to read to know where the other gallery is. Cocoa is
              // 5.19:1 there. What separates the two tabs is the chip and its
              // shadow, which is a stronger signal than a paler grey anyway.
              className={`font-display text-[15px] px-5 min-h-11 inline-flex items-center rounded-full transition-colors ${
                active ? "bg-blanc text-cocoa shadow-card-sm" : "text-cocoa hover:text-coral-deep"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {notice && (
        <p
          role="alert"
          className="mt-5 mx-auto max-w-[560px] bg-coral-wash border-2 border-dashed border-coral-edge text-coral-deeper rounded-[16px] px-5 py-3 text-[15px] text-center"
        >
          {notice}
        </p>
      )}

      {/* What you are looking at, and in what order — one line, read left to
          right. They were two centred rows, which made a filter and a sort look
          like the same kind of choice stacked twice; they are not. Wrapping puts
          the sort on its own line below the subjects at narrow widths, which is
          the same reading order, just folded. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-5 pt-6 pb-2">
        <div role="group" aria-label={t.gallery.filterLabel} className="flex flex-wrap gap-2">
          {FILTER_KEYS.map((key) => (
            <Pill key={key} selected={filter === key} onClick={() => setFilter(key)}>
              {t.gallery.filters[key]}
            </Pill>
          ))}
        </div>

        <div role="group" aria-label={t.gallery.sort.label} className="flex flex-wrap gap-2">
          {(["new", "top"] as const).map((key) => {
            const active = sort === key
            // The chosen button says which way it is running and carries the
            // arrow; the other offers its default. Showing a direction on the
            // button you are *not* using would claim an order that isn't in force.
            const label = t.gallery.sort[key][active ? direction : "desc"]
            return (
              <Pill
                key={key}
                selected={active}
                onClick={() => chooseSort(key)}
                // Spelled out rather than left to the arrow: "click the one that
                // is already on to turn it around" is not a thing anyone should
                // have to discover, and a tooltip is where people look first.
                title={active ? t.gallery.sort.reverse(label) : undefined}
                aria-label={active ? t.gallery.sort.reverse(label) : undefined}
                className="inline-flex items-center gap-2"
              >
                {label}
                {active && <SortArrow up={direction === "asc"} />}
              </Pill>
            )
          })}
        </div>
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
            {filter === "all" ? copy.emptyAll : t.gallery.empty}
          </p>
        )}

        {/* The invitation sits inside the grid — an offer, not a demand. What it
            offers depends on which gallery you are in: a chart is made from a
            photo on the converter, a finished piece needs only its photograph. */}
        <div className="aida [--aida-size:14px] [--aida-ink:.06] bg-[#F7F1E5] border-[2.5px] border-dashed border-coral-dash rounded-[20px] flex flex-col items-center justify-center gap-3 p-6 text-center min-h-[300px]">
          <BrandMark size={72} />
          <h2 className="text-[21px] m-0">{copy.inviteTitle}</h2>
          <p className="text-[14.5px] leading-[1.55] text-cocoa max-w-[240px] m-0">
            {copy.inviteBody}
          </p>
          {!user ? (
            <Button size="sm" onClick={() => signIn(pathname)}>
              {t.account.signIn}
            </Button>
          ) : photos ? (
            <Button size="sm" onClick={() => setSharing(true)}>
              {copy.inviteCta}
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to={paths.convert}>{copy.inviteCta}</Link>
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

      <ShareWorkDialog
        open={sharing}
        onClose={() => setSharing(false)}
        onPublished={(id) => void navigate(paths.piece(id))}
      />
    </div>
  )
}
