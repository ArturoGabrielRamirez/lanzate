"use server"

import { formatSuccessResponse } from "@/features/global/utils"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { UpdateCompletedOrderProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function updateCompletedOrderData({ orderId }: UpdateCompletedOrderProps) {
    // Get current user
    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        throw new Error(userMessage || "User not authenticated")
    }

    // Use transaction for consistency
    const updatedOrder = await prisma.$transaction(async (tx) => {
        // Get order with all necessary relations
        const order = await tx.order.findUnique({
            where: { id: parseInt(orderId) },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true,
                store: {
                    include: {
                        balance: true
                    }
                },
                branch: true,
                processed_by: true,
                customer: true
            }
        })

        if (!order) {
            throw new Error("Order not found")
        }

        const oldStatus = order.status

        // Validate status change
        if (oldStatus === 'COMPLETED') {
            throw new Error("Order is already in COMPLETED status")
        }

        // Business rule: Can only complete from DELIVERED
        if (oldStatus !== 'DELIVERED') {
            throw new Error(`Cannot change order status from ${oldStatus} to COMPLETED. Order must be in DELIVERED status.`)
        }

        // Validate that order was delivered successfully
        if (!order.is_paid) {
            throw new Error("Cannot complete unpaid order")
        }

        // Update order status
        const finalOrder = await tx.order.update({
            where: { id: parseInt(orderId) },
            data: {
                status: "COMPLETED",
                updated_at: new Date(),
                processed_by_user_id: user.id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true,
                store: true,
                branch: true,
                customer: true,
                processed_by: true
            }
        })

        return finalOrder
    })

    // Create audit log
    const { error: logError } = await insertLogEntry({
        action: "UPDATE",
        entity_type: "ORDER",
        entity_id: parseInt(orderId),
        user_id: user.id,
        action_initiator: "Order status update",
        details: `Order status changed to COMPLETED. Order has been successfully finalized.`
    })

    if (logError) {
        console.warn("Order status updated but failed to create log entry:", logError)
    }

    // TODO: Send completion notification to customer
    // if (updatedOrder.customer_email) {
    //     await sendOrderCompletedNotification(updatedOrder)
    // }

    // TODO: Send satisfaction survey
    // if (updatedOrder.customer_email) {
    //     await sendSatisfactionSurvey(updatedOrder)
    // }

    return formatSuccessResponse("Order has been completed successfully", updatedOrder)
} 