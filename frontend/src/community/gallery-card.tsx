import { Link } from "react-router-dom"

import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { labDist2 } from "@/engine/color"
import { findThread, type Thread } from "@/engine/dmc"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"
import { CrossMark } from "@/components/brand/icons"
import { useAuth } from "./auth-context"

/**
 * A piece in the gallery.
 *
 * The preview sits on aida cloth, the way it does on the converter's canvas —
 * the pattern is stitches, and showing it floating on white loses the one cue
 * that says what it is for.
 *
 * The palette strip resolves DMC references to colours locally: the chart is
 * already in the bundle, so the API sends five codes rather than five hex
 * values, and the card still paints the right swatches.
 */
/**
 * How far apart two swatches must be to be worth showing both, as a squared Lab
 * distance.
 *
 * 26, from measuring the pairs that actually caused the problem rather than
 * guessing: DMC 310 Black to 3371 Black Brown is 23.7, 310 to 3799 Pewter is
 * 24.3, and at fourteen pixels each of those reads as "black, and black again".
 * Two greens (367 to 3363) are 9.7 apart and two whites (B5200 to Ecru) 9.0, so
 * they collapse too, which is the point. What survives is 70 and up — green to
 * blue is 70.9, red to blue 78.2 — so the five swatches are five different
 * colours rather than five entries from the same list.
 */
const APART = 26 * 26
/** How many swatches the strip shows. */
const SWATCHES = 5

/**
 * The colours a piece is actually made of.
 *
 * The server sends the references most-stitched first, which on its own is not
 * enough: a piece whose two commonest threads are both nearly black spends two of
 * its five swatches saying "black" and never gets to the green. So each candidate
 * has to be visibly different from the ones already taken. If that leaves fewer
 * than five, the skipped ones come back to fill the strip rather than leaving it
 * short — a near-duplicate is better than a gap.
 */
function principalThreads(codes: string[]): Thread[] {
  const resolved = codes.map((code) => findThread(code)).filter((t): t is Thread => Boolean(t))

  const chosen: Thread[] = []
  const skipped: Thread[] = []
  for (const thread of resolved) {
    if (chosen.length === SWATCHES) break
    if (chosen.every((taken) => labDist2(taken.lab, thread.lab) > APART)) chosen.push(thread)
    else skipped.push(thread)
  }
  for (const thread of skipped) {
    if (chosen.length === SWATCHES) break
    chosen.push(thread)
  }
  return chosen
}

/** Near-white threads need a hairline or the swatch disappears into the card. */
function isPale(rgb?: readonly [number, number, number]): boolean {
  if (!rgb) return false
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] > 232
}

export function GalleryCard({
  post,
  onLike,
  onDelete,
}: {
  post: api.PostCard
  onLike: (id: number) => void
  onDelete?: (id: number) => void
}) {
  const { t } = useI18n()
  const { user } = useAuth()
  const mine = user && (user.id === post.author.id || user.isAdmin)
  const shown = principalThreads(post.palette)
  const rest = post.threadCount - shown.length

  return (
    <article className="bg-blanc rounded-[20px] shadow-card-sm p-3.5 flex flex-col gap-3 transition-shadow hover:shadow-lift">
      {/* Same frame the placeholder gallery used: aida weave, running-stitch
          dashed border, 230px tall. The dashes are the design's way of saying
          "this lands on cloth", and they were the piece I had dropped. */}
      <Link to={`/piece/${post.id}`} className="block">
        <div className="aida [--aida-size:14px] [--aida-ink:.07] bg-[#F7F1E5] border-2 border-dashed border-edge-5 rounded-[14px] p-2 h-[230px] overflow-hidden">
          {post.hasPhoto || post.hasThumb ? (
            <img
              src={post.hasPhoto ? api.photoUrl(post) : api.thumbUrl(post)}
              alt={post.title}
              loading="lazy"
              style={post.hasPhoto ? undefined : { imageRendering: "pixelated" }}
              className={`w-full h-full rounded-[8px] ${
                post.hasPhoto ? "object-cover" : "object-contain"
              }`}
            />
          ) : (
            /* No picture stored. Bare aida beats a broken-image icon, and the
               palette strip below still says what the piece is made of. */
            <div className="w-full h-full grid place-items-center">
              <span className="font-hand text-sm text-sand">{t.gallery.noPreview}</span>
            </div>
          )}
        </div>
      </Link>

      {/* One text block: who and what, then the threads it took — the tight
          pairing the original had, with the author and heart folded in. */}
      <div className="px-1">
        <div className="flex items-center gap-2.5">
          <Link
            to={`/brodeur/${post.author.id}`}
            className="shrink-0 size-11 -m-1 flex items-center justify-center"
            aria-label={post.author.displayName}
          >
            <StitchAvatar seed={post.author.id} size={36} />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/piece/${post.id}`} className="block">
              <h3 className="font-medium text-[16.5px] leading-tight truncate hover:text-coral-deep transition-colors">
                {post.title}
              </h3>
            </Link>
            <Link
              to={`/brodeur/${post.author.id}`}
              className="block text-[13px] text-stone truncate hover:text-coral-deep transition-colors"
            >
              {t.gallery.by(post.author.displayName)}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => onLike(post.id)}
            aria-label={t.gallery.likeAria(post.title)}
            aria-pressed={post.liked}
            className={`flex items-center gap-1.5 rounded-full px-3 min-h-11 shrink-0 cursor-pointer transition-colors ${
              post.liked
                ? "bg-coral-wash text-coral-deep"
                : "bg-linen text-cocoa hover:bg-coral-wash"
            }`}
          >
            <span aria-hidden="true">{post.liked ? "♥" : "♡"}</span>
            <span className="text-[12.5px] font-extrabold">{post.likeCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 mt-2.5" aria-hidden="true">
          {shown.map((thread) => (
            <span
              key={thread.num}
              title={`DMC ${thread.num} · ${thread.name}`}
              className="size-3.5 rounded"
              style={{
                background: thread.hex,
                // A near-white thread needs an edge or it vanishes into the card.
                boxShadow: isPale(thread.rgb) ? "inset 0 0 0 1px var(--color-edge-4)" : undefined,
              }}
            />
          ))}
          {rest > 0 && <span className="text-[12px] text-sand ml-0.5">{t.gallery.more(rest)}</span>}
        </div>
      </div>

      <div className="flex gap-1.5 px-1 pb-1 flex-wrap items-center">
        <span className="inline-flex items-center min-h-10 text-[12.5px] font-extrabold bg-linen rounded-full px-3 text-cocoa">
          {t.gallery.stitches(post.width, post.height)}
        </span>
        <span className="inline-flex items-center min-h-10 text-[12.5px] font-extrabold bg-linen rounded-full px-3 text-cocoa">
          {t.gallery.colors(post.threadCount)}
        </span>
        <Link
          to={`/piece/${post.id}`}
          className="inline-flex items-center min-h-10 text-[12.5px] font-extrabold text-coral-deep bg-coral-wash rounded-full px-3 hover:bg-coral hover:text-blanc transition-colors"
        >
          {t.gallery.getPattern}
        </Link>
        {mine && onDelete && (
          // A 10x20 target for the one irreversible thing on the card. It is now
          // 36px square with the glyph still small — big enough for a thumb to
          // find on purpose, and no louder than it was.
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            aria-label={t.gallery.deleteAria(post.title)}
            className="ml-auto size-10 -my-2 shrink-0 flex items-center justify-center rounded-full text-stone hover:text-coral-deep hover:bg-coral-wash transition-colors cursor-pointer"
          >
            <CrossMark size={11} />
          </button>
        )}
      </div>
    </article>
  )
}
