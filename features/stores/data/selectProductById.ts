"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function selectProductById(id: number) {
    try {

        const prisma = new PrismaClient()

        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        })

        if (!product) throw new Error("Product not found")

        return {
            payload: product,
            error: false,
            message: "Product details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching product details", error)
    }
}
