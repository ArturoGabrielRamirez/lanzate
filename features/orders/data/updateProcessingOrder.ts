"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

type UpdateProcessingOrderProps = {
    orderId: string
}

export async function updateProcessingOrder({ orderId }: UpdateProcessingOrderProps) {
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
                    processed_by: true
                }
            })

            if (!order) {
                throw new Error("Order not found")
            }

            const oldStatus = order.status

            // Validate status change
            if (oldStatus === 'PROCESSING') {
                throw new Error("Order is already in PROCESSING status")
            }

            // Business rule: Can only process from PENDING
            if (oldStatus !== 'PENDING') {
                throw new Error(`Cannot change order status from ${oldStatus} to PROCESSING. Order must be in PENDING status.`)
            }

            // Validate stock availability for all items
            for (const item of order.items) {
                if (item.product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Required: ${item.quantity}`)
                }
            }

            // Reserve stock by reducing it
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })

                // Update branch stock if exists
                if (order.branch_id) {
                    await tx.productStock.upsert({
                        where: {
                            product_id_branch_id: {
                                product_id: item.product_id,
                                branch_id: order.branch_id
                            }
                        },
                        update: {
                            quantity: {
                                decrement: item.quantity
                            }
                        },
                        create: {
                            product_id: item.product_id,
                            branch_id: order.branch_id,
                            quantity: Math.max(0, item.product.stock - item.quantity)
                        }
                    })
                }
            }

            // Update order status
            const finalOrder = await tx.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    status: "PROCESSING",
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
            details: `Order status changed to PROCESSING. Stock reserved for all items.`
        })

        if (logError) {
            console.warn("Order status updated but failed to create log entry:", logError)
        }

        return {
            message: "Order status updated to PROCESSING successfully. Stock has been reserved.",
            payload: updatedOrder,
            error: false
        }

    })
} 