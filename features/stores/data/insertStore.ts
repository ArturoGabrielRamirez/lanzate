"use server"

import { PrismaClient, Store } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

type InsertStoreReturn = {
    message: string
    payload: Store
    error: boolean
}

export async function insertStore(name: string, userId: number): Promise<InsertStoreReturn> {

    try {

        const client = new PrismaClient()

        const store = await client.store.create({
            data: {
                name,
                user_id: userId
            }
        })

        return {
            message: "Store created successfully",
            payload: store,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error creating store", error, null)
    }

}
