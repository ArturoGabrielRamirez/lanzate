"use client"

import * as React from "react"

import {
    baseCardDescriptionSizeVariants,
    baseCardFooterAlignVariants,
    baseCardLayoutVariants,
    baseCardSectionPaddingVariants,
    baseCardTitleSizeVariants,
    baseCardVariants,
} from "@/features/global/components/base-card/base-card-variants"
import { BaseSurface } from "@/features/global/components/base-surface/base-surface"
import { BaseCardContext } from "@/features/global/contexts/base-card-context"
import { useBaseCardContext } from "@/features/global/hooks/use-base-card-context"
import type {
    BaseCardContentProps,
    BaseCardFooterProps,
    BaseCardHeaderProps,
    BaseCardProps,
} from "@/features/global/types/base-card.types"
import { cn } from "@/features/shadcn/utils/cn"

// ─── Root ────────────────────────────────────────────────────────────────────

function BaseCard({
    className,
    variant = "default",
    padding = "none",
    rounded = "xl",
    hover = "none",
    asChild,
    size = "md",
    divided = false,
    layout = "column",
    columnGap = "none",
    children,
    ref,
    ...props
}: BaseCardProps) {
    const isRow = layout === "row"

    const dividedClasses = divided
        ? isRow
            ? "[&>[data-slot=base-card-content]]:border-l [&>[data-slot=base-card-content]]:border-border [&>[data-slot=base-card-footer]]:border-l [&>[data-slot=base-card-footer]]:border-border"
            : "[&>[data-slot=base-card-content]]:border-t [&>[data-slot=base-card-content]]:border-border [&>[data-slot=base-card-footer]]:border-t [&>[data-slot=base-card-footer]]:border-border"
        : undefined

    return (
        <BaseCardContext.Provider
            value={{
                variant: variant ?? "default",
                size: size ?? "md",
                divided: divided ?? false,
                layout: layout ?? "column",
                columnGap: columnGap ?? "none",
            }}
        >
            <BaseSurface
                ref={ref}
                data-slot="base-card"
                data-layout={layout}
                variant={variant}
                padding={padding}
                rounded={rounded}
                hover={hover}
                asChild={asChild}
                className={cn(
                    baseCardVariants({ size }),
                    baseCardLayoutVariants({ layout, columnGap }),
                    dividedClasses,
                    className
                )}
                {...props}
            >
                {children}
            </BaseSurface>
        </BaseCardContext.Provider>
    )
}

BaseCard.displayName = "BaseCard"

// ─── Header ──────────────────────────────────────────────────────────────────

function BaseCardHeader({
    className,
    icon,
    title,
    description,
    action,
    meta,
    children,
    ref,
    ...props
}: BaseCardHeaderProps) {
    const { size, layout } = useBaseCardContext()
    const isRow = layout === "row"

    return (
        <div
            ref={ref}
            data-slot="base-card-header"
            className={cn(
                baseCardSectionPaddingVariants({ size }),
                // Column mode: css grid for action slot
                !isRow && "grid auto-rows-min gap-y-1",
                !isRow && (action ? "grid-cols-[1fr_auto]" : "grid-cols-1"),
                // Row mode: flex-row distributed column
                isRow && "flex flex-1 min-w-0 items-center gap-3",
                className
            )}
            {...props}
        >
            {isRow ? (
                // ─── Row mode: icon + text block inline, action inline ───────
                <>
                    {icon && (
                        <div data-slot="base-card-header-icon" className="shrink-0">
                            {icon}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        {title && (
                            <div
                                data-slot="base-card-title"
                                className={baseCardTitleSizeVariants({ size })}
                            >
                                {title}
                            </div>
                        )}
                        {description && (
                            <div
                                data-slot="base-card-description"
                                className={baseCardDescriptionSizeVariants({ size })}
                            >
                                {description}
                            </div>
                        )}
                    </div>
                    {action && (
                        <div data-slot="base-card-action" className="shrink-0">
                            {action}
                        </div>
                    )}
                    {meta && (
                        <div
                            data-slot="base-card-meta"
                            className="flex flex-wrap items-center gap-1.5"
                        >
                            {meta}
                        </div>
                    )}
                    {children}
                </>
            ) : (
                // ─── Column mode: original grid layout ───────────────────────
                <>
                    <div className="flex min-w-0 items-start gap-3">
                        {icon && (
                            <div data-slot="base-card-header-icon" className="mt-0.5 shrink-0">
                                {icon}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            {title && (
                                <div
                                    data-slot="base-card-title"
                                    className={baseCardTitleSizeVariants({ size })}
                                >
                                    {title}
                                </div>
                            )}
                            {description && (
                                <div
                                    data-slot="base-card-description"
                                    className={baseCardDescriptionSizeVariants({ size })}
                                >
                                    {description}
                                </div>
                            )}
                        </div>
                    </div>

                    {action && (
                        <div
                            data-slot="base-card-action"
                            className="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
                        >
                            {action}
                        </div>
                    )}

                    {meta && (
                        <div
                            data-slot="base-card-meta"
                            className="col-span-full flex flex-wrap items-center gap-1.5 pt-0.5"
                        >
                            {meta}
                        </div>
                    )}

                    {children}
                </>
            )}
        </div>
    )
}

BaseCardHeader.displayName = "BaseCardHeader"

// ─── Content ─────────────────────────────────────────────────────────────────

function BaseCardContent({
    className,
    children,
    ref,
    ...props
}: BaseCardContentProps) {
    const { size, layout } = useBaseCardContext()
    const isRow = layout === "row"

    return (
        <div
            ref={ref}
            data-slot="base-card-content"
            className={cn(
                baseCardSectionPaddingVariants({ size }),
                isRow && "flex-1 min-w-0",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

BaseCardContent.displayName = "BaseCardContent"

// ─── Footer ──────────────────────────────────────────────────────────────────

function BaseCardFooter({
    className,
    align = "between",
    divided,
    children,
    ref,
    ...props
}: BaseCardFooterProps) {
    const { size, divided: cardDivided, layout } = useBaseCardContext()
    const isRow = layout === "row"
    const showDivider = divided ?? cardDivided

    return (
        <div
            ref={ref}
            data-slot="base-card-footer"
            className={cn(
                baseCardSectionPaddingVariants({ size }),
                baseCardFooterAlignVariants({ align }),
                // In row mode footer acts as the trailing actions column (no flex-1)
                isRow && "shrink-0",
                showDivider && (isRow ? "border-l border-border" : "border-t border-border"),
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

BaseCardFooter.displayName = "BaseCardFooter"

export { BaseCard, BaseCardContent, BaseCardFooter, BaseCardHeader }
