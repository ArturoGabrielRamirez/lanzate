"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

type UpdateOrderShippingMethodProps = {
    orderId: string
    newShippingMethod: "PICKUP" | "DELIVERY"
}

export async function updateOrderShippingMethod({ orderId, newShippingMethod }: UpdateOrderShippingMethodProps) {
    return actionWrapper(async () => {
        // Get current user
        const { payload: user, error: userError, message: userMessage } = await getUserInfo()

        if (userError || !user) {
            throw new Error(userMessage || "User not authenticated")
        }

        // Get current order to check old shipping method
        const currentOrder = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            select: {
                shipping_method: true,
                status: true,
                address_one: true,
                city: true,
                branch_id: true
            }
        })

        if (!currentOrder) {
            throw new Error("Order not found")
        }

        const oldShippingMethod = currentOrder.shipping_method

        // Validate shipping method change
        if (oldShippingMethod === newShippingMethod) {
            throw new Error(`Order is already set to ${newShippingMethod}`)
        }

        // Business rule: Cannot change shipping method for certain statuses
        const restrictedStatuses = ['SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED']
        if (restrictedStatuses.includes(currentOrder.status)) {
            throw new Error(`Cannot change shipping method for orders in ${currentOrder.status} status`)
        }

        // Business rule: If changing to DELIVERY, validate delivery address exists
        if (newShippingMethod === 'DELIVERY') {
            if (!currentOrder.address_one || !currentOrder.city) {
                throw new Error("Cannot change to delivery without complete delivery address")
            }
        }

        // Business rule: If changing to PICKUP, validate branch exists
        if (newShippingMethod === 'PICKUP') {
            if (!currentOrder.branch_id) {
                throw new Error("Cannot change to pickup without selecting a branch")
            }
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

            // Update order shipping method
            const finalOrder = await tx.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    shipping_method: newShippingMethod,
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
            action_initiator: "Order shipping method update",
            details: `Order shipping method changed from ${oldShippingMethod} to ${newShippingMethod}`
        })

        if (logError) {
            console.warn("Order shipping method updated but failed to create log entry:", logError)
        }

        // TODO: Send notification to customer about shipping method change
        // if (updatedOrder.customer_email) {
        //     await sendShippingMethodChangeNotification(updatedOrder, oldShippingMethod)
        // }

        return {
            message: `Order shipping method updated to ${newShippingMethod} successfully`,
            payload: updatedOrder,
            error: false
        }

    })
} 