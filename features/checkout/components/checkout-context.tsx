"use client"

import { ShippingMethod } from "@prisma/client"
import { createContext, useContext, useState } from "react"
import { CheckoutContextType, CheckoutProviderProps } from "@/features/checkout/types/types"

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

function useCheckout() {
    const context = useContext(CheckoutContext)
    if (context === undefined) {
        throw new Error("useCheckout must be used within a CheckoutProvider")
    }
    return context
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