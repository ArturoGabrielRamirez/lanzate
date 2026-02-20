import { cva } from "class-variance-authority"

export const baseSurfaceVariants = cva("relative transition-colors", {
    variants: {
        variant: {
            default:
                "bg-card border border-border shadow-sm",
            muted:
                "bg-muted border border-transparent",
            secondary:
                "bg-secondary border border-transparent",
            outline:
                "bg-transparent border border-border",
            ghost:
                "bg-transparent border border-transparent shadow-none",
            destructive:
                "bg-destructive/10 border border-destructive/20",
            primary:
                "bg-primary/10 border border-primary/20",
            glow:
                "bg-card border border-primary/30 shadow-sm ring-2 ring-primary/25 shadow-[0_0_0_1px_color-mix(in_oklch,var(--color-primary)_15%,transparent),0_0_24px_4px_color-mix(in_oklch,var(--color-primary)_10%,transparent),0_4px_16px_-2px_color-mix(in_oklch,var(--color-primary)_8%,transparent)]",
        },
        hover: {
            none: "",
            default:
                "hover:bg-accent hover:border-border/80 transition-colors",
            muted:
                "hover:bg-muted transition-colors",
            primary:
                "hover:bg-primary/10 hover:border-primary/30 transition-colors",
        },
    },
    defaultVariants: {
        variant: "default",
        hover: "none",
    },
})

export const baseSurfaceSizeVariants = cva("", {
    variants: {
        padding: {
            none: "p-0",
            sm: "p-2",
            md: "p-4",
            lg: "p-6",
        },
        rounded: {
            sm: "rounded-md",
            md: "rounded-lg",
            lg: "rounded-xl",
            xl: "rounded-2xl",
        },
    },
    defaultVariants: {
        padding: "md",
        rounded: "lg",
    },
})
