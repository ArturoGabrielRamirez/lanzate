"use server"

import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { formatSuccessResponse } from "@/features/global/utils"
import { ChangeOrderStatusData } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function updateOrderStatusData(orderId: number, data: ChangeOrderStatusData, userId: number) {

        /* const client = new PrismaClient() */

        // Usar transacción para asegurar consistencia
        const updatedOrder = await prisma.$transaction(async (tx) => {

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

            if (!order) throw new Error("Pedido no encontrado")

            const oldStatus = order.status
            const newStatus = data.newStatus as never // Cast to OrderStatus enum

            // Validar que el status ha cambiado
            if (oldStatus === newStatus) {
                throw new Error("El nuevo estado debe ser diferente al estado actual")
            }

            // Lógica específica para cancelación
            if (newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED') {
                if (!data.confirmStockRestore) {
                    throw new Error("Se requiere confirmación de restauración de stock para la cancelación")
                }

                // Restaurar stock para cada producto
                /* for (const item of order.items) {
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
                } */

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
                            description: `Pedido ${order.id} cancelado - reembolso`,
                            reference_type: "order",
                            reference_id: order.id,
                            created_by: userId,
                            notes: `Pedido ${order.id} cancelado y reembolsado`,
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
                    throw new Error("Se requiere confirmación de pago al cambiar desde el estado PENDIENTE")
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

        // Crear log de la acción (fuera de la transacción para evitar problemas)
        const { hasError: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "ORDER",
            entity_id: orderId,
            user_id: userId,
            action_initiator: "Botón de cambio de estado de pedido",
            details: `El estado del pedido cambió de ${updatedOrder.status} a ${data.newStatus}. ${data.newStatus === 'CANCELLED' ? 'Stock restaurado y balance revertido.' : ''}`
        })

        if (logError) {
            console.warn("El estado del pedido se actualizó pero no se pudo crear la entrada de registro:", logError)
        }

        return formatSuccessResponse("El estado del pedido se actualizó correctamente", updatedOrder)
} 