"use server"

import { revalidatePath } from "next/cache"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { insertLogEntry } from "@/features/global/data/insertLogEntry"
import { updateOrderStatusData } from "@/features/orders/data/update-order-status.data"
import { ChangeOrderStatusData } from "@/features/orders/types"

export async function changeOrderStatusAction(orderId: number, data: ChangeOrderStatusData, slug: string) {
    return actionWrapper(async () => {

        const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

        if (userError || !user) throw new Error(userMessage)

        const { payload: updatedOrder, hasError: error, message } = await updateOrderStatusData(orderId, data, user.id)

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

        return formatSuccessResponse(message, updatedOrder)

    })
} 