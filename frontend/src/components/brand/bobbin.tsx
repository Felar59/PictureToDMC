import { cn } from "@/lib/utils"

/**
 * A wound floss bobbin: highlight along the top, shade along the bottom.
 * This is how every DMC color is shown — never a flat square, never a dot.
 */
export function Bobbin({
  hex,
  width = 28,
  height = 38,
  radius = 8,
  className,
}: {
  hex: string
  width?: number
  height?: number
  radius?: number
  className?: string
}) {
  return (
    <div
      className={cn("bobbin-sm shrink-0", className)}
      style={{ width, height, borderRadius: radius, background: hex }}
      aria-hidden="true"
    />
  )
}
