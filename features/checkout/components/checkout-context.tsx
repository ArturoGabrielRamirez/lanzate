"use client"

import { ShippingMethod } from "@prisma/client"
import { createContext, useContext, useState, ReactNode } from "react"

interface CheckoutContextType {
    shippingMethod: ShippingMethod
    setShippingMethod: (method: ShippingMethod) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

function useCheckout() {
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

function CheckoutProvider({ children, initialShippingMethod = "PICKUP" }: CheckoutProviderProps) {
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(initialShippingMethod)

    return (
        <CheckoutContext.Provider value={{ shippingMethod, setShippingMethod }}>
            {children}
        </CheckoutContext.Provider>
    )
}

export { CheckoutProvider, useCheckout }