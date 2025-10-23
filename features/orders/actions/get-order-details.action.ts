"use server"

import { actionWrapper } from "@/utils/lib"
import { selectOrderByIdData } from "../data/select-order-by-id.data"
import { Order, OrderItem, OrderPayment, OrderTracking, Product, Store } from "@prisma/client"

type GetOrderDetailsResponse = {
    payload: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & {
        store: Store
    } | null
    error: boolean
    message: string
}

export async function getOrderDetailsAction(id: string): Promise<GetOrderDetailsResponse> {
    return actionWrapper(async () => {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid order id")

        const { payload: order, error, message } = await selectOrderByIdData(parsedId)

        if (error) throw new Error(message)

        return {
            payload: order,
            error: false,
            message: "Order details fetched successfully"
        }

    })
} 