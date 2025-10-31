"use server"

import { SearchCategoriesAction } from "@/features/categories/types"
import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function searchCategories({ storeId, searchTerm }: SearchCategoriesAction) {
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
            hasError: false,
            message: "Categorías encontradas"
        }
    })
} 