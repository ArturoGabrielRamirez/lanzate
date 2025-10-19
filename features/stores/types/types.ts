import { Order, Store, StoreOperationalSettings, Branch, Product, Category, StoreBalance, ProductStock, PaymentMethod, BranchOperationalSettings, BranchOpeningHour, BranchShippingMethod } from "@prisma/client"
import { RowModel } from "@tanstack/react-table"
import dayjs from "dayjs"
import { ReactNode } from "react"
import * as yup from "yup"

import { DashboardStore } from "@/features/dashboard/types"
import { ResponseType } from "@/features/layout/types"
import { basicInfoSchema } from "@/features/stores/schemas"

// Store-related types
export type StoreCardProps = {
    userId: number
    store?: DashboardStore
    isEmpty?: boolean
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

// Store form helper types
export type ProcessedOpeningHour = {
    day: number
    start: string
    end: string
}

export type ProcessedShippingMethod = {
    provider: string
    min_order_amount: number | null
    free_shipping_min: number | null
    eta_minutes: number | null
    delivery_price: number | null
    active: boolean
}

export type ProcessedPaymentMethod = string

// Form sections types
export interface AddressDisplayProps {
    store: Store & {
        branches: Branch[]
        is_physical_store: boolean
    }
    userId: number
}

export type AddressFormValues = {
    is_physical_store: boolean
    address?: string
    city?: string
    province?: string
    country?: string
}

export interface AddressSectionProps {
    store?: Store & { branches: Branch[] }
    mode: 'create' | 'edit'
}

export interface BasicInfoDisplayProps {
    store: Store
    userId: number
}

export type BasicInfoFormValues = {
    name: string
    description: string
    subdomain: string
}

export interface BasicInfoSectionProps {
    store?: Store
    subdomain: string
    onSubdomainChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    mode: 'create' | 'edit'
    onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export type BranchWithSettings = Branch & {
    operational_settings: BranchOperationalSettings | null
    opening_hours: BranchOpeningHour[]
}

export interface BranchesOverviewDisplayProps {
    branches: BranchWithSettings[]
    slug: string
}

export interface ContactDisplayProps {
    store: Store & { branches: Branch[] }
}

export interface ContactSectionProps {
    store?: Store & { branches: Branch[] }
    mode: 'create' | 'edit'
}

export interface OperationalSettingsDisplayProps {
    store: Store & {
        operational_settings: StoreOperationalSettings | null
        branches?: (Branch & {
            operational_settings: BranchOperationalSettings | null
            shipping_methods: BranchShippingMethod[]
        })[]
    }
}

export interface SocialMediaDisplayProps {
    store: Store & { operational_settings: StoreOperationalSettings | null, branches: Branch[] }
}

export interface SocialMediaSectionProps {
    store?: Store & { operational_settings: StoreOperationalSettings | null }
    mode: 'create' | 'edit'
}

// Section buttons types
export interface EditAddressButtonProps {
    store: Store & { branches: Branch[] }
    userId: number
    className?: string
    onSuccess?: () => void
}

export interface EditBasicInfoButtonProps {
    store: Store
    userId: number
    className?: string
    onSuccess?: () => void
}

export interface EditContactButtonProps {
    store: Store & { branches: Branch[] }
    className?: string
    onSuccess?: () => void
}

export interface EditSocialMediaButtonProps {
    store: Store & { operational_settings: StoreOperationalSettings | null }
    className?: string
    onSuccess?: () => void
}

// Tabs types
export type OrdersTabProps = {
    slug: string
}

// Components types
export type AttentionDateType = {
    date: string
    startTime: dayjs.Dayjs
    endTime: dayjs.Dayjs
    days: string[]
}

export type ShippingMethod = {
    providers: string[]
    minPurchase: string
    freeShippingMin: string
    estimatedTime: string
    deliveryPrice?: string
}

export type AttentionDateFormPanelProps = {
    date: AttentionDateType
    onCancel: (index: number) => void
    onSave: (index: number, startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, days: string[]) => void
    index: number
}

export type ShippingMethodFormPanelProps = {
    method: ShippingMethod
    index: number
    onCancel: (index: number) => void
    onSave: (index: number, method: ShippingMethod) => void
}

export type StepIndicatorProps = {
    step: number
    currentStep: number
    onStepClick: (step: number) => void
    disabled: boolean
}

export type CreateStoreFormProps = {
    setStep: (step: number) => void
    step: number
}

export type CreateStoreFormValues = {
    basic_info: {
        name: string
        description?: string
        subdomain: string
        logo?: File | string | null
    }
    address_info: {
        is_physical_store: boolean
        address?: string
        city?: string
        province?: string
        country?: string
    }
    contact_info: {
        contact_phone: string
        contact_email: string
        facebook_url?: string
        instagram_url?: string
        x_url?: string
    }
    settings: {
        is_open_24_hours: boolean
        attention_dates?: { days?: string[]; startTime?: string; endTime?: string }[]
    }
    shipping_info: {
        offers_delivery: boolean
        methods?: { providers?: string[]; minPurchase?: string; freeShippingMin?: string; estimatedTime?: string; deliveryPrice: string }[]
    }
    payment_info: {
        payment_methods: string[]
    }
}

export type CreateStoreContextType = {
    values: Partial<CreateStoreFormValues>
    setValues: (partial: Partial<CreateStoreFormValues>) => void
    isStepValid: Record<number, boolean>
    setStepValid: (step: number, valid: boolean) => void
}

export type DeliverySwitchProps = {
    defaultValue?: boolean
    onDeliveryChange?: (enabled: boolean) => void
}

export type EditOperationalSettingsButtonProps = {
    storeId: number
    store: Store & {
        operational_settings?: StoreOperationalSettings | null
    }
    onSuccess?: () => void
}

export type OperationalSettingsFormPayload = {
    offers_delivery: boolean
    delivery_price?: string
    free_delivery_minimum?: string
    delivery_radius_km?: string
    minimum_order_amount: string
    payment_methods: PaymentMethod[]
}

export type EditStorePayload = {
    name: string
    description?: string
    subdomain: string
    contact_phone?: string
    contact_whatsapp?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
    is_physical_store?: boolean
    address?: string
    city?: string
    province?: string
    country?: string
}

export type MobileSidebarProps = {
    slug: string
    userId: number
}

export type NewStoreCardProps = {
    userId: number
    variant?: "empty" | "add-more"
}

export type PaymentMethodsSwitchesProps = {
    defaultMethods?: PaymentMethod[]
    onPaymentMethodsChange?: (methods: PaymentMethod[]) => void
}

export type SectionContainerProps = {
    children: React.ReactNode
    title: string
    className?: string
    moreLink?: string
}

export type StoreBannerEditorWrapperProps = {
    currentBanner: string | null
    storeName: string
    storeId: number
}

export type StoreBannerEditorProps = {
    currentBanner: string | null
    storeName: string
    onBannerUpdate: (newBannerUrl: string | null) => void
}

export type StoreCardLogoProps = {
    logo: string
    name: string
    className?: string
}

export type StoreFormData = {
    name: string
    description?: string
    subdomain: string
    logo?: string
    contact_phone?: string
    contact_whatsapp?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
    is_physical_store?: boolean
    address?: string
    city?: string
    province?: string
    country?: string
}

export type StoreFormButtonProps = {
    mode: 'create' | 'edit'
    userId: number
    schema: yup.ObjectSchema<Record<string, unknown>>
    action: (payload: StoreFormData) => Promise<ResponseType<unknown>>
    messages: {
        success: string
        error: string
        loading: string
    }
    // Props específicas para crear
    canCreate?: boolean
    className?: string
    // Props específicas para editar
    slug?: string
    store?: Store & {
        operational_settings: StoreOperationalSettings | null
        branches: Branch[]
    }
}

export type StoreHeaderClientProps = {
    store: Pick<Store, "id" | "name" | "logo" | "subdomain" | "slug"> & { _count: { products: number } }
}

export type StoreHeaderProps = {
    slug: string
}

export type StoreHeaderData = {
    id: number
    name: string
    description: string | null
    logo: string | null
    banner: string | null
}

export type StoreInformationFormProps = {
    store: Store & {
        operational_settings: StoreOperationalSettings | null
        branches: (Branch & { operational_settings: BranchOperationalSettings | null, opening_hours: BranchOpeningHour[] })[]
    }
    canManageStore?: boolean
    children?: React.ReactNode
    userId: number
}

export type StoreLogoEditorWrapperProps = {
    currentLogo: string | null
    storeName: string
    storeId: number
}

export type StoreLogoOption = {
    id: string
    url: string
    provider: string
    label: string
    icon: string
    isCurrentlyUsed?: boolean
}

export type StoreLogoEditorProps = {
    currentLogo: string | null
    storeName: string
    onLogoUpdate: (newLogoUrl: string | null) => void
}

export type StoreLogoInlineEditorProps = {
    currentLogo: string | null
    storeName: string
    onLogoUpdate: (newLogoUrl: string | null) => void
}

export type StoreHeaderTinyWidgetsProps = {
    slug: string
}

export type TinyWidgetProps = {
    title: string
    children: React.ReactNode
    href: string
}

export type UpdatePricesButtonProps = {
    selectedRows: RowModel<Product & { categories: Category[] }>
    storeId: number
}

export type UpdateType = "fijo" | "porcentaje"