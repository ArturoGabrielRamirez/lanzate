"use server"

import { PrismaClient, Store } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"
import randomstring from "randomstring"

type InsertStoreReturn = {
    message: string
    payload: Store
    error: boolean
}

export async function insertStore(payload: any, userId: number): Promise<InsertStoreReturn> {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        const slug = randomstring.generate(8)

        const existingSlugStore = await client.store.findUnique({
            where: {
                slug: slug
            }
        })

        if (existingSlugStore) throw new Error("The store slug (Internal URL) already exists. Try another one.")

        const existingSubdomain = await client.store.findUnique({
            where: {
                subdomain: payload.subdomain
            }
        })

        if (existingSubdomain) throw new Error("The store subdomain (Public URL) already exists. Try another one.")

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
                    create: {
                        current_balance: 0,
                    }
                }
            }
        })

        return {
            message: "Store created successfully",
            payload: store,
            error: false
        }

    })

}
