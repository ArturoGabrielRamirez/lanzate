import { Order, Store, StoreOperationalSettings, Branch, Product, Category, StoreBalance, ProductStock, PaymentMethod, BranchOperationalSettings, BranchOpeningHour, BranchShippingMethod, ProductVariant, StoreCustomization } from "@prisma/client"
import { RowModel } from "@tanstack/react-table"
import dayjs from "dayjs"
import { ReactNode } from "react"
import * as yup from "yup"

import { DashboardStore } from "@/features/dashboard/types"
import { ResponseType } from "@/features/layout/types"
import { editOperationalSettingsSchema, editSocialMediaSchema, editContactSchema } from "@/features/stores/schemas"

// ============================================================================
// BASE TYPES AND UTILITIES
// ============================================================================

/**
 * Common result type for actions
 */
export type ActionResult<T = unknown> = {
    error: boolean
    message: string
    payload?: T
}

/**
 * Base tab props that all tabs share
 */
export type BaseTabProps = {
    slug: string
    userId: number
}

/**
 * Generic tab props with additional data
 */
export type TabProps<T = Record<string, never>> = BaseTabProps & T

/**
 * Store with common relations
 */
export type StoreWithBranches = Store & { branches: Branch[] }
export type StoreWithSettings = Store & { operational_settings: StoreOperationalSettings | null }
export type StoreWithBranchesAndSettings = StoreWithBranches & StoreWithSettings
export type StoreWithProducts = Store & {
    products: (Product & { variants: ProductVariant[] })[]
    customization: StoreCustomization | null
    operational_settings: StoreOperationalSettings | null
}

export type GetStoreWithProductsReturn = {
    message: string;
    payload: StoreWithProducts | null;
    error: boolean;
};
/**
 * Base store data for forms
 */
export type BaseStoreData = {
    name: string
    description?: string
    subdomain: string
}

/**
 * Generic form props
 */
export type FormProps<T> = {
    mode: 'create' | 'edit'
    data?: T
    onSubmit: (data: T) => Promise<ActionResult>
}

/**
 * Generic action button props
 */
export type ActionButtonProps<T> = {
    data: T
    onSuccess?: () => void
    className?: string
}

// ============================================================================
// STORE-RELATED TYPES
// ============================================================================

export type StoreCardComponentProps = {
    userId: number
    store?: DashboardStore
    isEmpty?: boolean
}


// ============================================================================
// LAYOUT AND NAVIGATION TYPES
// ============================================================================

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

export type TabTriggerLinkProps = {
    value: string
    text: string
    slug: string
    icon?: ReactNode
}

// ============================================================================
// BUTTON TYPES
// ============================================================================

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
    store: StoreWithBranchesAndSettings
}

// ============================================================================
// TAB TYPES (Consolidated using BaseTabProps)
// ============================================================================

export type AccountTabProps = BaseTabProps
export type BranchesTabProps = BaseTabProps
export type ProductsTabProps = BaseTabProps
export type HistoryTabProps = BaseTabProps
export type SettingsTabProps = BaseTabProps
export type OrdersTabProps = BaseTabProps

// ============================================================================
// PAGE TYPES
// ============================================================================

export type OrderDetailPageProps = {
    params: Promise<{ slug: string, id: string }>
}

export type LogDetailPageProps = {
    params: Promise<{ slug: string, id: string }>
}

// ============================================================================
// ORDER STATUS TYPES
// ============================================================================

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

// ============================================================================
// ACTION-RELATED TYPES
// ============================================================================

export type StoreHeaderData = {
    id: number
    name: string
    description: string | null
    logo: string | null
    banner: string | null
    balance: {
        current_balance: number
    } | null
}

export type GetStoreHeaderBySlugReturn = ActionResult<StoreHeaderData | null>

export type GetStoresFromSlugReturn = ActionResult<Store & {
    branches: (Branch & { stock: ProductStock[] })[]
    products: (Product & { categories: Category[] })[]
    balance: StoreBalance | null
    operational_settings: StoreOperationalSettings | null
} | null>

// ============================================================================
// PAYLOAD TYPES (Consolidated using BaseStoreData)
// ============================================================================

export type UpdateOperationalSettingsPayload = {
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

export type UpdateBasicInfoPayload = BaseStoreData

export type UpdateStorePayload = BaseStoreData & {
    contact_phone?: string
    contact_whatsapp?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
}

// ============================================================================
// STORE FORM HELPER TYPES
// ============================================================================

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

// ============================================================================
// FORM SECTIONS TYPES
// ============================================================================

export interface AddressDisplayProps {
    store: StoreWithBranches & { is_physical_store: boolean }
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
    store?: StoreWithBranches
    mode: 'create' | 'edit'
}

export interface BasicInfoDisplayProps {
    store: Store
    userId: number
}

export type BasicInfoFormValues = BaseStoreData

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
    store: StoreWithBranches
}

export interface ContactSectionProps {
    store?: StoreWithBranches
    mode: 'create' | 'edit'
}

export interface OperationalSettingsDisplayProps {
    store: StoreWithSettings & {
        branches?: (Branch & {
            operational_settings: BranchOperationalSettings | null
            shipping_methods: BranchShippingMethod[]
        })[]
    }
}

export interface SocialMediaDisplayProps {
    store: StoreWithBranchesAndSettings
}

export interface SocialMediaSectionProps {
    store?: StoreWithSettings
    mode: 'create' | 'edit'
}

// ============================================================================
// SECTION BUTTONS TYPES (Consolidated using ActionButtonProps)
// ============================================================================

export interface EditAddressButtonProps {
    store: StoreWithBranches
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
    store: StoreWithBranches
    className?: string
    onSuccess?: () => void
}

export interface EditSocialMediaButtonProps {
    store: StoreWithSettings
    className?: string
    onSuccess?: () => void
}

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export type AttentionDateType = {
    date: string
    startTime: dayjs.Dayjs
    endTime: dayjs.Dayjs
    days: string[]
}

export type CreateStoreShippingMethod = {
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
    method: CreateStoreShippingMethod
    index: number
    onCancel: (index: number) => void
    onSave: (index: number, method: CreateStoreShippingMethod) => void
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
    onSubmitAll: (data: CreateStoreFormValues) => Promise<ActionResult>
}

export type CreateStoreFormValues = {
    basic_info: BaseStoreData & {
        logo?: File | string | null
    }
    address_info: AddressFormValues
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
    store: StoreWithSettings
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

export type EditStorePayload = BaseStoreData & {
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

export type MobileSidebarProps = BaseTabProps

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

export type StoreFormData = BaseStoreData & {
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
    store?: StoreWithBranchesAndSettings
}

export type StoreHeaderClientProps = {
    store: Pick<Store, "id" | "name" | "logo" | "subdomain" | "slug"> & { _count: { products: number } }
}

export type StoreHeaderProps = {
    slug: string
}

export type StoreInformationFormProps = {
    store: StoreWithBranchesAndSettings & {
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

export type PriceUpdateType = "fijo" | "porcentaje"

// ============================================================================
// DATA LAYER TYPES
// ============================================================================

export type ProcessedCreateStoreData = CreateStoreFormValues & {
    processedOpeningHours: ProcessedOpeningHour[]
    processedShippingMethods: ProcessedShippingMethod[]
    processedPaymentMethods: ProcessedPaymentMethod[]
}

export type StoreUpdateData = {
    contact_phone?: string
    contact_whatsapp?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
    address?: string
    city?: string
    province?: string
    country?: string
}

// ============================================================================
// SCHEMA TYPE INFERENCES
// ============================================================================

export type EditOperationalSettingsData = yup.InferType<typeof editOperationalSettingsSchema>
export type EditSocialMediaData = yup.InferType<typeof editSocialMediaSchema>
export type EditContactData = yup.InferType<typeof editContactSchema>
