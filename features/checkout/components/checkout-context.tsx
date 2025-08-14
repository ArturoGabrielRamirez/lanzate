"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { ShippingMethod } from "@prisma/client"

interface CheckoutContextType {
    shippingMethod: ShippingMethod
    setShippingMethod: (method: ShippingMethod) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function useCheckout() {
    const context = useContext(CheckoutContext)
    if (context === undefined) {
        throw new Error("useCheckout must be used within a CheckoutProvider")
    }
    return context
}

interface CheckoutProviderProps {
    children: ReactNode
    initialShippingMethod?: ShippingMethod
}

export function CheckoutProvider({ children, initialShippingMethod = "PICKUP" }: CheckoutProviderProps) {
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(initialShippingMethod)

    return (
        <CheckoutContext.Provider value={{ shippingMethod, setShippingMethod }}>
            {children}
        </CheckoutContext.Provider>
    )
} 