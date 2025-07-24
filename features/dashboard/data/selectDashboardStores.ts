"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"
import { GetDashboardStoresReturn } from "../types/types"

export async function selectDashboardStores(userId: number): Promise<GetDashboardStoresReturn> {
    return actionWrapper(async () => {
        const client = new PrismaClient()

        const stores = await client.store.findMany({
            where: {
                user_id: userId
            },
            select: {
                id: true,
                name: true,
                description: true,
                logo: true,
                slogan: true,
                slug: true,
                subdomain: true,
                created_at: true,
                updated_at: true,
                user_id: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        const storeCount = stores.length

        return {
            message: "Dashboard stores fetched successfully from db",
            payload: {
                storeCount,
                stores
            },
            error: false
        }
    })
} 