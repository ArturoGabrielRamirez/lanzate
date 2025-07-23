"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"

type ChangeOrderStatusData = {
    newStatus: string
    confirmPayment: boolean
    confirmStockRestore: boolean
}

export async function updateOrderStatus(orderId: number, data: ChangeOrderStatusData, userId: number) {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        // Usar transacción para asegurar consistencia
        const updatedOrder = await client.$transaction(async (tx) => {

            // Obtener la orden con todas las relaciones necesarias
            const order = await tx.order.findUnique({
                where: { id: orderId },
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
                    branch: true
                }
            })

            if (!order) throw new Error("Order not found")

            const oldStatus = order.status
            const newStatus = data.newStatus as any // Cast to OrderStatus enum

            // Validar que el status ha cambiado
            if (oldStatus === newStatus) {
                throw new Error("New status must be different from current status")
            }

            // Lógica específica para cancelación
            if (newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED') {
                if (!data.confirmStockRestore) {
                    throw new Error("Stock restore confirmation is required for cancellation")
                }

                // Restaurar stock para cada producto
                for (const item of order.items) {
                    // Restaurar stock del producto principal
                    await tx.product.update({
                        where: { id: item.product_id },
                        data: {
                            stock: {
                                increment: item.quantity
                            }
                        }
                    })

                    // Restaurar stock en la sucursal si existe
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

                // Revertir balance de la tienda
                if (order.store.balance) {
                    const currentBalance = order.store.balance.current_balance
                    const newBalance = currentBalance - order.total_price

                    await tx.storeBalance.update({
                        where: { id: order.store.balance.id },
                        data: {
                            current_balance: newBalance
                        }
                    })

                    // Crear transacción de reembolso
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
                            created_by: userId,
                            notes: `Order ${order.id} cancelled and refunded`,
                            branch_id: order.branch_id
                        }
                    })
                }

                // Actualizar payment a cancelled si existe
                if (order.payment) {
                    await tx.orderPayment.update({
                        where: { id: order.payment.id },
                        data: {
                            status: "PENDING" // No hay status CANCELLED en OrderPaymentStatus
                        }
                    })
                }
            }

            // Lógica para cambio de PENDING a otro status (excepto CANCELLED)
            if (oldStatus === 'PENDING' && newStatus !== 'CANCELLED') {
                if (!data.confirmPayment) {
                    throw new Error("Payment confirmation is required when changing from PENDING status")
                }

                // Marcar orden como pagada
                const now = new Date()
                await tx.order.update({
                    where: { id: orderId },
                    data: {
                        is_paid: true,
                        payment_date: now
                    }
                })

                // Actualizar payment a PAID
                if (order.payment) {
                    await tx.orderPayment.update({
                        where: { id: order.payment.id },
                        data: {
                            status: "PAID"
                        }
                    })
                }
            }

            // Actualizar el status de la orden
            const finalOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: newStatus,
                    updated_by_employee_id: null, // Por ahora null, se puede agregar lógica de empleados después
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
                    user: true
                }
            })

            return finalOrder
        })

        // Crear log de la acción (fuera de la transacción para evitar problemas)
        const { error: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "ORDER",
            entity_id: orderId,
            user_id: userId,
            action_initiator: "Change order status button",
            details: `Order status changed from ${updatedOrder.status} to ${data.newStatus}. ${data.newStatus === 'CANCELLED' ? 'Stock restored and balance reversed.' : ''}`
        })

        if (logError) {
            console.warn("Order status updated but failed to create log entry:", logError)
        }

        return {
            message: "Order status updated successfully",
            payload: updatedOrder,
            error: false
        }

    })
} 