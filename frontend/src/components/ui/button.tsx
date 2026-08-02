import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/utils"

// Pills throughout: soft as embroidery hoops, unmistakably pressable.
// Coral is reserved for the primary action — never two on one screen.
// Secondary wears the running-stitch dashed border, a clear rank below coral.
// Minimum hit height is 46px everywhere (audience 40-70).
const buttonVariants = cva(
  // No `whitespace-nowrap`: French labels run ~25% longer than English and
  // a nowrap pill overflows the viewport on a 375px screen.
  "inline-flex items-center justify-center gap-2.5 font-display font-medium text-balance text-center rounded-full cursor-pointer transition-all duration-200 disabled:cursor-not-allowed [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-coral text-[#FFF8F3] shadow-coral hover:bg-coral-deep hover:-translate-y-px disabled:bg-aida disabled:text-sand disabled:shadow-none disabled:translate-y-0 disabled:hover:bg-aida",
        secondary:
          "bg-blanc text-ink border-2 border-dashed border-taupe hover:border-coral hover:text-coral-deep disabled:text-sand disabled:border-edge-3 disabled:hover:text-sand disabled:hover:border-edge-3",
        ghost:
          "bg-transparent text-coral-deep underline-dotted-soft hover:text-coral-deeper disabled:text-sand disabled:no-underline",
        quiet: "bg-transparent text-stone hover:text-coral-deep disabled:text-edge-5",
        icon: "bg-linen text-cocoa border-[1.5px] border-edge-3 font-bold hover:border-taupe disabled:text-edge-5 disabled:hover:border-edge-3",
      },
      size: {
        sm: "text-sm px-5 py-2.5 min-h-[38px]",
        md: "text-[17px] px-[30px] py-[15px] min-h-[46px]",
        lg: "text-[18px] px-[34px] py-[17px] min-h-[52px]",
        icon: "size-[46px] p-0 text-[19px]",
        iconSm: "size-[38px] p-0 text-[17px]",
        block: "text-[17px] px-6 py-4 w-full min-h-[52px]",
      },
    },
    compoundVariants: [
      // The dashed border eats 2px, so secondary pads 2px less and keeps the
      // same overall height as primary.
      { variant: "secondary", size: "md", class: "py-[13px] px-[28px]" },
      { variant: "secondary", size: "lg", class: "py-[15px] px-[30px]" },
      { variant: "secondary", size: "block", class: "py-[14px]" },
      { variant: "ghost", size: "md", class: "px-1.5 py-3 text-base" },
      { variant: "quiet", size: "md", class: "px-2 py-2.5 text-sm min-h-[38px]" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
)

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
