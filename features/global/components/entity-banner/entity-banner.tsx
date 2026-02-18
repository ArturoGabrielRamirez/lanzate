"use client"

import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import * as React from "react"


import { Avatar } from "@/features/global/components/avatar/avatar"
import { Button } from "@/features/global/components/button/button"
import {
    entityBannerActionsVariants,
    entityBannerContentVariants,
    entityBannerShellVariants,
    entityBannerWrapperVariants,
} from "@/features/global/components/entity-banner/entity-banner-variants"
import { Text } from "@/features/global/components/typography/text/text"
import { Title } from "@/features/global/components/typography/title/title"
import { AvatarSize } from "@/features/global/types/avatar.types"
import { EntityBannerProps } from "@/features/global/types/entity-banner.types"
import {
    DrawerClose,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/features/shadcn/components/ui/drawer"
import { cn } from "@/features/shadcn/utils/cn"



function EntityBanner({
    className,
    bannerClassName,
    contentClassName,
    actionsClassName,
    showAvatar = true,
    avatar,
    avatarSrc,
    avatarAlt,
    avatarFallback,
    size = "base",
    autoCompactOnScroll = false,
    compactOnScrollThreshold = 48,
    avatarPosition = "inside",
    title,
    description,
    titleNode,
    descriptionNode,
    actionItems,
    actions,
    coverSrc,
    coverAlt,
    innerClassName,
    ...props
}: EntityBannerProps) {
    const [isScrollCompact, setIsScrollCompact] = React.useState(false)

    React.useEffect(() => {
        if (!autoCompactOnScroll) {
            setIsScrollCompact(false)
            return
        }

        const hysteresisPx = 16
        const compactExitThreshold = Math.max(0, compactOnScrollThreshold - hysteresisPx)

        const onScroll = () => {
            const y = window.scrollY
            setIsScrollCompact((prev) => {
                if (!prev && y >= compactOnScrollThreshold) return true
                if (prev && y <= compactExitThreshold) return false
                return prev
            })
        }

        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
        }
    }, [autoCompactOnScroll, compactOnScrollThreshold])

    const hasAvatar = showAvatar && (!!avatar || !!avatarSrc || !!avatarFallback)
    const isAvatarOverlap = hasAvatar && avatarPosition === "overlap-bottom"
    const resolvedAvatarPosition = isAvatarOverlap ? "overlap-bottom" : "inside"

    const avatarSizeByBanner = size === "base" ? "lg" : "xl"
    const titleSizeByBanner = "md"
    const descriptionSizeByBanner = "base"
    const overlapOffsetClass =
        size === "base"
            ? isScrollCompact
                ? "md:pl-[5.5rem]"
                : "md:pl-[7rem]"
            : isScrollCompact
                ? "md:pl-[7rem]"
                : "md:pl-[9.5rem]"
    const desktopAvatarSizeClassMap: Record<AvatarSize, string> = {
        sm: "md:h-10 md:w-10 md:min-h-10 md:min-w-10",
        md: "md:h-14 md:w-14 md:min-h-14 md:min-w-14",
        lg: "md:h-20 md:w-20 md:min-h-20 md:min-w-20",
        xl: "md:h-32 md:w-32 md:min-h-32 md:min-w-32",
    }
    const resolvedDesktopAvatarSize = avatar?.size ?? avatarSizeByBanner
    const compactDesktopAvatarSizeClassMap: Record<AvatarSize, string> = {
        sm: "md:h-6 md:w-6 md:min-h-6 md:min-w-6",
        md: "md:h-10 md:w-10 md:min-h-10 md:min-w-10",
        lg: "md:h-14 md:w-14 md:min-h-14 md:min-w-14",
        xl: "md:h-20 md:w-20 md:min-h-20 md:min-w-20",
    }
    const hasActionItems = !!actionItems?.length
    const hasActions = hasActionItems || !!actions

    const resolvedAvatar = hasAvatar ? (
        <Avatar
            shape="square"
            {...avatar}
            src={avatarSrc ?? avatar?.src}
            alt={avatarAlt ?? avatar?.alt}
            fallback={avatarFallback ?? avatar?.fallback}
            size={resolvedDesktopAvatarSize}
            className={cn(
                "shrink-0 origin-bottom-left shadow-[0_8px_20px_-4px_rgba(0,0,0,0.18)] transition-[width,height,min-width,min-height,transform] duration-200 ease-out",
                avatar?.className,
                isScrollCompact
                    ? compactDesktopAvatarSizeClassMap[resolvedDesktopAvatarSize]
                    : desktopAvatarSizeClassMap[resolvedDesktopAvatarSize],
                isScrollCompact
                    ? "h-8 w-8 min-h-8 min-w-8"
                    : "h-10 w-10 min-h-10 min-w-10"
            )}
        />
    ) : null

    return (
        <div
            className={cn(
                entityBannerWrapperVariants({ size, avatarPosition: resolvedAvatarPosition }),
                isScrollCompact && isAvatarOverlap && "md:pb-8",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    entityBannerShellVariants({ size, compact: isScrollCompact }),
                    bannerClassName
                )}
            >
                {coverSrc ? (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        <Image
                            src={coverSrc}
                            alt={coverAlt ?? ""}
                            fill
                            className="object-cover opacity-40"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
                    </div>
                ) : null}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_45%)]"
                />

                <div className={cn("relative z-10 flex w-full items-end justify-between gap-3", innerClassName)}>
                    {isAvatarOverlap ? (
                        <div className="absolute left-0 bottom-0 z-20 hidden translate-y-1/2 md:block">
                            {resolvedAvatar}
                        </div>
                    ) : null}

                    <div
                        className={cn(
                            "flex min-w-0 flex-1 items-end gap-3 sm:gap-4",
                            isAvatarOverlap && overlapOffsetClass
                        )}
                    >
                        {hasAvatar && resolvedAvatarPosition === "inside" ? resolvedAvatar : null}
                        {hasAvatar && resolvedAvatarPosition === "overlap-bottom" ? (
                            <div className="md:hidden">{resolvedAvatar}</div>
                        ) : null}

                        <div
                            className={cn(
                                entityBannerContentVariants({ size }),
                                isAvatarOverlap && "md:translate-y-1",
                                contentClassName
                            )}
                        >
                            {titleNode ??
                                (title ? (
                                    <Title
                                        size={titleSizeByBanner}
                                        className="truncate border-b-0 pb-0 leading-tight text-foreground/95"
                                    >
                                        {title}
                                    </Title>
                                ) : null)}

                            {descriptionNode ??
                                (description ? (
                                    <Text
                                        size={descriptionSizeByBanner}
                                        className="truncate [&:not(:first-child)]:mt-0 leading-snug text-muted-foreground/90"
                                    >
                                        {description}
                                    </Text>
                                ) : null)}
                        </div>
                    </div>

                    {hasActions ? (
                        <>
                            <div
                                className={cn(entityBannerActionsVariants(), actionsClassName)}
                            >
                                {hasActionItems
                                    ? actionItems.map((item) => (
                                        <Button
                                            key={item.label}
                                            variant={item.buttonProps?.variant ?? "outline"}
                                            size="icon"
                                            rounded
                                            tooltip={item.tooltip ?? item.label}
                                            aria-label={item.label}
                                            {...item.buttonProps}
                                        >
                                            {item.icon}
                                        </Button>
                                    ))
                                    : actions}
                            </div>

                            <div className="md:hidden">
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            rounded
                                            noTooltip
                                            aria-label="Open actions"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="px-4 pb-4">
                                        <DrawerHeader className="px-0">
                                            <DrawerTitle>Actions</DrawerTitle>
                                        </DrawerHeader>
                                        {hasActionItems ? (
                                            <div className="flex flex-col gap-2">
                                                {actionItems.map((item) => (
                                                    <DrawerClose asChild key={`drawer-${item.label}`}>
                                                        <Button
                                                            variant={item.buttonProps?.variant ?? "outline"}
                                                            className={cn("w-full justify-start", item.buttonProps?.className)}
                                                            startIcon={item.icon}
                                                            noTooltip
                                                            {...item.buttonProps}
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    </DrawerClose>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap items-center gap-2">
                                                {actions}
                                            </div>
                                        )}
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </>
                    ) : null}
                </div>

            </div>
        </div>
    )
}

EntityBanner.displayName = "EntityBanner"

export { EntityBanner }
