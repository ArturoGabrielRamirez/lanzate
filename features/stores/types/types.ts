import { DashboardStore } from "@/features/dashboard/types"

export type StoreCardProps = {
    userId: number
    store?: DashboardStore
    isEmpty?: boolean
}

export type NewStoreCardProps = {
    variant?: "empty" | "add-more"
}