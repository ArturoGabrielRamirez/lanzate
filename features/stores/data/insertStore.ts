"use server"

import { PrismaClient, Store } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"
import randomstring from "randomstring"

type InsertStoreReturn = {
    message: string
    payload: Store
    error: boolean
}

export async function insertStore(payload: any, userId: number): Promise<InsertStoreReturn> {

    try {

        const client = new PrismaClient()

        const store = await client.store.create({
            data: {
                name: payload.name,
                slug: randomstring.generate(8),
                subdomain: payload.subdomain,
                description: payload.description,
                user_id: userId,
                branches: {
                    create: {
                        name: "Main Branch",
                        description: "Main starter branch"
                    }
                },
                balance: {
                    create: true
                }
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
