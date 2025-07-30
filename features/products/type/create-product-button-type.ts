import { DashboardStore } from "@/features/dashboard/types/types"

export type Props = {
    storeId: number
    userId: number
}

// Discriminated union types for unified component
type WithStoreId = {
    storeId: number
    userId: number
}

type WithStoreSelection = {
    userId: number
    stores: DashboardStore[]
}

export type UnifiedCreateProductButtonProps = WithStoreId | WithStoreSelection