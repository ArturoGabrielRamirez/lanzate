export type CartItemType = {
    id: string
    name: string
    price: number
    quantity: number
}

export type CartContextType = {
    cart: CartItemType[]
    addToCart: (product: CartItemType) => void
    removeFromCart: (productId: string) => void
    clearCart: () => void
    total: number
    quantity: number
}
