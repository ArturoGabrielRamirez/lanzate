"use server"

import { OrderIdProp } from "@/features/chat/types"
import { prisma } from "@/utils/prisma"

export async function getOrderStatusData({ orderId }: OrderIdProp) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                status: true
            }
        })

        return order
    } catch (error) {
        console.error('Error fetching order status:', error)
        return null
    }
}
