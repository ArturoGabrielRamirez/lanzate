"use server"

import { DashboardStore } from "@/features/dashboard/types"
import { prisma } from "@/utils/prisma"


export async function selectDashboardStoresData(userId: number, limit?: number) {

    const stores = await prisma.store.findMany({
        where: {
            OR: [
                { user_id: userId },
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
            user_id: true,
            _count: {
                select: {
                    products: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        },
        take: limit || 50
    })

    const storeCount = stores.length

    return {
        message: "Tiendas del dashboard obtenidas con éxito desde la base de datos",
        payload: {
            storeCount,
            stores: stores as DashboardStore[]
        },
        error: false
    }
} 