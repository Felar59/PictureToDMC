import * as SliderPrimitive from "@radix-ui/react-slider"
import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Sliders rather than number inputs: the audience thinks in
 * "bigger / more colorful", not integers. The readout chip does the numbers.
 */
export function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center h-[26px] cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-aida">
        <SliderPrimitive.Range className="absolute h-full bg-coral" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-[26px] rounded-full border-[3px] border-coral bg-blanc shadow-[0_2px_8px_rgba(83,63,42,.18)] transition-transform hover:scale-105 focus-visible:scale-105 cursor-grab active:cursor-grabbing" />
    </SliderPrimitive.Root>
  )
}
