import { cn } from "@/lib/utils"
import { StitchMark } from "./icons"

/**
 * Stands in for a photo that doesn't exist yet — the real counterpart of the
 * design's <image-slot>. It's a piece of aida cloth, so an empty slot still
 * reads as "your picture will land on fabric" rather than as a broken image.
 */
export function PhotoSlot({
  caption,
  radius = 16,
  className,
  children,
}: {
  caption?: string
  radius?: number
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "aida [--aida-size:14px] [--aida-ink:.07] bg-[#F7F1E5] border-2 border-dashed border-edge-5",
        "flex flex-col items-center justify-center gap-2.5 text-center p-4 overflow-hidden",
        className,
      )}
      style={{ borderRadius: radius }}
    >
      {children ?? (
        <>
          <StitchMark size={26} />
          {caption && <span className="font-hand text-[13px] text-sand leading-snug">{caption}</span>}
        </>
      )}
    </div>
  )
}
