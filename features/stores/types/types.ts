import { DashboardStore } from "@/features/dashboard/types"

export type StoreCardProps = {
    userId: number
    store?: DashboardStore
    isEmpty?: boolean
}