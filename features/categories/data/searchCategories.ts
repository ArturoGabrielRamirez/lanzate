"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function searchCategories(storeId: number, searchTerm: string) {
    return actionWrapper(async () => {
        const categories = await prisma.category.findMany({
            where: {
                store_id: storeId,
                is_active: true,
                name: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            },
            orderBy: {
                sort_order: 'asc'
            },
            take: 10 
        })

        return {
            payload: categories,
            error: false,
            message: "Categorías encontradas"
        }
    })
} 