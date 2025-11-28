"use server"

import { formatSuccessResponse } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function selectOrdersFromStoreData(storeId: number, limit?: number) {

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

    return formatSuccessResponse("Pedidos obtenidos con éxito", orders)

}
