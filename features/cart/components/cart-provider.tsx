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

    const [cart, setCart] = useState<CartItem[]>(JSON.parse(localStorage.getItem("cart") || "[]"))
    const [total, setTotal] = useState(JSON.parse(localStorage.getItem("total") || "0"))
    const [quantity, setQuantity] = useState(JSON.parse(localStorage.getItem("quantity") || "0"))

    const addToCart = (product: CartItem) => {
        const existingProduct = cart.find(item => item.id === product.id)
        let newCart = []
        let newTotal = 0
        let newQuantity = 0

        if (existingProduct) {
            newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
            newTotal = total + product.price
            newQuantity = quantity + 1
        } else {
            newCart = [...cart, product]
            newTotal = total + product.price
            newQuantity = quantity + 1
        }
        setCart(newCart)
        setTotal(newTotal)
        setQuantity(newQuantity)
        localStorage.setItem("cart", JSON.stringify(newCart))
        localStorage.setItem("total", JSON.stringify(newTotal))
        localStorage.setItem("quantity", JSON.stringify(newQuantity))
    }

    const removeFromCart = (productId: string) => {
        let newCart = cart.filter(item => item.id !== productId)
        let newTotal = total - (cart.find(item => item.id === productId)?.price || 0)
        let newQuantity = quantity - 1
        setCart(newCart)
        setTotal(newTotal)
        setQuantity(newQuantity)
        localStorage.setItem("cart", JSON.stringify(newCart))
        localStorage.setItem("total", JSON.stringify(newTotal))
        localStorage.setItem("quantity", JSON.stringify(newQuantity))
    }

    const clearCart = () => {
        setCart([])
        setTotal(0)
        setQuantity(0)
        localStorage.removeItem("cart")
        localStorage.removeItem("total")
        localStorage.removeItem("quantity")
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, quantity }}>
            {children}
        </CartContext.Provider>
    )
}
export default CartProvider