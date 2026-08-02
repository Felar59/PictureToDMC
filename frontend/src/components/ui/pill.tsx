import type * as React from "react"

import { cn } from "@/lib/utils"

type PillProps = React.ComponentProps<"button"> & { selected?: boolean }

/** A selectable chip: ink when chosen, linen outline when not. */
export function Pill({ selected = false, className, ...props }: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "font-display text-sm px-[18px] py-[9px] rounded-full cursor-pointer transition-colors border-[1.5px] min-h-[38px]",
        selected
          ? "bg-ink border-ink text-blanc"
          : "bg-blanc border-edge-3 text-cocoa hover:border-coral hover:text-coral-deep",
        className,
      )}
      {...props}
    />
  )
}

/** A non-interactive fact chip — sizes, counts, "6 DMC colors". */
export function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[13.5px] font-extrabold bg-linen rounded-full px-[15px] py-[7px] text-cocoa",
        className,
      )}
      {...props}
    />
  )
}

/** The reassurance pill at the top of the hero, with a green stitch dot. */
export function StatusPill({ className, children }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 bg-blanc border-[1.5px] border-edge-3 rounded-full px-4 py-[7px]",
        className,
      )}
    >
      <span className="size-2.5 rounded-[3px] bg-nile" aria-hidden="true" />
      <span className="text-[13.5px] font-extrabold text-cocoa">{children}</span>
    </span>
  )
}
