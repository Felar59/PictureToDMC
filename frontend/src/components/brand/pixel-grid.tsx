import type { Px } from "@/lib/pixel-art"

type PixelGridProps = {
  pixels: Px[]
  cols: number
  /** Cell edge in px. */
  size: number
  gap?: number
  radius?: number
  className?: string
}

/** Renders a pixel map as a CSS grid — the design's `sc-for` blocks. */
export function PixelGrid({ pixels, cols, size, gap = 0.5, radius = 2, className }: PixelGridProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gap: `${gap}px`,
      }}
    >
      {pixels.map((p) => (
        <div
          key={p.k}
          style={{ width: size, height: size, borderRadius: radius, background: p.c }}
        />
      ))}
    </div>
  )
}
