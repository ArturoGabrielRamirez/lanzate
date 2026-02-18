import { cva } from "class-variance-authority"

export const gooeySidebarContainerVariants = cva("relative flex", {
    variants: {
        orientation: {
            vertical: "flex-row",
            horizontal: "flex-col",
        },
    },
    defaultVariants: {
        orientation: "vertical",
    },
})

export const gooeySidebarTabListVariants = cva("relative flex", {
    variants: {
        orientation: {
            vertical: "flex-col",
            horizontal: "flex-row",
        },
    },
    defaultVariants: {
        orientation: "vertical",
    },
})

export const gooeySidebarTabVariants = cva(
    "relative flex cursor-pointer items-center transition-colors",
    {
        variants: {
            size: {
                tight: "h-12 w-16 justify-center",
                loose: "h-12 w-60 gap-3 px-4",
            },
            orientation: {
                vertical: "",
                horizontal: "",
            },
        },
        compoundVariants: [],
        defaultVariants: {
            size: "loose",
            orientation: "vertical",
        },
    }
)

export const gooeySidebarContentVariants = cva("flex-1 overflow-hidden", {
    variants: {
        orientation: {
            vertical: "",
            horizontal: "",
        },
    },
    defaultVariants: {
        orientation: "vertical",
    },
})
