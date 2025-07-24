export type DashboardStore = {
    id: number
    name: string
    description: string | null
    logo: string | null
    slogan: string | null
    slug: string
    subdomain: string
    created_at: Date
    updated_at: Date
    user_id: number
}

export type DashboardStoreStats = {
    storeCount: number
    productCount: number
    stores: DashboardStore[]
}

export type GetDashboardStoresReturn = {
    message: string
    payload: DashboardStoreStats | null
    error: boolean
} 