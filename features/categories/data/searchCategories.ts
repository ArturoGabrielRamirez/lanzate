"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function searchCategories(storeId: number, searchTerm: string) {
    console.log("🚀 ~ searchCategories ~ searchTerm:", searchTerm)
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
        console.log("🚀 ~ searchCategories ~ categories:", categories)

        return {
            payload: categories,
            error: null,
            message: "Categorías encontradas"
        }
    })
} 