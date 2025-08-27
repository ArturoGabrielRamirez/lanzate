import { Store } from "@prisma/client"

export type Props = {
    storeId: number
    userId: number
    onlyIcon?: boolean
}

// Discriminated union types for unified component
type WithStoreId = {
    storeId?: number
    userId: number
    onlyIcon?: boolean
}

type WithStoreSelection = {
    userId: number
    stores: Store[]
    onlyIcon?: boolean
}

export type UnifiedCreateProductButtonProps = WithStoreId | WithStoreSelection