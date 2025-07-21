"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function selectOrdersFromStore(storeId: number) {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        const orders = await client.order.findMany({
            where: {
                store_id: storeId
            },
            include: {
                branch: true,
                items: true,
                payment: true,
                user: true
            }
        })

        return {
            message: "Orders fetched successfully",
            payload: orders,
            error: false
        }

    })
}
