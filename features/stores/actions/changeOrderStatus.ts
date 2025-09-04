"use server"

import { actionWrapper } from "@/utils/lib"
import { updateOrderStatus } from "../data/updateOrderStatus"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
import { getUserInfo } from "@/features/layout/actions"

type ChangeOrderStatusData = {
    newStatus: string
    confirmPayment: boolean
    confirmStockRestore: boolean
}

export async function changeOrderStatus(orderId: number, data: ChangeOrderStatusData, slug: string) {
    return actionWrapper(async () => {

        const { payload: user, error: userError, message: userMessage } = await getUserInfo()

        if (userError || !user) throw new Error(userMessage)

        const { payload: updatedOrder, error, message } = await updateOrderStatus(orderId, data, user.id)

        if (error) throw new Error(message)

        // Revalidar las rutas relacionadas para actualizar la UI
        revalidatePath(`/dashboard`)
        revalidatePath(`/stores/${slug}/orders`)
        revalidatePath(`/stores/${slug}/orders/${orderId}`)
        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "ORDER",
            entity_id: orderId,
            user_id: user.id,
            action_initiator: "Order status change",
            details: `Order status changed to ${data.newStatus}`
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            payload: updatedOrder,
            error: false,
            message: "Order status updated successfully"
        }

    })
} 