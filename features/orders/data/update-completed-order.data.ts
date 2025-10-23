"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

type UpdateCompletedOrderProps = {
    orderId: string
}

export async function updateCompletedOrderData({ orderId }: UpdateCompletedOrderProps) {
    return actionWrapper(async () => {
        // Get current user
        const { payload: user, error: userError, message: userMessage } = await getUserInfo()

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

        return {
            message: "Order has been completed successfully",
            payload: updatedOrder,
            error: false
        }

    })
} 