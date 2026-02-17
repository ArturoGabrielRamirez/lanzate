import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "../components/button/button"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    isLoading?: boolean
    rounded?: boolean
    tooltip?: string
    noTooltip?: boolean
    canGlow?: boolean
}