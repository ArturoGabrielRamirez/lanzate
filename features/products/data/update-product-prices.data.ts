import { UpdatePricesPayload } from "@/features/products/types"
import { prisma } from "@/utils/prisma"

export async function updateProductsPricesData(payload: UpdatePricesPayload) {
    try {
        const { storeId, amount, updateType, productIds, categoryId } = payload

        // Build the where clause based on what we're updating
        const baseWhereClause = {
            store_id: storeId,
            is_deleted: false
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
            throw new Error("Se debe proporcionar productIds o categoryId")
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
                message: "No se encontraron productos para actualizar",
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
            message: `Se actualizaron correctamente ${updatedProducts.length} productos`,
            payload: {
                updatedCount: updatedProducts.length,
                products: updatedProducts
            }
        }
    } catch (error) {
        console.error("Error actualizando los precios de los productos:", error)
        return {
            error: true,
            message: error instanceof Error ? error.message : "Error actualizando los precios de los productos",
            payload: null
        }
    }
} 