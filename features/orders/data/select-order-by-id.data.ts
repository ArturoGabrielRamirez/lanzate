"use server"

import { formatSuccessResponse } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function selectOrderByIdData(orderId: number) {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            customer: {
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    avatar: true,
                },
            },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            image: true,
                            categories: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            },
            branch: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                  /*   phone: true,
                    email: true */
                }
            },
            payment: true,
            processed_by: true,
            store: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            messages: true,
            tracking: true
        }
    })

    if (!order) {
        throw new Error("Pedido no encontrado")
    }

    return formatSuccessResponse("Detalles del pedido obtenidos con éxito", order)
} 