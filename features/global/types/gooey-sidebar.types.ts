import { VariantProps } from "class-variance-authority"

import { gooeySidebarContainerVariants, gooeySidebarTabVariants } from "@/features/global/components/gooey-sidebar/gooey-sidebar-variants"

export type GooeySidebarSize = "tight" | "loose"
export type GooeySidebarOrientation = "vertical" | "horizontal"

export interface GooeyTabItem {
    icon: React.ReactNode
    label?: string
    content: React.ReactNode
}

export interface GooeySidebarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gooeySidebarContainerVariants>,
    VariantProps<typeof gooeySidebarTabVariants> {
    tabs: GooeyTabItem[]
    size?: GooeySidebarSize
    orientation?: GooeySidebarOrientation
    defaultActiveTab?: number
    activeTab?: number
    onTabChange?: (index: number) => void
    gooeyStrength?: number
    filterId?: string
}