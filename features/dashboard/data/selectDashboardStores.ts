"use server"

import { actionWrapper } from "@/utils/lib"
import { GetDashboardStoresReturn } from "../types/types"
import { prisma } from "@/utils/prisma"

export async function selectDashboardStores(userId: number): Promise<GetDashboardStoresReturn> {
    return actionWrapper(async () => {

        const stores = await prisma.store.findMany({
            where: {
                
                OR: [
                    {
                        user_id: userId
                    },
                    {
                        employees: {
                            some: {
                                user_id: userId
                            }
                        }
                    }
                ]
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

        const productCount = await prisma.product.count({
            where: {
                owner_id: userId
            }
        })

        const operationalSettingsCount = await prisma.storeOperationalSettings.count({
            where: {
                store: {
                    user_id: userId
                }
            }
        })

        const storeCount = stores.length

        return {
            message: "Dashboard stores fetched successfully from db",
            payload: {
                storeCount,
                productCount,
                operationalSettingsCount,
                stores
            },
            error: false
        }
    })
} 