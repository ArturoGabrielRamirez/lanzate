import { cva } from "class-variance-authority"

export const itemVariants = cva("flex min-w-0 transition-colors", {
    variants: {
        layout: {
            horizontal: "flex-row items-center",
            vertical: "flex-col items-center text-center",
        },
        size: {
            sm: "gap-2",
            md: "gap-3",
            lg: "gap-4",
        },
    },
    defaultVariants: {
        layout: "horizontal",
        size: "md",
    },
})

export const itemIconContainerVariants = cva(
    "flex shrink-0 items-center justify-center",
    {
        variants: {
            size: {
                sm: "h-7 w-7 rounded-md",
                md: "h-9 w-9 rounded-lg",
                lg: "h-11 w-11 rounded-xl",
            },
            iconVariant: {
                default: "bg-muted text-foreground",
                primary: "bg-primary/10 text-primary",
                secondary: "bg-secondary text-secondary-foreground",
                muted: "bg-muted/60 text-muted-foreground",
                destructive: "bg-destructive/10 text-destructive",
                outline: "border border-border bg-transparent text-foreground",
                ghost: "bg-transparent text-muted-foreground",
            },
        },
        defaultVariants: {
            size: "md",
            iconVariant: "default",
        },
    }
)

export const itemLabelVariants = cva("font-medium leading-none truncate", {
    variants: {
        size: {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        },
    },
    defaultVariants: { size: "md" },
})

export const itemDescriptionVariants = cva(
    "text-muted-foreground leading-snug truncate",
    {
        variants: {
            size: {
                sm: "text-xs",
                md: "text-xs",
                lg: "text-sm",
            },
        },
        defaultVariants: { size: "md" },
    }
)
