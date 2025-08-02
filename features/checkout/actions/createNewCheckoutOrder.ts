"use server"

import { actionWrapper } from "@/utils/lib"
import { insertOrder } from "../data/insertOrder"


type CreateNewCheckoutOrderFormData = {
    branch_id: number
    total_price: number
    total_quantity: number
    subdomain: string
    payment_method: string
    cart: { quantity: number, id: number, price: number }[]
    processed_by_user_id: number
    shipping_method: "delivery" | "pickup"
    customer_info: {
        name: string
        phone: string
        email: string
        id: number
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

        const { error, message } = await insertOrder({
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
            error: false,
            message: "Order created successfully"
        }
    })
}
