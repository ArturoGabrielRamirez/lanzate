"use server"

import { formatSuccessResponse } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"


export async function getUserOrdersData(userId: number) {
    const orders = await prisma.order.findMany({
        where: {
            customer_id: userId
        },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            store: true,
            branch: true
        },
        orderBy: {
            created_at: 'desc'
        }
    })

    if (!orders) throw new Error("Orders not found")

    return formatSuccessResponse("Orders fetched successfully", orders)
}