import { cva } from "class-variance-authority"

export const dialogContentVariants = cva("w-full", {
    variants: {
        size: {
            sm: "max-w-sm sm:max-w-sm",
            md: "max-w-lg sm:max-w-lg",
            lg: "max-w-2xl sm:max-w-2xl",
            xl: "max-w-4xl sm:max-w-4xl",
            full: "max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)]",
        },
    },
    defaultVariants: {
        size: "md",
    },
})
