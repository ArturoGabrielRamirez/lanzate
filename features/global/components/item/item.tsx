"use client"

import { Slot } from "@radix-ui/react-slot"
import { type HTMLMotionProps } from "framer-motion"
import * as motion from "motion/react-client"
import * as React from "react"

import {
    baseSurfaceSizeVariants,
    baseSurfaceVariants,
} from "@/features/global/components/base-surface/base-surface-variants"
import {
    itemDescriptionVariants,
    itemIconContainerVariants,
    itemLabelVariants,
    itemVariants,
} from "@/features/global/components/item/item-variants"
import type { ItemProps } from "@/features/global/types/item.types"
import { cn } from "@/features/shadcn/utils/cn"

const statusDotColors = {
    success: "bg-green-500",
    error: "bg-destructive",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
} as const

function Item({
    className,
    // BaseSurface props
    variant = "default",
    hover = "none",
    padding = "md",
    rounded = "lg",
    interactive,
    asChild,
    // Item layout props
    layout = "horizontal",
    size = "md",
    // Content slots
    icon,
    label,
    description,
    suffix,
    iconVariant = "default",
    showStatusDot,
    statusDotColor = "success",
    animate,
    children,
    ref,
    ...props
}: ItemProps) {
    const isEmpty = !children && !icon && !label && !description && !suffix

    const rootClassName = cn(
        baseSurfaceVariants({ variant, hover }),
        baseSurfaceSizeVariants({ padding, rounded }),
        itemVariants({ layout, size }),
        interactive && "cursor-pointer select-none active:scale-[0.98]",
        className
    )

    const content = isEmpty ? (
        <div
            data-slot="item-empty"
            className="flex w-full flex-col items-center justify-center gap-2 py-2 text-muted-foreground/40"
        >
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="h-2 w-16 rounded bg-muted" />
        </div>
    ) : children ? (
        children
    ) : (
        <>
            {icon && (
                <div
                    data-slot="item-icon"
                    className={cn(
                        itemIconContainerVariants({ size, iconVariant }),
                        "relative shrink-0"
                    )}
                >
                    {icon}
                    {showStatusDot && (
                        <span
                            data-slot="item-status-dot"
                            className={cn(
                                "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-background",
                                statusDotColors[statusDotColor]
                            )}
                        />
                    )}
                </div>
            )}

            {(label || description) && (
                <div
                    data-slot="item-content"
                    className={cn(
                        "flex min-w-0 flex-1 flex-col",
                        layout === "vertical" && "items-center"
                    )}
                >
                    {label && (
                        <span
                            data-slot="item-label"
                            className={cn(itemLabelVariants({ size }))}
                        >
                            {label}
                        </span>
                    )}
                    {description && (
                        <span
                            data-slot="item-description"
                            className={cn(
                                itemDescriptionVariants({ size }),
                                label && "mt-0.5"
                            )}
                        >
                            {description}
                        </span>
                    )}
                </div>
            )}

            {suffix && (
                <div
                    data-slot="item-suffix"
                    className="ml-auto flex shrink-0 items-center"
                >
                    {suffix}
                </div>
            )}
        </>
    )

    if (asChild) {
        return (
            <Slot
                ref={ref}
                data-slot="item"
                data-layout={layout}
                data-interactive={interactive || undefined}
                className={rootClassName}
                {...props}
            >
                {content as React.ReactElement}
            </Slot>
        )
    }

    if (animate) {
        return (
            <motion.div
                ref={ref as React.Ref<HTMLDivElement>}
                data-slot="item"
                data-layout={layout}
                data-interactive={interactive || undefined}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={rootClassName}
                {...(props as Omit<HTMLMotionProps<"div">, "ref" | "animate" | "initial" | "transition">)}
            >
                {content}
            </motion.div>
        )
    }

    return (
        <div
            ref={ref}
            data-slot="item"
            data-layout={layout}
            data-interactive={interactive || undefined}
            className={rootClassName}
            {...props}
        >
            {content}
        </div>
    )
}

Item.displayName = "Item"

export { Item, itemIconContainerVariants, itemVariants }
