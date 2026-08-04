import * as SwitchPrimitive from "@radix-ui/react-switch"
import type * as React from "react"

import { cn } from "@/lib/utils"

/** On is Nile green (success), off is a quiet taupe. 30px tall, 24px thumb. */
export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        // The pill stays 52x30 — a fatter one would look like a different control — but a
        // 30px-tall target is a miss waiting to happen on a phone, so an invisible
        // pseudo-element extends the hit area to 44 without moving anything.
        "peer relative inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors",
        "after:absolute after:-inset-y-[7px] after:inset-x-0 after:content-['']",
        "data-[state=checked]:bg-nile data-[state=unchecked]:bg-edge-5",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-6 rounded-full bg-blanc shadow-[0_1px_4px_rgba(0,0,0,.2)] transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  )
}
