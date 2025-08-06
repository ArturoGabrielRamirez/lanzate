"use server"

import { actionWrapper } from "@/utils/lib"
import { updateOrderStatus } from "../data/updateOrderStatus"
import { revalidatePath } from "next/cache"
import { OrderStatus } from "@prisma/client"

type UpdateOrderStatusActionProps = {
    orderId: string
    newStatus: OrderStatus
}

export async function updateOrderStatusAction({ orderId, newStatus }: UpdateOrderStatusActionProps) {
    return actionWrapper(async () => {
        const { payload: updatedOrder, error, message } = await updateOrderStatus({ orderId, newStatus })

        if (error) throw new Error(message)

        // Revalidate the current path to refresh the order details
        revalidatePath(`/stores/[slug]/orders/[id]`)

        return {
            message: "Order status updated successfully",
            payload: updatedOrder,
            error: false
        }

    })
} 