"use server"

import { GetStoreCategoriesAction } from "@/features/categories/types"
import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function getStoreCategoriesData({ storeId }: GetStoreCategoriesAction) {
    return actionWrapper(async () => {
        const categories = await prisma.category.findMany({
            where: {
                store_id: storeId,
                is_active: true
            },
            orderBy: {
                sort_order: 'asc'
            },
            select: {
                id: true,
                name: true
            }
        })

        return {
            hasError: false,
            message: "Categorías recuperadas exitosamente",
            payload: categories
        }
    })
} 