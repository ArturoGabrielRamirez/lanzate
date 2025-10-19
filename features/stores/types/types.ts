import * as yup from "yup"
import { ReactNode } from "react"
import { Order, Store, StoreOperationalSettings, Branch } from "@prisma/client"

import { DashboardStore } from "@/features/dashboard/types"
import { basicInfoSchema } from "@/features/stores/schemas"

// Store-related types
export type StoreCardProps = {
    userId: number
    store?: DashboardStore
    isEmpty?: boolean
}

export type NewStoreCardProps = {
    variant?: "empty" | "add-more"
}

export type BasicInfoFormType = yup.InferType<typeof basicInfoSchema>

export interface StoreHeaderServerProps {
    slug: string
}

// Layout and navigation types
export type StoreDetailsLayoutProps = {
    children: ReactNode
    params: Promise<{ slug: string }>
}

export type TabLayoutProps = {
    children: ReactNode
    params: Promise<{ tab: string }>
}

export type TabPageProps = {
    params: Promise<{ slug: string, tab: string }>
}

export type TabClientContainerProps = {
    children: ReactNode
}

export type TabTriggerLinkProps = {
    value: string
    text: string
    slug: string
    icon?: ReactNode
}

// Button types
export type CreateStoreButtonProps = {
    userId: number
    canCreate?: boolean
    className?: string
}

export type DeleteStoreButtonProps = {
    storeId: number
    userId: number
}

export type EditStoreButtonProps = {
    userId: number
    slug: string
    store: Store & { 
        operational_settings: StoreOperationalSettings | null
        branches: Branch[]
    }
}

// Tab types
export type AccountTabProps = {
    slug: string
    userId: number
}

export type BranchesTabProps = {
    slug: string
    userId: number
}

export type ProductsTabProps = {
    slug: string
    userId: number
}

export type HistoryTabProps = {
    slug: string
    userId: number
}

export type SettingsTabProps = {
    slug: string
    userId: number
}

// Page types
export type OrderDetailPageProps = {
    params: Promise<{ slug: string, id: string }>
}

export type LogDetailPageProps = {
    params: Promise<{ slug: string, id: string }>
}

// Order status types
export type ChangeOrderStatusButtonProps = {
    order: Order
    slug: string
    userId: number
    onComplete?: () => void
}

export type CancelOrderButtonProps = {
    order: Order
    slug: string
    userId: number
    onComplete?: () => void
}

export type ChangeOrderStatusData = {
    newStatus: string
    confirmPayment: boolean
    confirmStockRestore: boolean
}