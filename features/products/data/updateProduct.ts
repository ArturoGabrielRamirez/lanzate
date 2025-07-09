"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

/**
 * Updates a product by its ID.
 * @param productId - The ID of the product to update
 * @param data - The fields to update (name, price, stock, description)
 */
export async function updateProduct(productId: number, data: any) {
    try {
        const prisma = new PrismaClient()
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { ...data }
        })
        return {
            message: "Product updated successfully",
            payload: updatedProduct,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error updating product", error, null)
    }
} 