import { cva } from "class-variance-authority"

export const brandContainerVariants = cva("flex", {
    variants: {
        direction: {
            horizontal: "flex-row",
            vertical: "flex-col",
        },
        align: {
            start: "items-start",
            center: "items-center",
            end: "items-end",
        },
        size: {
            sm: "gap-1.5",
            md: "gap-2",
        },
    },
    defaultVariants: {
        direction: "horizontal",
        align: "center",
        size: "md",
    },
})

export const brandIconContainerVariants = cva(
    "flex items-center justify-center rounded-md shrink-0",
    {
        variants: {
            color: {
                primary: "bg-primary",
                light: "bg-white/15",
                dark: "bg-foreground",
            },
            size: {
                sm: "h-6 w-6",
                md: "h-8 w-8",
            },
        },
        defaultVariants: {
            color: "primary",
            size: "md",
        },
    }
)

export const brandIconVariants = cva("", {
    variants: {
        color: {
            primary: "text-primary-foreground",
            light: "text-white",
            dark: "text-background",
        },
        size: {
            sm: "h-3.5 w-3.5",
            md: "h-5 w-5",
        },
    },
    defaultVariants: {
        color: "primary",
        size: "md",
    },
})

export const brandTextVariants = cva("font-bold leading-none", {
    variants: {
        color: {
            primary: "text-foreground",
            light: "text-white",
            dark: "text-foreground",
        },
        size: {
            sm: "text-sm",
            md: "text-lg",
        },
    },
    defaultVariants: {
        color: "primary",
        size: "md",
    },
})
