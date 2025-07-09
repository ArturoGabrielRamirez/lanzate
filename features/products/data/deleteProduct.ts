"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

/**
 * Deletes a product by its ID, including all related stock entries (cascade).
 * @param productId - The ID of the product to delete
 */
export async function deleteProduct(productId: number) {
    try {
        const prisma = new PrismaClient()

        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) throw new Error("Product not found")

        await prisma.product.delete({
            where: { id: productId }
        })

        return {
            message: "Product deleted successfully from db",
            payload: product,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error deleting product", error, null)
    }
} 