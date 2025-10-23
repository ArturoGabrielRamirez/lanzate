"use server"

import { formatSuccessResponse } from "@/features/global/utils"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
import { prisma } from "@/utils/prisma"

type UpdateCancelledOrderProps = {
    orderId: string
}

export async function updateCancelledOrderData({ orderId }: UpdateCancelledOrderProps) {
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
                    processed_by: true
                }
            })

            if (!order) {
                throw new Error("Order not found")
            }

            const oldStatus = order.status

            // Validate status change
            if (oldStatus === 'CANCELLED') {
                throw new Error("Order is already in CANCELLED status")
            }

            // Business rule: Cannot cancel completed orders
            if (oldStatus === 'COMPLETED') {
                throw new Error("Cannot cancel completed orders")
            }

            // Business rule: Cannot cancel delivered orders
            if (oldStatus === 'DELIVERED') {
                throw new Error("Cannot cancel delivered orders")
            }

            // Restore stock for all items if order was in PROCESSING or READY
            if (['PROCESSING', 'READY', 'SHIPPED'].includes(oldStatus)) {
                for (const item of order.items) {
                    // Restore main product stock
                    await tx.product.update({
                        where: { id: item.product_id },
                        data: {
                            stock: {
                                increment: item.quantity
                            }
                        }
                    })

                    // Restore branch stock if exists
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
                                    increment: item.quantity
                                }
                            },
                            create: {
                                product_id: item.product_id,
                                branch_id: order.branch_id,
                                quantity: item.quantity
                            }
                        })
                    }
                }
            }

            // Reverse store balance if order was paid
            if (order.is_paid && order.store.balance) {
                const currentBalance = order.store.balance.current_balance
                const newBalance = currentBalance - order.total_price

                await tx.storeBalance.update({
                    where: { id: order.store.balance.id },
                    data: {
                        current_balance: newBalance
                    }
                })

                // Create refund transaction
                await tx.transaction.create({
                    data: {
                        store_id: order.store_id,
                        type: "REFUND",
                        amount: order.total_price,
                        balance_before: currentBalance,
                        balance_after: newBalance,
                        description: `Order ${order.id} cancelled - refund`,
                        reference_type: "order",
                        reference_id: order.id,
                        created_by: user.id,
                        notes: `Order ${order.id} cancelled and refunded`,
                        branch_id: order.branch_id
                    }
                })
            }

            // Update payment status to cancelled if exists
            if (order.payment) {
                await tx.orderPayment.update({
                    where: { id: order.payment.id },
                    data: {
                        status: "CANCELLED"
                    }
                })
            }

            // Update order status
            const finalOrder = await tx.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    status: "CANCELLED",
                    updated_at: new Date(),
                    processed_by_user_id: user.id,
                    is_paid: false,
                    payment_date: null
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
            details: `Order status changed to CANCELLED. Stock restored and balance reversed.`
        })

        if (logError) {
            console.warn("Order status updated but failed to create log entry:", logError)
        }

        // TODO: Send cancellation notification to customer
        // if (updatedOrder.customer_email) {
        //     await sendOrderCancelledNotification(updatedOrder)
        // }

        return formatSuccessResponse(
            "Order has been cancelled. Stock restored and payment refunded if applicable.",
            updatedOrder
        )
} 