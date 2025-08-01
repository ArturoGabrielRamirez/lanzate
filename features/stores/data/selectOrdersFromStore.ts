"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectOrdersFromStore(storeId: number) {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const orders = await prisma.order.findMany({
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
