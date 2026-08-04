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

/**
 * Which corner your picture's top-left ends up in, after a turn.
 *
 * The stand-in shown on the orientation tiles before there is a photograph to show.
 * Four squares with one inked, and the inked one moves round the corners with the
 * angle — 0 top-left, 90 top-right, 180 bottom-right, 270 bottom-left. It is the
 * family's pixel-square vocabulary rather than an arrow, and it is honest about what
 * a rotation does to a picture.
 *
 * This replaced an arrow glyph that had two faults worth remembering: its arrowhead
 * reached x=15.1 with a 1.9 round-capped stroke inside a 16-wide box, so the tip was
 * clipped; and an upward chevron at the top right of a square reads as "up", not as
 * "clockwise". Neither was visible at 15px, which is its own indictment.
 */
export function CornerStitch({ deg = 0, className }: { deg?: number; className?: string }) {
  // Index of the inked square in a 2x2 laid out top-left, top-right, bottom-left,
  // bottom-right — so the ink travels clockwise as the angle grows.
  const inked = [0, 1, 3, 2][(((Math.round(deg / 90) % 4) + 4) % 4)]
  return (
    <span
      className={cn("grid grid-cols-2 gap-[3px]", className)}
      style={{ width: 29, height: 29 }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "block size-[13px] rounded-[2px]",
            i === inked ? "bg-cocoa" : "bg-edge-5",
          )}
        />
      ))}
    </span>
  )
}

/**
 * A sheet of paper coming down out of a tray — "save this to your machine".
 *
 * A page with a corner turned, and an arrow into it. DownloadGlyph above is the
 * bare arrow used inside the coral button, where a page outline would crowd; this
 * is the one for a button that has room and wants to say *what* is being saved.
 */
export function ChartDownloadGlyph({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {/* The sheet, with the top-right corner folded. */}
      <path
        d="M11.4 2.2H5.6A1.6 1.6 0 0 0 4 3.8v12.4a1.6 1.6 0 0 0 1.6 1.6h8.8a1.6 1.6 0 0 0 1.6-1.6V6.8l-4.6-4.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 2.4v3.6a1 1 0 0 0 1 1h3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* Down into the sheet. */}
      <path
        d="M10 9.4v4.4m0 0L8.2 12m1.8 1.8L11.8 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * A hoop with a thread leaving it — "put this in the gallery".
 *
 * Not an arrow out of a box, which is the platform's share icon and means "send
 * this elsewhere". This piece is not going elsewhere; it is going up on the wall
 * with everyone else's, and the hoop is the object that says so.
 */
export function ShareHoopGlyph({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <circle cx="9" cy="11" r="6.1" stroke="currentColor" strokeWidth="1.7" />
      {/* The tightening screw at the top of a real hoop. */}
      <path
        d="M9 4.9V2.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <rect
        x="7.5"
        y="1.1"
        width="3"
        height="2.2"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* One cross stitch inside, because that is what is in the hoop. */}
      <path
        d="M7.1 9.1l3.8 3.8M10.9 9.1l-3.8 3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
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
