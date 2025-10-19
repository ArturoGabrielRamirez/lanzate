"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectOrdersFromStore(storeId: number, limit?: number) {
    return actionWrapper(async () => {

        const orders = await prisma.order.findMany({
            where: {
                store_id: storeId
            },
            include: {
                branch: true,
                items: true,
                payment: true,
                customer: true,
                processed_by: true,
            },
            orderBy: {
                created_at: "desc"
            },
            take: limit ?? undefined,
        })

        return {
            message: "Orders fetched successfully",
            payload: orders,
            error: false
        }

    })
}
