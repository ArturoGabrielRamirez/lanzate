"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function deleteStore(storeId: number) {
    try {

        const client = new PrismaClient()

        const store = await client.store.findUnique({
            where: {
                id: storeId
            }
        })

        if (!store) throw new Error("Store not found")

        await client.branch.deleteMany({
            where: {
                store_id: store.id
            }
        })

        await client.store.delete({
            where: {
                id: store.id
            }
        })

        return {
            message: "Store deleted successfully from db",
            payload: store,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error deleting store", error, null)
    }
}
