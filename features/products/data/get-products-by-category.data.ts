import { prisma } from "@/utils/prisma"

export async function getProductsCountByCategoryData(categoryId: number, storeId: number) {
    try {
        const count = await prisma.product.count({
            where: {
                categories: {
                    some: {
                        id: categoryId
                    }
                },
                store_id: storeId,
                is_active: true
            }
        })

        return {
            error: false,
            message: "Products count retrieved successfully",
            payload: count
        }
    } catch (error) {
        console.error("Error retrieving products count:", error)
        return {
            error: true,
            message: "Error retrieving products count",
            payload: null
        }
    }
} 