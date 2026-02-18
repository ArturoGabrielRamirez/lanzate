import { cva } from "class-variance-authority"

export const avatarVariants = cva(
    "relative inline-flex shrink-0 transition-all leading-[0]",
    {
        variants: {
            size: {
                sm: "h-8 w-8 min-h-8 min-w-8",
                md: "h-12 w-12 min-h-12 min-w-12",
                lg: "h-20 w-20 min-h-20 min-w-20",
                xl: "h-32 w-32 min-h-32 min-w-32",
            },
            shape: {
                circle: "rounded-full",
                square: "rounded-xl",
            },
            status: {
                none: "",
                success: "",
                error: "",
                custom: "",
            },
        },
        defaultVariants: {
            size: "md",
            shape: "circle",
            status: "none",
        },
    }
)
