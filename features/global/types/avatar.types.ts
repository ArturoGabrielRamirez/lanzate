import { BadgeProps } from "@/features/global/types/badge.types"

export type AvatarSize = "sm" | "md" | "lg" | "xl"
export type AvatarShape = "circle" | "square"
export type AvatarStatus = "none" | "success" | "error" | "custom"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string
    alt?: string
    fallback?: React.ReactNode
    size?: AvatarSize
    shape?: AvatarShape
    status?: AvatarStatus
    statusColor?: string
    tooltip?: string
    badge?: BadgeProps & { text?: string }
}