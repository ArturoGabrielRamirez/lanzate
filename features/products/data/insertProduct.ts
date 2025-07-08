"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function insertProduct(payload: any, storeId: number) {
    try {

        const prisma = new PrismaClient()

        const product = await prisma.product.create({
            data: {
                name: payload.name,
                price: 10,
                stock: 10,
                store_id: storeId,
            }
        })

        return {
            error: false,
            message: "Product created successfully",
            payload: product
        }

    } catch (error) {
        return formatErrorResponse("Error inserting product", error, null)
    }
}
