import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        default: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-[3px]",
        xl: "h-12 w-12 border-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Spinner, spinnerVariants }

