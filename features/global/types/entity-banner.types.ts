import { AvatarProps } from "@/features/global/types/avatar.types"
import { ButtonProps } from "@/features/global/types/button.types"

export type EntityBannerSize = "base" | "lg"
export type EntityBannerAvatarPosition = "inside" | "overlap-bottom"

export interface EntityBannerActionItem {
    label: string
    icon: React.ReactNode
    tooltip?: string
    buttonProps?: Omit<ButtonProps, "children" | "startIcon" | "endIcon" | "tooltip" | "size">
}

export interface EntityBannerProps extends React.HTMLAttributes<HTMLDivElement> {
    showAvatar?: boolean
    avatar?: AvatarProps
    avatarSrc?: string
    avatarAlt?: string
    avatarFallback?: React.ReactNode
    size?: EntityBannerSize
    autoCompactOnScroll?: boolean
    compactOnScrollThreshold?: number
    avatarPosition?: EntityBannerAvatarPosition
    title?: string
    description?: string
    titleNode?: React.ReactNode
    descriptionNode?: React.ReactNode
    actionItems?: EntityBannerActionItem[]
    actions?: React.ReactNode
    contentClassName?: string
    actionsClassName?: string
    bannerClassName?: string
    innerClassName?: string
    coverSrc?: string
    coverAlt?: string
}