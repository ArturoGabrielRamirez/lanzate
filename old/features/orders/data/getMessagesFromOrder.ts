"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

type GetMessagesFromOrderProps = {
    storeSlug: string
    orderId: string
}

export async function getMessagesFromOrder({ storeSlug, orderId }: GetMessagesFromOrderProps) {
    return actionWrapper(async () => {

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
            throw new Error("Order not found or doesn't belong to this store")
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
            message: "Messages fetched successfully",
            payload: messages,
            error: false
        }

    })
} 