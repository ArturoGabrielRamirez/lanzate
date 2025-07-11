"use client"

import { createContext, useContext, useState } from "react"

type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
}

type CartContextType = {
    cart: CartItem[]
    addToCart: (product: CartItem) => void
    removeFromCart: (productId: string) => void
    clearCart: () => void
    total: number
    quantity: number
}

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => { },
    removeFromCart: () => { },
    clearCart: () => { },
    total: 0,
    quantity: 0,
})

type Props = {
    children: React.ReactNode
}

export const useCart = () => useContext(CartContext)

function CartProvider({ children }: Props) {

    const [cart, setCart] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)
    const [quantity, setQuantity] = useState(0)

    const addToCart = (product: CartItem) => {
        // check if the product is already in the cart
        const existingProduct = cart.find(item => item.id === product.id)
        if (existingProduct) {
            setCart(prev => prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
            setCart(prev => [...prev, product])
        }
        setTotal(prev => prev + product.price)
        setQuantity(prev => prev + 1)
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId))
        setTotal(prev => prev - (cart.find(item => item.id === productId)?.price || 0))
        setQuantity(prev => prev - 1)
    }

    const clearCart = () => {
        setCart([])
        setTotal(0)
        setQuantity(0)
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, quantity }}>
            {children}
        </CartContext.Provider>
    )
}
export default CartProvider