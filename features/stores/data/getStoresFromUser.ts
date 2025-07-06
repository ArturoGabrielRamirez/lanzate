"use server"

import { PrismaClient, Store } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

type GetStoresFromUserReturn = {
    message: string
    payload: Store[]
    error: boolean
}

export async function getStoresFromUser(userId: number): Promise<GetStoresFromUserReturn> {
    try {

        const client = new PrismaClient()

        const stores = await client.store.findMany({
            where: {
                user_id: userId
            }
        })

        return {
            message: "Stores fetched successfully from db",
            payload: stores,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching stores from db", error, [])
    }
}
