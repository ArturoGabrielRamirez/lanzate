import { type VariantProps } from "class-variance-authority"

import {
    type itemIconContainerVariants,
    type itemVariants,
} from "@/features/global/components/item/item-variants"
import type { BaseSurfaceProps } from "@/features/global/types/base-surface.types"

export type ItemIconVariant = NonNullable<
    VariantProps<typeof itemIconContainerVariants>["iconVariant"]
>

export type ItemLayout = NonNullable<VariantProps<typeof itemVariants>["layout"]>

export type ItemSize = NonNullable<VariantProps<typeof itemVariants>["size"]>

export type ItemStatusDotColor = "success" | "error" | "warning" | "info"

export interface ItemProps
    extends Omit<BaseSurfaceProps, "children">,
        VariantProps<typeof itemVariants> {
    icon?: React.ReactNode
    label?: React.ReactNode
    description?: React.ReactNode
    suffix?: React.ReactNode
    iconVariant?: ItemIconVariant
    showStatusDot?: boolean
    statusDotColor?: ItemStatusDotColor
    animate?: boolean
    children?: React.ReactNode
    ref?: React.Ref<HTMLDivElement>
}
