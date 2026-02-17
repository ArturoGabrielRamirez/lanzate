import { cva } from "class-variance-authority";

export const badgeVariants = cva(
    "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                sm: "px-1.5 py-0.5 text-xs",
                md: "px-2.5 py-0.5 text-xs",
                lg: "px-3 py-1 text-sm",
            },
            shape: {
                rectangle: "rounded-full",
                circle: "aspect-square rounded-full p-0 flex items-center justify-center",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            shape: "rectangle",
        },
    }
)