"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import {
    baseSurfaceSizeVariants,
    baseSurfaceVariants,
} from "@/features/global/components/base-surface/base-surface-variants"
import type { BaseSurfaceProps } from "@/features/global/types/base-surface.types"
import { cn } from "@/features/shadcn/utils/cn"

function BaseSurface({
    className,
    variant,
    hover,
    padding,
    rounded,
    interactive,
    asChild,
    ref,
    ...props
}: BaseSurfaceProps) {
    const Comp = asChild ? Slot : "div"

    return (
        <Comp
            ref={ref}
            data-slot="base-surface"
            data-interactive={interactive || undefined}
            className={cn(
                baseSurfaceVariants({ variant, hover }),
                baseSurfaceSizeVariants({ padding, rounded }),
                interactive && "cursor-pointer select-none active:scale-[0.98]",
                className
            )}
            {...props}
        />
    )
}

BaseSurface.displayName = "BaseSurface"

export { BaseSurface, baseSurfaceSizeVariants, baseSurfaceVariants }
