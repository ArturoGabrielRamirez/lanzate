import { type HTMLMotionProps } from "framer-motion"
import { Loader2 } from "lucide-react"
import * as motion from "motion/react-client"
import * as React from "react"


import { ButtonProps } from "@/features/global/types/button.types"
import { buttonVariants } from "@/features/shadcn/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/features/shadcn/utils/cn"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant,
        size,
        asChild = false,
        startIcon,
        endIcon,
        isLoading,
        rounded,
        tooltip,
        noTooltip,
        canGlow,
        children,
        ...props
    }, ref) => {
        const getVariantClasses = () => {
            const classes: string[] = []

            if (variant === "secondary") {
                classes.push("bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40")
            }

            if (variant === "ghost") {
                classes.push("text-foreground")
            }

            if (variant === "outline") {
                classes.push("border border-primary text-primary bg-transparent dark:border-primary dark:text-primary")
            }

            if (canGlow) {
                if (variant === "default" || variant === "secondary") {
                    if (rounded) {
                        classes.push("shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_0_20px_rgba(255,107,74,0.6)] dark:hover:shadow-[0_0_35px_rgba(255,107,74,0.7)]")
                    } else {
                        classes.push("shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(255,107,74,0.5)] dark:hover:shadow-[0_0_25px_rgba(255,107,74,0.6)]")
                    }
                } else if (variant === "outline") {
                    if (rounded) {
                        classes.push("shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_0_20px_rgba(255,107,74,0.4)] dark:hover:shadow-[0_0_35px_rgba(255,107,74,0.6)]")
                    } else {
                        classes.push("shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_0_15px_rgba(255,107,74,0.3)] dark:hover:shadow-[0_0_25px_rgba(255,107,74,0.5)]")
                    }
                } else if (variant === "ghost") {
                    classes.push("hover:shadow-[0_0_15px_rgba(255,107,74,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,107,74,0.4)]")
                } else if (variant === "destructive") {
                    classes.push("shadow-[0_4px_14px_0_rgba(220,38,38,0.15)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.2)] dark:shadow-[0_0_15px_rgba(220,38,38,0.4)] dark:hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]")
                }
            }

            return classes.join(" ")
        }

        const baseClasses = buttonVariants({ variant, size, className: undefined })
        const variantClasses = getVariantClasses()

        const button = (
            <motion.button
                whileTap={{ scale: 0.95 }}
                className={cn(baseClasses, "cursor-pointer", className, variantClasses, rounded && "rounded-full")}
                disabled={isLoading || props.disabled}
                {...(props as HTMLMotionProps<"button">)}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
                {children}
                {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
            </motion.button>
        )

        if (tooltip && !noTooltip) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {button}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }

        return button
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
