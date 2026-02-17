"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

import { badgeVariants } from "./badge-variants"
import { cn } from "@/features/shadcn/utils/cn"
import { BadgeProps } from "../../types/badge.types"

function Badge({ className, variant, size, shape, tooltip, showDot, children, ...props }: BadgeProps) {
    const badge = (
        <div
            className={cn(badgeVariants({ variant, size, shape, className }), showDot && "relative")}
            {...props}
        >
            {children}
            {showDot && (
                <span className="absolute right-0 top-0 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
                </span>
            )}
        </div>
    )

    if (tooltip) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {badge}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return badge
}

export { Badge, badgeVariants }
