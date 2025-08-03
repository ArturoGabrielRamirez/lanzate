"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { OrderStatus } from "@prisma/client"

type UpdateOrderStatusProps = {
    orderId: string
    newStatus: OrderStatus
}

// Individual status update functions
async function updatePendingOrder(orderId: number, userId: number) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "PENDING",
            updated_at: new Date()
        }
    })
}

async function updateProcessingOrder(orderId: number, userId: number) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "PROCESSING",
            updated_at: new Date()
        }
    })
}

async function updateReadyOrder(orderId: number, userId: number) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "READY",
            updated_at: new Date()
        }
    })
}

async function updateShippedOrder(orderId: number, userId: number) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "SHIPPED",
            updated_at: new Date()
        }
    })
}

async function updateDeliveredOrder(orderId: number, userId: number) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "DELIVERED",
            updated_at: new Date()
        }
    })
}

async function updateCancelledOrder(orderId: number, userId: number) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "CANCELLED",
            updated_at: new Date()
        }
    })
}

async function updateCompletedOrder(orderId: number, userId: number) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "COMPLETED",
            updated_at: new Date()
        }
    })
}

export async function updateOrderStatus({ orderId, newStatus }: UpdateOrderStatusProps) {
    return actionWrapper(async () => {
        // Get current user
        const { payload: user, error: userError, message: userMessage } = await getUserInfo()

        if (userError || !user) {
            throw new Error(userMessage || "User not authenticated")
        }

        // Verify order exists
        const order = await prisma.order.findUnique({
            where: {
                id: parseInt(orderId)
            },
            select: {
                id: true,
                status: true
            }
        })

        if (!order) {
            throw new Error("Order not found")
        }

        if (order.status === newStatus) {
            throw new Error("Order is already in this status")
        }

        let updatedOrder

        // Call specific function based on new status
        switch (newStatus) {
            case "PENDING":
                updatedOrder = await updatePendingOrder(parseInt(orderId), user.id)
                break
            case "PROCESSING":
                updatedOrder = await updateProcessingOrder(parseInt(orderId), user.id)
                break
            case "READY":
                updatedOrder = await updateReadyOrder(parseInt(orderId), user.id)
                break
            case "SHIPPED":
                updatedOrder = await updateShippedOrder(parseInt(orderId), user.id)
                break
            case "DELIVERED":
                updatedOrder = await updateDeliveredOrder(parseInt(orderId), user.id)
                break
            case "CANCELLED":
                updatedOrder = await updateCancelledOrder(parseInt(orderId), user.id)
                break
            case "COMPLETED":
                updatedOrder = await updateCompletedOrder(parseInt(orderId), user.id)
                break
            default:
                throw new Error("Invalid status")
        }

        return {
            message: `Order status updated to ${newStatus} successfully`,
            payload: updatedOrder,
            error: false
        }

    })
} 