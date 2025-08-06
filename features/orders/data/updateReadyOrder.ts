"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

type UpdateReadyOrderProps = {
    orderId: string
}

export async function updateReadyOrder({ orderId }: UpdateReadyOrderProps) {
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
            if (oldStatus === 'READY') {
                throw new Error("Order is already in READY status")
            }

            // Business rule: Can only set to READY from PROCESSING
            if (oldStatus !== 'PROCESSING') {
                throw new Error(`Cannot change order status from ${oldStatus} to READY. Order must be in PROCESSING status.`)
            }

            // Validate that all items are prepared (stock is already reserved)
            for (const item of order.items) {
                if (item.product.stock < 0) {
                    throw new Error(`Stock issue detected for ${item.product.name}. Please check inventory.`)
                }
            }

            // Update order status
            const finalOrder = await tx.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    status: "READY",
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
            details: `Order status changed to READY. Order is prepared for ${updatedOrder.shipping_method === 'PICKUP' ? 'pickup' : 'delivery'}.`
        })

        if (logError) {
            console.warn("Order status updated but failed to create log entry:", logError)
        }

        // TODO: Send notification to customer
        // if (updatedOrder.customer_email) {
        //     await sendOrderReadyNotification(updatedOrder)
        // }

        return {
            message: `Order is now READY for ${updatedOrder.shipping_method === 'PICKUP' ? 'pickup' : 'delivery'}`,
            payload: updatedOrder,
            error: false
        }

    })
} 