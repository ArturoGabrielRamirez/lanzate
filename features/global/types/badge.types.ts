import { VariantProps } from "class-variance-authority"

import { badgeVariants } from "@/features/global/components/badge/badge-variants"

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    tooltip?: string
    showDot?: boolean
}
