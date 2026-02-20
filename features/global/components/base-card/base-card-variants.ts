import { cva } from "class-variance-authority"

export const baseCardLayoutVariants = cva("", {
    variants: {
        layout: {
            column: "flex-col",
            row: "flex-row items-center",
        },
        columnGap: {
            none: "gap-0",
            xs: "gap-1",
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-6",
            xl: "gap-8",
        },
    },
    defaultVariants: {
        layout: "column",
        columnGap: "none",
    },
})

export const baseCardVariants = cva("flex overflow-hidden", {
    variants: {
        size: {
            sm: "",
            md: "",
            lg: "",
        },
    },
    defaultVariants: {
        size: "md",
    },
})

export const baseCardSectionPaddingVariants = cva("", {
    variants: {
        size: {
            sm: "px-3 py-2.5",
            md: "px-5 py-4",
            lg: "px-6 py-5",
        },
    },
    defaultVariants: {
        size: "md",
    },
})

export const baseCardFooterAlignVariants = cva("flex items-center gap-3", {
    variants: {
        align: {
            start: "justify-start",
            end: "justify-end",
            between: "justify-between",
            center: "justify-center",
        },
    },
    defaultVariants: {
        align: "between",
    },
})

export const baseCardTitleSizeVariants = cva(
    "font-semibold leading-tight truncate text-foreground",
    {
        variants: {
            size: {
                sm: "text-sm",
                md: "text-base",
                lg: "text-lg",
            },
        },
        defaultVariants: { size: "md" },
    }
)

export const baseCardDescriptionSizeVariants = cva(
    "text-muted-foreground leading-snug",
    {
        variants: {
            size: {
                sm: "text-xs mt-0.5",
                md: "text-sm mt-1",
                lg: "text-sm mt-1",
            },
        },
        defaultVariants: { size: "md" },
    }
)
