"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function deleteStore(storeId: number) {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const store = await prisma.store.findUnique({
            where: {
                id: storeId
            }
        })

        if (!store) throw new Error("Store not found")

        await prisma.store.delete({
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
