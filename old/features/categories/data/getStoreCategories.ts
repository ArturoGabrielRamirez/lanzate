"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getStoreCategories(storeId: number) {
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
            error: false,
            message: "Categories fetched successfully",
            payload: categories
        }
    })
} 