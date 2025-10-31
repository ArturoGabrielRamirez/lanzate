import { Branch, OrderStatus, PaymentMethod, ShippingMethod } from "@prisma/client"
import { ReactNode } from "react"

import { CartItemType } from "@/features/cart/types"

// Context
export interface CheckoutContextType {
    shippingMethod: ShippingMethod
    setShippingMethod: (method: ShippingMethod) => void
}

export interface CheckoutProviderProps {
    children: ReactNode
    initialShippingMethod?: ShippingMethod
}

// Components props
export interface CheckoutStepItemProps {
    step: number
    title: string
    description: string
    errorFields?: string[]
}

export interface PaymentInformationProps {
    paymentMethod: PaymentMethod
    onChange: (method: PaymentMethod) => void
    allowedPaymentMethods: PaymentMethod[]
}

export interface ShippingMethodSelectorProps {
    value: ShippingMethod
    onChange: (method: ShippingMethod) => void
    offersDelivery: boolean
    deliveryPrice: number
}

export interface BranchSelectorProps {
    branches: Branch[]
    value: number | null
    onChange: (branchId: number) => void
}

// Actions types
export type CreateNewCheckoutOrderFormData = {
    branch_id: number
    total_price: number
    total_quantity: number
    subdomain: string
    payment_method: PaymentMethod
    cart: CartItemType[]
    processed_by_user_id: number
    shipping_method: ShippingMethod
    customer_info: {
        name: string
        phone: string
        email: string
        id?: number
        address_one?: string
        address_two?: string
        city?: string
        state?: string
        zip_code?: string
        country?: string
    }
}

export type CreateNewWalkInOrderFormData = {
    branch_id: number
    total_price: number
    total_quantity: number
    subdomain: string
    isPaid: boolean
    payment_method: PaymentMethod
    cart: CartItemType[]
    processed_by_user_id: number
    customer_info: {
        name?: string
        phone?: string
        email?: string
        id?: number
    }
}

export type InsertOrderProps = {
    subdomain: string,
    branch_id: number,
    total_price: number,
    total_quantity: number,
    shipping_method: "DELIVERY" | "PICKUP",
    processed_by_user_id: number,
    payment_method: PaymentMethod,
    cart: CartItemType[],
    isWalkIn: boolean,
    isPaid: boolean,
    customer_info?: {
        name?: string,
        phone?: string,
        email?: string,
        id?: number,
        address_one?: string,
        address_two?: string,
        city?: string,
        state?: string,
        zip_code?: string,
        country?: string
    },
    status?: OrderStatus
}

export interface CheckFormData {
    name: string
    email: string
    phone: string
    address?: string
    city?: string
    state?: string
    country?: string
    zip_code?: string
}