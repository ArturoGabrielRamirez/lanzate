"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function deleteStore(storeId: number) {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        const store = await client.store.findUnique({
            where: {
                id: storeId
            }
        })

        if (!store) throw new Error("Store not found")

        await client.store.delete({
            where: {
                id: store.id
            },
            include: {
                branches: true,
                balance: true,
                transactions: true,
                orders: true,
                products: true,
            }
        })

        return {
            message: "Store deleted successfully from db",
            payload: store,
            error: false
        }
    })

}
