import { Order, Store, StoreOperationalSettings, Branch, Product, Category, StoreBalance, ProductStock, PaymentMethod } from "@prisma/client"
import { ReactNode } from "react"
import * as yup from "yup"

import { DashboardStore } from "@/features/dashboard/types"
import { CreateStoreFormValues } from "@/features/stores/components"
import { basicInfoSchema } from "@/features/stores/schemas"
import type { ProcessedOpeningHour, ProcessedPaymentMethod, ProcessedShippingMethod } from "@/features/stores/utils/store-form-helpers"

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

// Action-related types
export type ProcessedCreateStoreData = CreateStoreFormValues & {
    processedOpeningHours: ProcessedOpeningHour[]
    processedShippingMethods: ProcessedShippingMethod[]
    processedPaymentMethods: ProcessedPaymentMethod[]
}

export type StoreHeader = {
    id: number
    name: string
    description: string | null
    logo: string | null
    banner: string | null
    balance: {
        current_balance: number
    } | null
}

export type GetStoreHeaderBySlugReturn = {
    message: string
    payload: StoreHeader | null
    hasError: boolean
}

export type GetStoresFromSlugReturn = {
    message: string
    payload: Store & {
        branches: (Branch & { stock: ProductStock[] })[],
        products: (Product & { categories: Category[] })[],
        balance: StoreBalance | null,
        operational_settings: StoreOperationalSettings | null
    } | null
    hasError: boolean
}

export type UpdateOperationalSettingsActionPayload = {
    offers_delivery: boolean
    delivery_price: number
    free_delivery_minimum: number | null
    delivery_radius_km: number
    payment_methods: PaymentMethod[]
    minimum_order_amount: number
}

export type UpdateAddressPayload = {
    is_physical_store: boolean
    address?: string
    city?: string
    province?: string
    country?: string
}

export type UpdateBasicInfoPayload = {
    name: string
    description?: string
    subdomain: string
}

export type UpdateStorePayload = {
    name: string
    description?: string
    subdomain: string
    contact_phone?: string
    contact_whatsapp?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
}