"use server"

import { actionWrapper } from "@/utils/lib"
import { OrderStatus } from "@prisma/client"
import { updatePendingOrder } from "./updatePendingOrder"
import { updateProcessingOrder } from "./updateProcessingOrder"
import { updateReadyOrder } from "./updateReadyOrder"
import { updateShippedOrder } from "./updateShippedOrder"
import { updateDeliveredOrder } from "./updateDeliveredOrder"
import { updateCancelledOrder } from "./updateCancelledOrder"
import { updateCompletedOrder } from "./updateCompletedOrder"

type UpdateOrderStatusProps = {
    orderId: string
    newStatus: OrderStatus
}

export async function updateOrderStatus({ orderId, newStatus }: UpdateOrderStatusProps) {
    return actionWrapper(async () => {
        // Call specific function based on new status
        switch (newStatus) {
            case "PENDING":
                return await updatePendingOrder({ orderId })
            case "PROCESSING":
                return await updateProcessingOrder({ orderId })
            case "READY":
                return await updateReadyOrder({ orderId })
            case "SHIPPED":
                return await updateShippedOrder({ orderId })
            case "DELIVERED":
                return await updateDeliveredOrder({ orderId })
            case "CANCELLED":
                return await updateCancelledOrder({ orderId })
            case "COMPLETED":
                return await updateCompletedOrder({ orderId })
            default:
                throw new Error("Invalid status")
        }
    })
} 