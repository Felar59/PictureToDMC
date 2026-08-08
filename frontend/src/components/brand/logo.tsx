import { cn } from "@/lib/utils"

import { SITE_NAME_LINES } from "@/lib/site"

/** Natural aspect of Icon.png (888 x 913) — keeps the hoop from squashing. */
const MARK_RATIO = 913 / 888

/**
 * The brand mark: an embroidery hoop with a threaded needle.
 *
 * WebP, not PNG. It appears in the header on every page, and PNG is the wrong
 * container for a soft-shaded illustration — the same 256px image is 98 KB as
 * PNG and 22 KB as WebP. 256px covers the largest use (104px on the 404 page)
 * at 2x DPR. The 889 KB master stays in src/assets and is never shipped.
 *
 * Decorative by default: everywhere it appears, the wordmark or a neighbouring
 * aria-label already carries the name.
 */
export function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/icon-256.webp"
      alt=""
      aria-hidden="true"
      width={size}
      height={Math.round(size * MARK_RATIO)}
      draggable={false}
      decoding="async"
      className={cn("shrink-0 select-none object-contain", className)}
      style={{ width: size, height: "auto" }}
    />
  )
}

/**
 * The wordmark: a place, and someone telling you what is in it.
 *
 *     LA VALLÉE
 *     des points de croix
 *
 * The two lines differ by *voice*, not only by size. That is the one deliberate
 * risk here, and it is the old mark's own idea carried forward rather than thrown
 * away with the name: "Picture *to* DMC" set its middle word in the handwritten
 * face and the comment called it "the human in the middle of the conversion".
 * Large display caps over small tracked-out caps is what any tool would produce
 * for a two-line lockup; a change of hand is what makes this one this site's.
 *
 * Upper case on the first line because a valley is a place and places go on
 * signs — and because it turns the É, which French typography usually fumbles,
 * into the most distinctive shape in the mark.
 *
 * The second line is `quill`, not coral. Coral is the only colour on this site
 * permitted to ask for a click, and spending it on a logo — as the old wordmark
 * did — makes every real button worth slightly less. Quill is what every
 * handwritten aside already uses.
 *
 * Legibility, since a good share of the audience is sixty-five and not confident
 * with a screen: Shantell at 13–15px is already established here (`font-hand
 * text-quill` runs above most headings), so this is not a new bet on a script
 * face — it is the same one, in the same place, at the same size.
 */
export function Wordmark({
  size = 22,
  lines = 2,
  className,
}: {
  /** Cap size of the first line. The second is derived, never set. */
  size?: number
  /** 1 drops the descriptor. Not a truncation — the short name is a real name. */
  lines?: 1 | 2
  className?: string
}) {
  return (
    <span className={cn("inline-flex flex-col justify-center whitespace-nowrap", className)}>
      <span
        className="font-display font-semibold text-ink"
        style={{ fontSize: size, letterSpacing: ".06em", lineHeight: 0.95 }}
      >
        {SITE_NAME_LINES.place}
      </span>
      {lines === 2 && (
        /*
         * 0.42 of the first line, but never below 12px.
         *
         * The ratio alone put this at 9.2px in the header, which is a script face
         * asking to be decoded rather than read — and a good share of the people
         * this site is for are sixty-five and reading it on a laptop screen at
         * arm's length. Everywhere else on the site the handwritten voice sits at
         * 13–15px; the floor is what keeps this the same bet rather than a new one.
         *
         * The floor only binds in the header. At card and hero sizes the ratio is
         * already well clear of it, so the lockup keeps its proportions where it
         * has room and trades them for legibility only where it does not.
         */
        <span
          className="font-hand text-quill"
          style={{
            fontSize: Math.max(12, size * 0.42),
            lineHeight: 1.15,
            letterSpacing: ".01em",
          }}
        >
          {SITE_NAME_LINES.of}
        </span>
      )}
    </span>
  )
}

/**
 * Mark plus words, sized so the two read as one object.
 *
 * `word` is solved from `mark` rather than picked: the stacked block measures
 * about 1.4 x its own cap size, so a first line at ~0.6 of the hoop's diameter
 * puts the block's top and bottom against the hoop's, which is what stops a
 * lockup looking like two things that happen to be adjacent.
 */
const VARIANTS = {
  footer: { mark: 26, word: 16, lines: 1 as const, gap: "gap-2.5" },
  nav: { mark: 38, word: 22, lines: 2 as const, gap: "gap-3" },
  card: { mark: 58, word: 32, lines: 2 as const, gap: "gap-3.5" },
  hero: { mark: 116, word: 62, lines: 2 as const, gap: "gap-5" },
} as const

export function Logo({
  variant = "nav",
  withMark = true,
  className,
}: {
  variant?: keyof typeof VARIANTS
  withMark?: boolean
  className?: string
}) {
  const v = VARIANTS[variant]
  return (
    <span className={cn("inline-flex items-center", v.gap, className)}>
      {withMark && <BrandMark size={v.mark} />}
      <Wordmark size={v.word} lines={v.lines} />
    </span>
  )
}
