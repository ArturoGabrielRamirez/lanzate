import { Store } from "@prisma/client"

export type DashboardStore = Store & {
    _count: {
        products: number
    }
}

export type DashboardStoreStats = {
    storeCount: number
    productCount: number
    operationalSettingsCount: number
    stores: DashboardStore[]
}

export type GetDashboardStoresReturn = {
    message: string
    payload: DashboardStoreStats | null
    error: boolean
} 