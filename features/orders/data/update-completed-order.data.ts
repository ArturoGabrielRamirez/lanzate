"use server"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { formatSuccessResponse } from "@/features/global/utils"
import { UpdateCompletedOrderProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function updateCompletedOrderData({ orderId }: UpdateCompletedOrderProps) {
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
                processed_by: true,
                customer: true
            }
        })

        if (!order) {
            throw new Error("Pedido no encontrado")
        }

        const oldStatus = order.status

        // Validate status change
        if (oldStatus === 'COMPLETED') {
            throw new Error("El pedido ya está en estado COMPLETADO")
        }

        // Business rule: Can only complete from DELIVERED
        if (oldStatus !== 'DELIVERED') {
            throw new Error(`No se puede cambiar el estado del pedido de ${oldStatus} a COMPLETADO. El pedido debe estar en estado ENTREGADO.`)
        }

        // Validate that order was delivered successfully
        if (!order.is_paid) {
            throw new Error("No se puede completar un pedido no pagado")
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
    const { hasError: logError } = await insertLogEntry({
        action: "UPDATE",
        entity_type: "ORDER",
        entity_id: parseInt(orderId),
        user_id: user.id,
        action_initiator: "Actualización del estado del pedido",
        details: `El estado del pedido cambió a COMPLETADO. El pedido ha sido finalizado con éxito.`
    })

    if (logError) {
        console.warn("El estado del pedido se actualizó pero no se pudo crear la entrada de registro:", logError)
    }

    // TODO: Send completion notification to customer
    // if (updatedOrder.customer_email) {
    //     await sendOrderCompletedNotification(updatedOrder)
    // }

    // TODO: Send satisfaction survey
    // if (updatedOrder.customer_email) {
    //     await sendSatisfactionSurvey(updatedOrder)
    // }

    return formatSuccessResponse("El pedido ha sido completado con éxito", updatedOrder)
} 