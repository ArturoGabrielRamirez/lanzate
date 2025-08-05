"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

type UpdateShippedOrderProps = {
    orderId: string
}

export async function updateShippedOrder({ orderId }: UpdateShippedOrderProps) {
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
            if (oldStatus === 'SHIPPED') {
                throw new Error("Order is already in SHIPPED status")
            }

            // Business rule: Can only ship delivery orders
            if (order.shipping_method !== 'DELIVERY') {
                throw new Error("Cannot ship pickup orders. This order is for pickup.")
            }

            // Business rule: Can only ship from READY
            if (oldStatus !== 'READY') {
                throw new Error(`Cannot change order status from ${oldStatus} to SHIPPED. Order must be in READY status.`)
            }

            // Validate delivery address exists
            if (!order.address_one || !order.city) {
                throw new Error("Cannot ship order without complete delivery address")
            }

            // Update order status
            const finalOrder = await tx.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    status: "SHIPPED",
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
            details: `Order status changed to SHIPPED. Order is now in transit to customer.`
        })

        if (logError) {
            console.warn("Order status updated but failed to create log entry:", logError)
        }

        // TODO: Send shipping notification to customer
        // if (updatedOrder.customer_email) {
        //     await sendOrderShippedNotification(updatedOrder)
        // }

        return {
            message: "Order has been shipped and is now in transit",
            payload: updatedOrder,
            error: false
        }

    })
} 