import { prisma } from "@/utils/prisma"

type UpdatePricesPayload = {
    storeId: number
    amount: number
    updateType: "fijo" | "porcentaje"
    productIds?: number[]
    categoryId?: number
}

export async function updateProductsPrices(payload: UpdatePricesPayload) {
    try {
        const { storeId, amount, updateType, productIds, categoryId } = payload

        // Build the where clause based on what we're updating
        const baseWhereClause = {
            store_id: storeId,
        }

        let whereClause

        if (productIds && productIds.length > 0) {
            // Update specific products
            whereClause = {
                ...baseWhereClause,
                OR: [
                    ...productIds.map(id => ({ id })),
                ]
            }
        } else if (categoryId) {
            // Update products by category
            whereClause = {
                ...baseWhereClause,
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            }
        } else {
            throw new Error("Either productIds or categoryId must be provided")
        }

        // First, get the products that will be updated to calculate new prices
        const productsToUpdate = await prisma.product.findMany({
            where: whereClause,
            select: {
                id: true,
                price: true,
                name: true
            }
        })
        console.log("🚀 ~ updateProductsPrices ~ whereClause:", whereClause)
        console.log("🚀 ~ updateProductsPrices ~ productsToUpdate:", productsToUpdate)

        if (productsToUpdate.length === 0) {
            return {
                error: false,
                message: "No products found to update",
                payload: {
                    updatedCount: 0,
                    products: []
                }
            }
        }

        // Calculate new prices and update each product
        const updatePromises = productsToUpdate.map(async (product) => {
            let newPrice: number

            if (updateType === "fijo") {
                // Fixed amount increase
                newPrice = product.price + amount
            } else {
                // Percentage increase
                newPrice = product.price * (1 + amount / 100)
            }

            // Ensure price doesn't go below 0
            newPrice = Math.max(0, Math.round(newPrice * 100) / 100)

            return prisma.product.update({
                where: { id: product.id },
                data: { price: newPrice },
                select: {
                    id: true,
                    name: true,
                    price: true
                }
            })
        })

        const updatedProducts = await Promise.all(updatePromises)

        return {
            error: false,
            message: `Successfully updated ${updatedProducts.length} products`,
            payload: {
                updatedCount: updatedProducts.length,
                products: updatedProducts
            }
        }
    } catch (error) {
        console.error("Error updating product prices:", error)
        return {
            error: true,
            message: error instanceof Error ? error.message : "Error updating product prices",
            payload: null
        }
    }
} 