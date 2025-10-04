export type OverviewTabProps = {
    slug: string
    userId: number
}

export type SalesOverviewData = {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    period: string
}

export type ProductStoreCountData = {
    totalProducts: number
    totalStores: number
    activeProducts: number
    publishedProducts: number
}

export type SalesByMonthData = {
    month: string
    sales: number
    orders: number
    revenue: number
}

export type TopProductData = {
    productId: number
    productName: string
    totalSold: number
    revenue: number
    image?: string
}

export type OverviewData = {
    salesOverview: SalesOverviewData
    productStoreCount: ProductStoreCountData
    salesByMonth: SalesByMonthData[]
    topProducts: TopProductData[]
}

export type QuickAction = {
    label: string
    href: string
    icon: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
} 