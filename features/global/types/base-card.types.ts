import { type VariantProps } from "class-variance-authority"

import type {
    baseCardLayoutVariants,
    baseCardVariants,
} from "@/features/global/components/base-card/base-card-variants"
import type { BaseSurfaceProps } from "@/features/global/types/base-surface.types"

export type BaseCardSize = "sm" | "md" | "lg"
export type BaseCardLayout = "column" | "row"
export type BaseCardColumnGap = "none" | "xs" | "sm" | "md" | "lg" | "xl"

export interface BaseCardContextValue {
    variant: NonNullable<BaseSurfaceProps["variant"]>
    size: BaseCardSize
    divided: boolean
    layout: BaseCardLayout
    columnGap: BaseCardColumnGap
}

export interface BaseCardProps
    extends Omit<BaseSurfaceProps, "interactive">,
        VariantProps<typeof baseCardVariants>,
        VariantProps<typeof baseCardLayoutVariants> {
    divided?: boolean
    ref?: React.Ref<HTMLDivElement>
}

export interface BaseCardHeaderProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    icon?: React.ReactNode
    title?: React.ReactNode
    description?: React.ReactNode
    action?: React.ReactNode
    meta?: React.ReactNode
    ref?: React.Ref<HTMLDivElement>
}

export interface BaseCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.Ref<HTMLDivElement>
}

export interface BaseCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "start" | "end" | "between" | "center"
    divided?: boolean
    ref?: React.Ref<HTMLDivElement>
}
