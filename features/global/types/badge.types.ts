import { badgeVariants } from "@/features/shadcn/components/ui/badge"
import { VariantProps } from "class-variance-authority"

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    tooltip?: string
    showDot?: boolean
}
