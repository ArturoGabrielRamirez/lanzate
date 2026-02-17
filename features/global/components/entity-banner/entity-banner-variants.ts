import { cva } from "class-variance-authority"

export const entityBannerWrapperVariants = cva("relative w-full", {
    variants: {
        size: {
            base: "",
            lg: "",
        },
        avatarPosition: {
            inside: "",
            "overlap-bottom": "",
        },
    },
    compoundVariants: [
        {
            size: "base",
            avatarPosition: "overlap-bottom",
            className: "md:pb-12",
        },
        {
            size: "lg",
            avatarPosition: "overlap-bottom",
            className: "md:pb-14",
        },
    ],
    defaultVariants: {
        size: "base",
        avatarPosition: "inside",
    },
})

export const entityBannerShellVariants = cva(
    "relative flex flex-col justify-end overflow-visible rounded-2xl border border-border/60 bg-gradient-to-br from-background via-muted/25 to-muted/45 shadow-sm transition-[min-height,padding] duration-200 ease-out",
    {
        variants: {
            size: {
                base: "min-h-40 px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-4",
                lg: "min-h-48 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-5",
            },
            compact: {
                true: "",
                false: "",
            },
        },
        compoundVariants: [
            {
                size: "base",
                compact: true,
                className: "min-h-28 px-4 pb-2 pt-2 sm:px-5 sm:pb-3 sm:pt-2",
            },
            {
                size: "lg",
                compact: true,
                className: "min-h-36 px-4 pb-2 pt-3 sm:px-6 sm:pb-3 sm:pt-3",
            },
        ],
        defaultVariants: {
            size: "base",
            compact: false,
        },
    }
)

export const entityBannerContentVariants = cva("min-w-0 flex-1", {
    variants: {
        size: {
            base: "space-y-0",
            lg: "space-y-0",
        },
    },
    defaultVariants: {
        size: "base",
    },
})

export const entityBannerActionsVariants = cva(
    "hidden shrink-0 flex-wrap items-center gap-2 md:flex md:w-auto md:justify-end"
)
