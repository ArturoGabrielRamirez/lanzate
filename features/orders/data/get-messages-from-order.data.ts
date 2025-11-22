"use server"

import { GetMessagesFromOrderProps } from "@/features/orders/types"
import { prisma } from "@/utils/prisma"

export async function getMessagesFromOrderData({ storeSlug, orderId }: GetMessagesFromOrderProps) {

    const order = await prisma.order.findFirst({
        where: {
            id: parseInt(orderId),
            store: {
                slug: storeSlug
            }
        },
        select: {
            id: true
        }
    })

    if (!order) {
        throw new Error("Pedido no encontrado o no pertenece a esta tienda")
    }

    const messages = await prisma.orderMessage.findMany({
        where: {
            order_id: parseInt(orderId)
        },
        include: {
            sender: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true,
                }
            }
        },
        orderBy: {
            created_at: "asc"
        }
    })

    return {
        message: "Mensajes obtenidos con éxito",
        payload: messages,
        hasError: false
    }

}