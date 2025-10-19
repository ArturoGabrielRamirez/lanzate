"use server"

import { actionWrapper } from "@/utils/lib"
import { selectOrderById } from "../../stores/data/selectOrderById"
import { Order, OrderItem, OrderPayment, OrderTracking, Product, Store } from "@prisma/client"

type GetOrderDetailsResponse = {
    payload: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & {
        store: Store
    } | null
    error: boolean
    message: string
}

export async function getOrderDetails(id: string): Promise<GetOrderDetailsResponse> {
    return actionWrapper(async () => {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid order id")

        const { payload: order, error, message } = await selectOrderById(parsedId)

        if (error) throw new Error(message)

        return {
            payload: order,
            error: false,
            message: "Order details fetched successfully"
        }

    })
} 