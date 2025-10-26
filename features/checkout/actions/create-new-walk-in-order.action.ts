"use server"

import { insertOrderData } from "@/features/checkout/data/insert-order.data"
import { CreateNewWalkInOrderFormData } from "@/features/checkout/types"
import { actionWrapper } from "@/features/global/utils"

export async function createNewWalkInOrderAction({
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

        const { error, message, payload: order } = await insertOrderData({
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
