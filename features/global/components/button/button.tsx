import * as React from "react"

import { Loader2 } from "lucide-react"

import { Button as ShadcnButton, buttonVariants } from "@/features/shadcn/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

import { cn } from "@/features/shadcn/utils/cn"
import { ButtonProps } from "@/features/global/types/button.types"

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
        children,
        ...props
    }, ref) => {
        const button = (
            <ShadcnButton
                className={cn("cursor-pointer", className, rounded && "rounded-full", variant === "outline" && "border-primary")}
                variant={variant}
                size={size}
                asChild={asChild}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {asChild ? (
                    children
                ) : (
                    <>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
                        {children}
                        {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
                    </>
                )}
            </ShadcnButton>
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
