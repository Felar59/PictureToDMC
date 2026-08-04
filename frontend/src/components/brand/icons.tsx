import { cn } from "@/lib/utils"

/**
 * The "stitched X" icon family — built from the same grammar as the craft:
 * rounded thread strokes, pixel squares, dashed running-stitch lines.
 */

/** A single cross stitch. The product's core mark after the heart. */
export function StitchMark({ size = 34, className }: { size?: number; className?: string }) {
  const bar = size * 1.12
  const thickness = Math.max(5, size * 0.2)
  const common = {
    position: "absolute" as const,
    top: size * 0.41,
    left: -(bar - size) / 2,
    width: bar,
    height: thickness,
    borderRadius: thickness / 2,
  }
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div style={{ ...common, background: "#C9463C", transform: "rotate(45deg)" }} />
      <div style={{ ...common, background: "#E0574B", transform: "rotate(-45deg)" }} />
    </div>
  )
}

/** Downward arrow built from a thread stem and a triangle. */
export function DownloadGlyph({ color = "#FFF8F3" }: { color?: string }) {
  return (
    <span className="inline-flex flex-col items-center gap-[2px]" aria-hidden="true">
      <span className="block w-1 h-2 rounded-sm" style={{ background: color }} />
      <span
        className="block w-0 h-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `7px solid ${color}`,
        }}
      />
    </span>
  )
}

/** Upward arrow — same grammar, flipped. */
export function UploadGlyph({ color = "#6B5A48" }: { color?: string }) {
  return (
    <span className="inline-flex flex-col items-center gap-[2px]" aria-hidden="true">
      <span
        className="block w-0 h-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: `7px solid ${color}`,
        }}
      />
      <span className="block w-1 h-2 rounded-sm" style={{ background: color }} />
    </span>
  )
}

/**
 * A running-stitch rule with an arrowhead — "this becomes that".
 *
 * Boxed tightly around the mark (no margin offsets) so a caller can rotate it
 * to point down when the two things it links end up stacked.
 */
export function ThreadArrow({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center shrink-0", className)} aria-hidden="true">
      <span className="block w-8 border-t-[3px] border-dashed border-coral-deep" />
      <span
        className="block w-0 h-0 -ml-px"
        style={{
          borderTop: "7px solid transparent",
          borderBottom: "7px solid transparent",
          borderLeft: "10px solid #C9463C",
        }}
      />
    </span>
  )
}

/**
 * Four stitches with one singled out — "this thread on its own".
 *
 * Not a magnifier, an eye, or a filter funnel: none of those mean *one of
 * several colours, alone*, and this audience gets one guess. Four squares where
 * exactly one is inked says it without a caption, and it is the same pixel-square
 * grammar as the rest of the family.
 */
export function SoloStitch({ active = false }: { active?: boolean }) {
  return (
    <span
      className="grid grid-cols-2 gap-[2px] shrink-0"
      style={{ width: 16, height: 16 }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "block size-[7px] rounded-[2px] transition-colors",
            i === 0
              ? active
                ? "bg-golden-deep"
                : "bg-cocoa group-hover:bg-bark"
              : active
                ? "bg-golden-edge"
                : "bg-edge-5 group-hover:bg-taupe",
          )}
        />
      ))}
    </span>
  )
}

/** The colour wheel on a thread row — "swap this for any DMC shade". */
export function ColorWheel({ size = 12 }: { size?: number }) {
  return (
    <span
      className="block rounded-full"
      style={{
        width: size,
        height: size,
        background: "conic-gradient(#E0574B,#E3B04B,#6FAE7C,#7FB5C8,#A387C6,#E0574B)",
      }}
      aria-hidden="true"
    />
  )
}
