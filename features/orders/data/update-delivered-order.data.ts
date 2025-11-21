"use server"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { formatSuccessResponse } from "@/features/global/utils"
import { UpdateDeliveredOrderProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function updateDeliveredOrderData({ orderId }: UpdateDeliveredOrderProps) {
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
        if (oldStatus === 'DELIVERED') {
            throw new Error("El pedido ya está en estado ENTREGADO")
        }

        // Business rule: Can only deliver from READY (pickup) or SHIPPED (delivery)
        const allowedFromStatuses = order.shipping_method === 'PICKUP'
            ? ['READY']
            : ['SHIPPED']

        if (!allowedFromStatuses.includes(oldStatus)) {
            throw new Error(`No se puede cambiar el estado del pedido de ${oldStatus} a ENTREGADO. El pedido debe estar en estado ${allowedFromStatuses.join(' o ')}.`)
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
    const { hasError: logError } = await insertLogEntry({
        action: "UPDATE",
        entity_type: "ORDER",
        entity_id: parseInt(orderId),
        user_id: user.id,
        action_initiator: "Actualización del estado del pedido",
        details: `El estado del pedido cambió a ENTREGADO. El pedido fue ${updatedOrder.shipping_method === 'PICKUP' ? 'recogido' : 'entregado'} al cliente.`
    })

    if (logError) {
        console.warn("El estado del pedido se actualizó pero no se pudo crear la entrada de registro:", logError)
    }

    // TODO: Send delivery confirmation to customer
    // if (updatedOrder.customer_email) {
    //     await sendOrderDeliveredNotification(updatedOrder)
    // }

    return formatSuccessResponse(
        `El pedido fue ${updatedOrder.shipping_method === 'PICKUP' ? 'recogido' : 'entregado'} con éxito`,
        updatedOrder
    )
} 