"use server"

import { CreateCategoryDynamicAction } from "@/features/categories/types"
import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function getStoreCategoriesData({ storeId }: CreateCategoryDynamicAction) {
    return actionWrapper(async () => {
        const categories = await prisma.category.findMany({
            where: {
                store_id: storeId,
                is_active: true
            },
            orderBy: {
                sort_order: 'asc'
            },
            include: {
                products: {
                    where: {
                        is_active: true,
                        is_published: true
                    },
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        price: true
                    }
                }
            }
        })

        return {
            hasError: false,
            message: "Categorías recuperadas exitosamente",
            payload: categories
        }
    })
} 