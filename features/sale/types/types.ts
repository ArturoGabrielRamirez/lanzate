import { PaymentMethod } from '@prisma/client'

export type BarcodeScannerConfig = {
    intervalBetweenKeyPress: number
    scanningEndTimeout: number
    historyLength: number
    ignoreOnInputs: boolean
    debug: boolean
}

export type ScannedData = {
    data: string
    timestamp: Date
}

export type BarcodeScannerHookOptions = {
    enabled?: boolean
    config?: Partial<BarcodeScannerConfig>
    onScanned?: (data: ScannedData) => void
    onScanStart?: () => void
    onScanEnd?: () => void
}

export type BarcodeScannerHookReturn = {
    isScanning: boolean
    lastScanned: string | null
    scanHistory: string[]
}

export type ScannedProduct = {
    id: number
    name: string
    description?: string
    price: number
    stock: number
    barcode?: string
    sku: string
    slug: string
    image?: string
    totalStock: number
    categories: Array<{
        id: number
        name: string
    }>
    stock_entries: Array<{
        quantity: number
        branch: {
            id: number
            name: string
        }
    }>
}

export type ProductSearchResult = {
    product: ScannedProduct | null
    message: string
    isLoading: boolean
    error: boolean
}

export type CartItem = {
    product: ScannedProduct
    quantity: number
    addedAt: Date
}

export type Cart = {
    items: CartItem[]
    total: number
    itemCount: number
}

export type ProductSearchByNameResult = {
    products: ScannedProduct[]
    message: string
    isLoading: boolean
    error: boolean
}

// Component Props Types
export type CustomerInfo = {
    name: string
    phone: string
    email: string
}

export type ActionsSectionProps = {
    cartTotal: number
    cartItemCount: number
    onFinalizeSale: (formData: { paymentMethod: PaymentMethod; customerInfo: CustomerInfo }) => Promise<{ error: boolean; payload: unknown; message: string }>
    onRefund: () => void
    onClearCart: () => void
    onCalculateChange: () => void
    onPrintReceipt: () => void
    disabled?: boolean
    selectedPaymentMethod: PaymentMethod
    setSelectedPaymentMethod: (method: PaymentMethod) => void
    customerInfo: CustomerInfo
    setCustomerInfo: (info: CustomerInfo) => void
    branchName?: string
    isFinalizingSale?: boolean
}

export type BarcodeScannerCammeraButtonProps = {
    onProductScanned?: (barcode: string) => void
}

export type BarcodeScannerUSBProps = {
    onProductScanned?: (barcode: string) => void
    className?: string
}

export type CalculateChangeButtonProps = {
    cartTotal: number
    disabled?: boolean
    className?: string
}

export type ChangeFormData = {
    paymentAmount: string
}

export type CartSectionProps = {
    cartItems: CartItem[]
    onUpdateQuantity: (productId: number, newQuantity: number) => void
    onRemoveItem: (productId: number) => void
}

export type FinalizeSaleButtonProps = {
    cartTotal: number
    cartItemCount: number
    disabled?: boolean
    className?: string
    onConfirm: (formData: { paymentMethod: PaymentMethod; customerInfo: CustomerInfo }) => Promise<{ error: boolean; payload: unknown; message: string }>
    selectedPaymentMethod: PaymentMethod
    setSelectedPaymentMethod: (method: PaymentMethod) => void
    customerInfo: CustomerInfo
    setCustomerInfo: (info: CustomerInfo) => void
    branchName?: string
    isFinalizingSale?: boolean
}

export type FinalizeSaleFormData = {
    paymentMethod: PaymentMethod
    includeCustomerInfo: boolean
    name: string
    phone: string
    email: string
}

export type ProductResultsProps = {
    searchResults: ProductSearchByNameResult
    barcodeResult: ProductSearchResult
    onAddToCart: (product: ScannedProduct) => void
    onClearResults?: () => void
}

export type SaleInterfaceProps = {
    storeName: string
    storeDescription?: string
    storeId: number
    branchId: number
    subdomain: string
    processed_by_user_id: number
    branchName?: string
}

export type SearchSectionProps = {
    storeId: number
    onAddToCart: (product: ScannedProduct) => void
    onSearchResults: (results: ProductSearchByNameResult) => void
}

export type SearchSectionRef = {
    clearSearch: () => void
    focusSearch: () => void
}