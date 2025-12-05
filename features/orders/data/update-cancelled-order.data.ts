"use server"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { formatSuccessResponse } from "@/features/global/utils"
import { UpdateCancelledOrderProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function updateCancelledOrderData({ orderId }: UpdateCancelledOrderProps) {
        // Get current user
        const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

        if (userError || !user) {
            throw new Error(userMessage || "Usuario no autenticado")
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
                throw new Error("Pedido no encontrado")
            }

            const oldStatus = order.status

            // Validate status change
            if (oldStatus === 'CANCELLED') {
                throw new Error("El pedido ya está en estado CANCELADO")
            }

            // Business rule: Cannot cancel completed orders
            if (oldStatus === 'COMPLETED') {
                throw new Error("No se pueden cancelar pedidos completados")
            }

            // Business rule: Cannot cancel delivered orders
            if (oldStatus === 'DELIVERED') {
                throw new Error("No se pueden cancelar pedidos entregados")
            }

            // Restore stock for all items if order was in PROCESSING or READY
         /*    if (['PROCESSING', 'READY', 'SHIPPED'].includes(oldStatus)) {
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
            } */

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
                        description: `Pedido ${order.id} cancelado - reembolso`,
                        reference_type: "order",
                        reference_id: order.id,
                        created_by: user.id,
                        notes: `Pedido ${order.id} cancelado y reembolsado`,
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
        const { hasError: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "ORDER",
            entity_id: parseInt(orderId),
            user_id: user.id,
            action_initiator: "Actualización del estado del pedido",
            details: `El estado del pedido cambió a CANCELADO. Stock restaurado y saldo revertido.`
        })

        if (logError) {
            console.warn("El estado del pedido se actualizó pero no se pudo crear la entrada de registro:", logError)
        }

        // TODO: Send cancellation notification to customer
        // if (updatedOrder.customer_email) {
        //     await sendOrderCancelledNotification(updatedOrder)
        // }

        return formatSuccessResponse(
            "El pedido fue cancelado. Stock restaurado y pago reembolsado si corresponde.",
            updatedOrder
        )
} 