import { StoreOperationalSettings } from "@prisma/client"

export type CartItemType = {
    id: string
    name?: string
    price: number
    quantity: number,
    image?: string
}

export type CartContextType = {
    cart: CartItemType[]
    addToCart: (product: CartItemType) => void
    removeFromCart: (productId: string) => void
    clearCart: () => void
    total: number
    quantity: number
}

export type CartItemProps = {
    item: CartItemType
}

export type ProviderProps = {
    children: React.ReactNode
}

export interface CartResumeProps {
    operationalSettings?: StoreOperationalSettings | null
}