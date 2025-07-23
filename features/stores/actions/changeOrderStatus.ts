"use server"

import { formatErrorResponse } from "@/utils/lib"
import { updateOrderStatus } from "../data/updateOrderStatus"
import { revalidatePath } from "next/cache"

type ChangeOrderStatusData = {
    newStatus: string
    confirmPayment: boolean
    confirmStockRestore: boolean
}

export async function changeOrderStatus(orderId: number, data: ChangeOrderStatusData, slug: string, userId: number) {
    try {

        const { payload: updatedOrder, error, message } = await updateOrderStatus(orderId, data, userId)

        if (error) throw new Error(message)

        // Revalidar las rutas relacionadas para actualizar la UI
        revalidatePath(`/stores/${slug}/orders`)
        revalidatePath(`/stores/${slug}/orders/${orderId}`)
        revalidatePath(`/stores/${slug}`)

        return {
            payload: updatedOrder,
            error: false,
            message: "Order status updated successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error updating order status", error)
    }
} 