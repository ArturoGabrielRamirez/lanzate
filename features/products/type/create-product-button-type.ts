import { Store } from "@prisma/client"

export type Props = {
    storeId: number
    userId: number
}

// Discriminated union types for unified component
type WithStoreId = {
    storeId?: number
    userId: number
}

type WithStoreSelection = {
    userId: number
    stores: Store[]
}

export type UnifiedCreateProductButtonProps = WithStoreId | WithStoreSelection