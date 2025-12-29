"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { CartContextType, CartItemType, ProviderProps } from "@/features/cart/types"

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => { },
    removeFromCart: () => { },
    clearCart: () => { },
    total: 0,
    quantity: 0,
})

export const useCart = () => useContext(CartContext)

function CartProvider({ children }: ProviderProps) {

    const [cart, setCart] = useState<CartItemType[]>([])
    const [total, setTotal] = useState(0)
    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const total = JSON.parse(localStorage.getItem("total") || "0")
        const quantity = JSON.parse(localStorage.getItem("quantity") || "0")

        if (cart.length > 0) {
            setCart(cart)
        }

        if (total > 0) {
            setTotal(total)
        }

        if (quantity > 0) {
            setQuantity(quantity)
        }

    }, [])

    const addToCart = (product: CartItemType) => {
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
        const newCart = cart.filter(item => item.id !== productId)
        const newTotal = total - (cart.find(item => item.id === productId)?.price || 0) * (cart.find(item => item.id === productId)?.quantity || 0)
        const newQuantity = quantity - (cart.find(item => item.id === productId)?.quantity || 0)
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