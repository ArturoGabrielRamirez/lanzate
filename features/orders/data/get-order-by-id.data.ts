"use server"

import { formatSuccessResponse } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"


export async function getOrderByIdData(orderId: number, userId: number) {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            customer_id: userId
        },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            store: true,
            branch: true,
            tracking: true,
            payment: true
        }
    })

    if (!order) throw new Error("Order not found")

    return formatSuccessResponse("Order fetched successfully", order)
} 