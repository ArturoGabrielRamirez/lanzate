"use server"

import { PrismaClient } from '@prisma/client'
import { formatErrorResponse } from "@/utils/lib"


export async function deleteProduct(productId: number) {
    try {
        const prisma = new PrismaClient()

        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) throw new Error("Product not found")

        await prisma.product.delete({
            where: {
                id: productId
            },
            include: {
                stock_entries: true,
            }
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