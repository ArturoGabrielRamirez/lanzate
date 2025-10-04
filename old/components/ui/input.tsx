
import * as React from "react"

import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"

export const inputVariants = cva(
  "flex items-center h-10 w-full px-3 py-2 text-sm bg-transparent file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border border-transparent focus-within:outline-none aria-invalid:ring-1 aria-invalid:ring-destructive aria-invalid:focus-within:ring-2 aria-invalid:focus-within:ring-destructive group transition-colors",

  {
    variants: {
      rounded: {
        none: "rounded-none",
        md: "rounded-md",
      },
      variant: {
        outline:
          "border-borde focus-within:border-primary focus-within:shadow-[0_0px_0px_1px_hsl(var(--primary))] aria-invalid:border-transparent",
        filled:
          "border-2 bg-background focus-within:border-primary focus-within:bg-transparent",
        underlined:
          "rounded-none border-b-border focus-within:border-b-primary focus-within:shadow-[0_1px_0px_0px_hsl(var(--primary))]",
        unstyled: "",
      },
    },
    defaultVariants: {
      rounded: "md",
      variant: "outline",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, rounded, variant, startContent, endContent, ...props },
    ref
  ) => {
    return (
      <div
        className={cn(
          inputVariants({ variant, rounded, className }),
          className
        )}
      >
        {startContent && (
          <span className="pointer-events-none flex items-center text-muted-foreground/50 size-4 group-focus-within:text-primary transition-colors">
            {startContent}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          className={cn(
            "w-full bg-transparent outline-none focus-visible:outline-none",
            {
              "pl-1.5": !!startContent,
              "pr-1.5": !!endContent,
            }
          )}
        />
        {endContent && (
          <span className="pointer-events-none flex items-center text-muted-foreground">
            {endContent}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

/* import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
 */