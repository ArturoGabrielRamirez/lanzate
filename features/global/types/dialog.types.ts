import { VariantProps } from "class-variance-authority"

import { dialogContentVariants } from "@/features/global/components/dialog/dialog-variants"

export type DialogResponsiveVariant = "default" | "fullscreen-mobile" | "drawer-mobile"

export interface DialogProps {
    responsive?: DialogResponsiveVariant
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
}

export interface DialogContentProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogContentVariants> {
    showClose?: boolean
}

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>
export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>
export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
}

export interface DialogContextValue {
    responsive: DialogResponsiveVariant
    isMobile: boolean
}
