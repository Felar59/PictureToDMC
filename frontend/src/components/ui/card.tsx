import type * as React from "react"

import { cn } from "@/lib/utils"

/** The workhorse surface: blanc on linen, 24px radius, one soft warm shadow. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-blanc rounded-[24px] shadow-card p-9", className)}
      {...props}
    />
  )
}

/** A smaller panel for the converter's stacked control groups. */
export function SubPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-blanc rounded-[18px] shadow-soft p-5", className)}
      {...props}
    />
  )
}

/** Uppercase section label — Nunito 800 · 13 · .08em. */
export function PanelLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-[13px] font-extrabold tracking-[.08em] uppercase text-sand",
        className,
      )}
      {...props}
    />
  )
}

/** Fredoka 500 · 17 — the title inside a control group. */
export function PanelTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("font-display font-medium text-[17px] text-ink", className)} {...props} />
  )
}

/** Small caps label sitting directly above a control. */
export function FieldLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-[12.5px] font-extrabold tracking-[.05em] uppercase text-cocoa",
        className,
      )}
      {...props}
    />
  )
}

/** Monospace readout chip — the numbers a slider is hiding. */
export function Readout({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-[13.5px] font-bold bg-linen rounded-[7px] px-2.5 py-0.5 text-ink",
        className,
      )}
      {...props}
    />
  )
}
