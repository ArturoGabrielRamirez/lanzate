import { type VariantProps } from "class-variance-authority"

import {
    type baseSurfaceSizeVariants,
    type baseSurfaceVariants,
} from "@/features/global/components/base-surface/base-surface-variants"

export interface BaseSurfaceProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof baseSurfaceVariants>,
        VariantProps<typeof baseSurfaceSizeVariants> {
    asChild?: boolean
    interactive?: boolean
    ref?: React.Ref<HTMLDivElement>
}
