"use server"

import { PaymentMethod, ShippingMethod } from "@prisma/client"

import { CartItemType } from "@/features/cart/types"
import { insertOrder } from "@/features/checkout/data/insert-order.data"
import { actionWrapper } from "@/features/global/utils"


type CreateNewCheckoutOrderFormData = {
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

export async function createNewCheckoutOrder({
    branch_id,
    total_price,
    total_quantity,
    subdomain,
    payment_method,
    cart,
    processed_by_user_id,
    shipping_method,
    customer_info
}: CreateNewCheckoutOrderFormData) {

    return actionWrapper(async () => {

        const { error, message, payload } = await insertOrder({
            branch_id: branch_id,
            isPaid: true,
            isWalkIn: false,
            payment_method: payment_method,
            cart: cart,
            subdomain: subdomain,
            processed_by_user_id: processed_by_user_id,
            shipping_method: shipping_method,
            total_price: total_price,
            total_quantity: total_quantity,
            customer_info: customer_info
        })

        if (error) throw new Error(message)

        return {
            hasError: false,
            message: "Order created successfully",
            payload: payload
        }
    })
}
