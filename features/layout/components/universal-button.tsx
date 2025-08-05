import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type ButtonPropsType = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
        children?: React.ReactNode
        iconBefore?: React.ReactNode
        iconAfter?: React.ReactNode
    }

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs md:text-sm lg:text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0 outline-none cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                rounded: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-full"
            },
            size: {
                default: "h-7 md:h-8 lg:h-9 px-3 lg:px-4 py-2 md:py-2",
                rounded: "size-8 md:size-9 lg:size-10 p-1.5 md:p-2.5"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }
    }
)

function Button({ asChild, children, iconBefore, iconAfter, variant, size, ...props }: ButtonPropsType) {

    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size }))}
            {...props}
        >
            {iconBefore && iconBefore}
            {children || "Button"}
            {iconAfter && iconAfter}
        </Comp>
    )
}
export default Button