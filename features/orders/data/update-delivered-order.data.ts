"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

type UpdateDeliveredOrderProps = {
    orderId: string
}

export async function updateDeliveredOrderData({ orderId }: UpdateDeliveredOrderProps) {
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
            if (oldStatus === 'DELIVERED') {
                throw new Error("Order is already in DELIVERED status")
            }

            // Business rule: Can only deliver from READY (pickup) or SHIPPED (delivery)
            const allowedFromStatuses = order.shipping_method === 'PICKUP' 
                ? ['READY'] 
                : ['SHIPPED']

            if (!allowedFromStatuses.includes(oldStatus)) {
                throw new Error(`Cannot change order status from ${oldStatus} to DELIVERED. Order must be in ${allowedFromStatuses.join(' or ')} status.`)
            }

            // Update order status
            const finalOrder = await tx.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    status: "DELIVERED",
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
            details: `Order status changed to DELIVERED. Order has been ${updatedOrder.shipping_method === 'PICKUP' ? 'picked up' : 'delivered'} to customer.`
        })

        if (logError) {
            console.warn("Order status updated but failed to create log entry:", logError)
        }

        // TODO: Send delivery confirmation to customer
        // if (updatedOrder.customer_email) {
        //     await sendOrderDeliveredNotification(updatedOrder)
        // }

        return {
            message: `Order has been ${updatedOrder.shipping_method === 'PICKUP' ? 'picked up' : 'delivered'} successfully`,
            payload: updatedOrder,
            error: false
        }

    })
} 