import { cva } from "class-variance-authority"

export const dialogContentVariants = cva("w-full", {
    variants: {
        size: {
            sm: "max-w-sm",
            md: "max-w-lg",
            lg: "max-w-2xl",
            xl: "max-w-4xl",
            full: "max-w-[calc(100vw-2rem)]",
        },
    },
    defaultVariants: {
        size: "md",
    },
})
