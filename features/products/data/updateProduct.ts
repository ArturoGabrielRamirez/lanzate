"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function updateProduct(productId: number, data: any) {
    try {

        const prisma = new PrismaClient()

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: data.name,
                price: data.price,
                stock: data.stock,
                description: data.description,
                categories: {
                    set: data.categories.map((category: any) => ({ id: category.value }))
                }

            }
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