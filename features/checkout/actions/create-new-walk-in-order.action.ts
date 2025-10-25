"use server"

import { PaymentMethod } from "@prisma/client"

import { CartItemType } from "@/features/cart/types"
import { insertOrder } from "@/features/checkout/data/insert-order.data"
import { actionWrapper } from "@/features/global/utils"

type CreateNewWalkInOrderFormData = {
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

export async function createNewWalkInOrder({
    branch_id,
    total_price,
    total_quantity,
    subdomain,
    isPaid,
    payment_method,
    cart,
    processed_by_user_id,
    customer_info
}: CreateNewWalkInOrderFormData) {

    return actionWrapper(async () => {

        const { error, message, payload: order } = await insertOrder({
            branch_id: branch_id,
            isPaid: isPaid,
            isWalkIn: true,
            payment_method: payment_method,
            cart: cart,
            subdomain: subdomain,
            processed_by_user_id: processed_by_user_id,
            shipping_method: "PICKUP",
            total_price: total_price,
            total_quantity: total_quantity,
            customer_info: customer_info,
            status: "COMPLETED"
        })

        if (error) throw new Error(message)

        return {
            hasError: false,
            message: "Order created successfully",
            payload: order
        }
    })
}
