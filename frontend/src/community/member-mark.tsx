import { MARK_SLUGS, markSlug, markSrc } from "@/components/brand/marks"
import { cn } from "@/lib/utils"

/** How many squares across a mark is stored — see scripts that build them. */
const MARK_PX = 56

/**
 * A member's mark, wherever a member is named.
 *
 * One component for all of them — the header, a gallery card, a comment, the
 * author line on a piece, a profile — because until now there were five copies of
 * the same three lines and every one of them was wrong in the same way: they drew
 * the old generated mark from the member's id and never looked at `icon`. Somebody
 * could pick a mark, see it confirmed on their account page, and find their posts
 * still signed with something else. The picker worked; nothing downstream of it
 * did.
 *
 * The drawn mark is gone with them. It was a five-by-five sampler composed from
 * the DMC chart, and it was a good idea for as long as there was nothing to
 * choose; beside seventeen photographs quantised to real threads it read as a
 * placeholder, and keeping both meant a member's signature changed shape
 * depending on which of two code paths rendered it.
 */
export function MemberMark({
  user,
  size = 36,
  className,
}: {
  /** Anything carrying the two fields — a PostCard author, a comment author, a
   *  profile, the signed-in member. */
  user: { id: number; icon?: string | null }
  size?: number
  className?: string
}) {
  const slug = markSlug(user.icon) ?? fallbackSlug(user.id)
  // A hem of bare cloth, proportional so it survives 26px and 80px alike.
  const hem = Math.max(2, Math.round(size * 0.08))

  return (
    <span
      // Stitching is never full-bleed. A finished piece sits on a square of cloth
      // with a margin of bare weave around it, and that margin is most of what
      // makes it read as embroidery rather than as a picture — the mark this
      // replaced knew it, and said so: "the ring of bare cloth reads as a hemmed
      // edge rather than a full-bleed tile". The photographs arrived without it and
      // landed on the page looking stuck on.
      //
      // It also does the job a mount does when a print is framed: the aida sits
      // between a saturated 56-square photograph and the cream page, so the two
      // stop arguing. Which is why the answer here is NOT to desaturate them. Those
      // colours are real DMC threads — the one true thing about these images — and
      // dulling them to make them fit would have thrown away the argument the whole
      // site is built on.
      style={{ width: size, height: size, padding: hem }}
      className={cn(
        "shrink-0 inline-flex bg-aida rounded-[24%] box-border overflow-hidden",
        className,
      )}
    >
      <img
        src={markSrc(slug)}
        alt=""
        width={size - hem * 2}
        height={size - hem * 2}
        loading="lazy"
        decoding="async"
        // `pixelated` only when the mark is being made BIGGER than its 56 squares.
        //
        // It was applied at every size, and below 56 that is the one place it does
        // harm: reducing with nearest-neighbour throws away half the rows outright,
        // so a 56-square photograph shown at 32 came out aliased and hard-edged.
        // That harshness is most of what made these read as stuck onto the page —
        // more than their saturation, which was the suspect. Letting the browser
        // resample smoothly below 56 keeps the same colours and stops the jagging;
        // above it, nearest-neighbour is right, and keeps the stitches square
        // instead of smearing them into a blurred photograph.
        //
        // The hairline is the same trick the gallery's palette strip uses on a pale
        // thread: without it a mark whose edges are near-white dissolves into the
        // cloth it is mounted on, and the hem stops reading as a hem.
        style={{
          imageRendering: size - hem * 2 >= MARK_PX ? "pixelated" : "auto",
          boxShadow: "inset 0 0 0 1px var(--color-edge-4)",
        }}
        className="w-full h-full rounded-[14%] object-cover"
      />
    </span>
  )
}

/**
 * The mark for a member who has none.
 *
 * In practice nobody: the server gives one at sign-up and hands one to anyone who
 * was there before the picker existed. This is for the third case — a stored value
 * that no longer names a mark, because a slug was retired — where showing
 * *something* stitched beats a broken image.
 *
 * Derived from the id rather than drawn at random, so it is at least stable per
 * member between two page loads. It is deliberately not stable across a change to
 * the list of marks, which is a real limitation and an acceptable one: a member
 * who cares which mark is theirs has a picker, and this is the answer for the ones
 * who never opened it.
 */
function fallbackSlug(id: number): string {
  // FNV-1a over the id's digits. Small, stable, and picking a picture is not a
  // security boundary.
  let h = 0x811c9dc5
  const seed = String(id)
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return MARK_SLUGS[(h >>> 0) % MARK_SLUGS.length]
}
