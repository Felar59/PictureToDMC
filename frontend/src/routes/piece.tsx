import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { ProductDialog } from "@/components/showcase/product-dialog"
import { Button } from "@/components/ui/button"
import { AdminFlower } from "@/community/admin-flower"
import { useAuth } from "@/community/auth-context"
import { ChartDialog } from "@/community/chart-dialog"
import { Comments } from "@/community/comments"
import { PieceThreads } from "@/community/piece-threads"
import { ReportDialog } from "@/community/report-dialog"
import type { Pattern } from "@/engine/convert"
import { findThread, type Thread } from "@/engine/dmc"
import { base64ToCells } from "@/engine/publish"
import { patternImageData } from "@/engine/render"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { paths } from "@/lib/routes"
import { useHead } from "@/lib/head"
import { breadcrumb, graph, person, piece } from "@/lib/schema"
import { SITE_NAME } from "@/lib/site"

/**
 * One published piece: the work, then what you can do with it, then what people
 * said about it.
 *
 * Everything used to sit in a column beside the picture — chart preview, five
 * options, download, shopping list — and the taller that column grew the more
 * empty cloth was left under the pattern. It grew with the number of colours, so
 * the pieces with the most to look at were the ones that read worst. Both of
 * those are now behind a button, which leaves a single column: the work, two
 * things you might want, and the conversation.
 *
 * The pattern is rebuilt from the stored grid rather than shown as a fixed
 * image — that is the whole reason the grid is stored at all. It means this page
 * can draw it crisp at any size, list every thread with its real stitch count,
 * and render a full printable chart, from 30 KB of data.
 */
/** Widest the grid is drawn, and tallest — whichever binds first. */
const MAX_ART_WIDTH = 620
const MAX_ART_HEIGHT = 640

export default function Piece() {
  const { t, lang } = useI18n()
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const postId = Number(id)

  const [post, setPost] = useState<api.PostDetail | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")
  const [downloadFailed, setDownloadFailed] = useState(false)
  const [chartOpen, setChartOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [removeFailed, setRemoveFailed] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
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

  // What kind of post this is, read once. Declared up here because both the delete
  // handler and the head below need it — and `homeGallery` was being used forty
  // lines above its own declaration, which works and reads like a mistake.
  const isPhoto = post?.kind === "photo"
  // Back to the gallery this piece actually lives in. A photo post used to send
  // people to the charts, the one gallery it is not in — and likewise after
  // deleting it, where landing among strangers' charts reads as "did that work?".
  // The not-found branch keeps pointing at the charts: there is no post there, so
  // there is nothing to ask.
  const homeGallery = isPhoto ? paths.galleryStitches : paths.gallery

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
    // Null on a photo post, where there is no chart to rebuild — `cells` and
    // `threadCodes` arrive as null together. Every use of `pattern` below is
    // guarded on that, and the page renders without a grid rather than refusing
    // to render at all.
    if (!storedCells || !width || !height || !threadCodes) return null

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

  /**
   * Delete, for the author or an admin.
   *
   * `confirm` rather than a bespoke dialog: this is irreversible and takes the
   * grid, the photo and the conversation with it, and the browser's own prompt is
   * the one thing nobody clicks through by accident. The server checks ownership
   * regardless — the button only decides what to show.
   */
  const remove = async () => {
    if (!post || removing) return
    const own = user?.id === post.author.id
    if (!window.confirm(own ? t.piece.removeConfirm : t.piece.removeConfirmOther)) return
    setRemoving(true)
    setRemoveFailed(false)
    try {
      await api.deletePost(post.id)
      void navigate(homeGallery, { replace: true })
    } catch {
      setRemoveFailed(true)
      setRemoving(false)
    }
  }

  /**
   * This piece's own head, and its own share image.
   *
   * Every published piece used to take the site's default title and the site's default
   * card, so a link to one said nothing about the piece — which is exactly backwards,
   * since a piece is the only thing here anybody has a reason to send to somebody else.
   *
   * The image is drawn by the server from the stored grid (see api/sharecard.py): a
   * scraper does not run this JavaScript, so the picture cannot come from the canvas
   * three lines below it.
   */
  //
  // A photo post has no measurements to quote, and quoting them anyway is how you
  // get "null × null stitches in 0 DMC threads" in a link preview. It gets a head
  // about what it is: somebody's finished work.
  // Pulled out of the call below because the description is wanted twice — once as
  // the meta tag a person reads in a result, once inside the graph a machine reads.
  // Two nested ternaries producing the same sentence would eventually drift apart.
  const headTitle = post
    ? isPhoto
      ? t.head.pieceStitch.title(post.title, post.author.displayName)
      : t.head.piece.title(post.title, post.author.displayName)
    : t.notFound.title
  const headDescription = post
    ? isPhoto || post.width === null || post.height === null || !post.threadCodes
      ? t.head.pieceStitch.description(post.author.displayName)
      : t.head.piece.description(
          post.author.displayName,
          post.width,
          post.height,
          post.threadCodes.length,
        )
    : t.notFound.body

  useHead({
    title: headTitle,
    description: headDescription,
    canonicalPath: `/piece/${postId}`,
    image: post ? `/api/posts/${postId}/share.png` : undefined,
    type: "article",
    /**
     * The work, its picture and its maker.
     *
     * This is the one page on the site where structured data still buys something
     * Google actively shows: image metadata puts a creator and a licence link
     * against the picture in Google Images, which for a gallery is the surface
     * that matters. The share card is used as the image because it is a real file
     * a crawler can fetch without running any of this JavaScript.
     *
     * Nothing at all when the piece is missing — a graph describing a CreativeWork
     * that 404s is worse than silence.
     */
    jsonLd: post
      ? graph(
          piece({
            id: post.id,
            title: post.title,
            description: headDescription,
            authorId: post.author.id,
            authorName: post.author.displayName,
            createdAt: post.createdAt,
            likeCount: post.likeCount,
            imagePath: `/api/posts/${postId}/share.png`,
            lang,
          }),
          person(post.author.id, post.author.displayName),
          breadcrumb([
            { name: SITE_NAME, path: paths.home },
            { name: t.nav.gallery, path: homeGallery },
            { name: post.title, path: paths.piece(post.id) },
          ]),
        )
      : undefined,
    // A piece that is gone must not be indexed under a canonical pointing at itself.
    // People delete their work, and the URL stays in the wild — without this the page
    // answered with the home page's title and description while still claiming to be
    // the canonical version of a piece that no longer exists, which is the definition
    // of a soft 404. `state` is "failed" only once the fetch has actually come back,
    // so a slow connection is not mistaken for a missing piece.
    noindex: state === "failed",
  })

  // How wide to draw the grid: as wide as the column allows, unless that would
  // make a tall pattern taller than the screen wants to hold. The cloth then wraps
  // whatever this comes to, so there is never a margin of unused aida.
  const artWidth = pattern
    ? Math.round(Math.min(MAX_ART_WIDTH, (MAX_ART_HEIGHT * pattern.width) / pattern.height))
    : MAX_ART_WIDTH

  if (state === "loading") {
    return <p className="text-center text-cocoa py-24">{t.gallery.loading}</p>
  }
  const mine = Boolean(post && user && (user.id === post.author.id || user.isAdmin))

  // A photo post is a whole post with no chart in it, so the absence of `pattern`
  // is not a missing piece any more — it is what that kind of post looks like. But
  // a *chart* post whose grid could not be rebuilt is genuinely broken, and still
  // says so rather than showing a page with a hole where the chart goes.
  if (state === "failed" || !post || (post.kind === "pattern" && !pattern)) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-4">
        <p className="text-coral-deeper m-0">{t.piece.notFound}</p>
        <Button asChild variant="secondary">
          <Link to={paths.gallery}>{t.piece.backToGallery}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-20 py-10">
      <Link
        to={homeGallery}
        className="inline-flex items-center min-h-11 text-[14px] font-bold text-stone hover:text-coral-deep transition-colors"
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
              className="inline-flex items-center gap-2.5 min-h-11 group shrink-0"
            >
              <StitchAvatar seed={post.author.id} size={36} />
              <span className="text-[15.5px] font-bold text-cocoa group-hover:text-coral-deep transition-colors">
                {t.gallery.by(post.author.displayName)}
              </span>
            </Link>
            {/* Outside the link: the flower carries its own tooltip, and nesting
                one focusable thing inside another is how you get a tab stop that
                goes somewhere nobody asked for. */}
            {post.author.isAdmin && <AdminFlower className="text-[15px] shrink-0" />}
            {/* No separator between the name and the figures: it wraps to its own
                line on a phone and leaves a dot dangling at the end of the
                author. The change of face already separates them. */}
            {/* Bare dimensions, not `gallery.stitches`: that helper suffixes
                "st"/"pts", which read as a second stitch count directly beside
                "1 963 points à broder". The colour count comes from the threads
                we could actually resolve, so it can never disagree with the list
                below it. */}
            {pattern && (
              <span className="font-mono text-[12.5px] text-stone">
                {pattern.width} × {pattern.height} · {t.gallery.colors(pattern.threads.length)}{" "}
                · {t.converter.size.total(pattern.stitched)}
              </span>
            )}
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

      {/* One column. The photo, then the grid on cloth, and nothing beside them
          to leave a hole when it runs short. */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {/* On a chart post the photo is evidence beside the grid, so it is cropped
            to a band. On a photo post it IS the piece: cropping the only thing on
            the page would cut off the work somebody is showing. */}
        {post.hasPhoto && (
          <img
            src={api.photoUrl(post)}
            alt={t.piece.photoAlt(post.title)}
            className={
              isPhoto
                ? "w-full max-w-[720px] rounded-card shadow-card object-contain max-h-[70vh]"
                : "w-full max-w-[720px] rounded-card shadow-card object-cover max-h-[460px]"
            }
          />
        )}
        {pattern ? (
          <>
        {/* The cloth wraps the grid rather than stretching to the column.
            A 720px panel holding a 560px canvas framed every pattern in 112px of
            bare aida, and a portrait one in more — so the piece looked lost in its
            own mount, and the two buttons ended up a long way from the thing they
            act on.
            The weave is drawn only once its pitch is known — one square per
            stitch. Until then it stays plain cloth, which is better than a wrong
            pitch showing through the motif's bare cells. */}
        <div
          className={`${clothPitch > 0 ? "aida" : ""} [--aida-ink:.09] bg-aida rounded-card p-5 shadow-[inset_0_2px_10px_rgba(83,63,42,.09)] w-fit max-w-full`}
          style={clothPitch > 0 ? { ["--aida-size" as string]: `${clothPitch}px` } : undefined}
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={t.piece.patternAlt(post.title)}
            width={pattern.width}
            height={pattern.height}
            // Sized on both axes so a tall pattern is bounded by its height
            // instead of by its width, which is what left the wide margins.
            style={{ imageRendering: "pixelated", width: artWidth, maxWidth: "100%" }}
            className="block h-auto rounded-[6px]"
          />
        </div>
        <p className="font-hand text-sm text-sand text-center m-0">{t.piece.patternNote}</p>

        {/* Two things, and the coral one is the chart: taking the pattern is why
            people come here. Seeing it on a cushion is a nice thought. */}
        <div className="flex flex-wrap justify-center gap-3 mt-1">
          <Button onClick={() => setChartOpen(true)}>{t.piece.getChart}</Button>
          <Button variant="secondary" onClick={() => setProductsOpen(true)}>
            {t.piece.seeStitched}
          </Button>
        </div>
          </>
        ) : (
          /* No chart, and it says so. A page that simply lacked the button every
             other piece has would read as a fault rather than as a fact about
             this one. */
          <>
            <p className="font-hand text-sm text-sand text-center m-0">{t.piece.stitchNote}</p>
            <p className="text-[14.5px] text-clay text-center max-w-[420px] m-0">
              {t.piece.noChart}
            </p>
          </>
        )}

        {/* The way out — the author's, or an admin's. Set apart from the two
            things a visitor came for, and quiet: a delete button that looks like
            an action invites the click it must not get. */}
        {/* Reporting, for anyone signed in who is not looking at their own work.
            Quiet, and beside the other administrative way out rather than among
            the things a visitor came here to do. */}
        {user && !mine && (
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center min-h-11 px-2 text-[13.5px] font-bold text-stone hover:text-coral-deep transition-colors cursor-pointer mt-1"
          >
            {t.report.open}
          </button>
        )}

        {mine && (
          <div className="flex flex-col items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => void remove()}
              disabled={removing}
              className="inline-flex items-center min-h-11 px-2 text-[13.5px] font-bold text-stone hover:text-coral-deep transition-colors cursor-pointer disabled:cursor-not-allowed disabled:text-edge-5"
            >
              {removing ? t.piece.removing : t.piece.remove}
            </button>
            {removeFailed && (
              <p role="alert" className="text-[13.5px] text-coral-deeper m-0">
                {t.piece.removeFailed}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Under the picture and above the conversation: the work, then what you can
          do with it, then what it is made of, then what people said about it. */}
      {pattern && <PieceThreads pattern={pattern} />}

      <Comments postId={postId} />

      {/* Both take a Pattern, and neither has anything to show without one. */}
      {pattern && (
        <>
          <ChartDialog
            open={chartOpen}
            onClose={() => setChartOpen(false)}
            pattern={pattern}
            onError={() => setDownloadFailed(true)}
          />
          <ProductDialog
            open={productsOpen}
            onClose={() => setProductsOpen(false)}
            pattern={pattern}
          />
        </>
      )}
      <ReportDialog postId={postId} open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
