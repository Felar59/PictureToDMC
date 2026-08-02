import { cn } from "@/lib/utils"

/** Natural aspect of Icon.png (888 x 913) — keeps the hoop from squashing. */
const MARK_RATIO = 913 / 888

/**
 * The brand mark: an embroidery hoop with a threaded needle.
 *
 * Served from /icon-256.png rather than the 889 KB original — it never
 * renders above ~120px, and the source stays at /Icon.png for anything
 * that needs full resolution later (og:image, print).
 *
 * Decorative by default: every place it appears, the wordmark or an
 * aria-label next to it already carries the name.
 */
export function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/icon-256.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={Math.round(size * MARK_RATIO)}
      draggable={false}
      className={cn("shrink-0 select-none object-contain", className)}
      style={{ width: size, height: "auto" }}
    />
  )
}

/** The wordmark. The handwritten "to" is the human in the middle of the conversion. */
export function Wordmark({ size = 21, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("font-display font-semibold text-ink whitespace-nowrap", className)}
      style={{ fontSize: size, letterSpacing: "-.3px" }}
    >
      Picture{" "}
      <span className="font-hand font-medium text-coral" style={{ fontSize: size * 0.76 }}>
        to
      </span>{" "}
      DMC
    </span>
  )
}

const VARIANTS = {
  footer: { mark: 26, word: 17, gap: "gap-2.5" },
  nav: { mark: 42, word: 21, gap: "gap-2.5" },
  card: { mark: 58, word: 30, gap: "gap-3" },
  hero: { mark: 120, word: 58, gap: "gap-5" },
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
      <Wordmark size={v.word} />
    </span>
  )
}
