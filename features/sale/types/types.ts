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