"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectProductById(id: number) {
    return actionWrapper(async () => {

        /* const prisma = new PrismaClient() */

        const product = await prisma.product.findUnique({
            where: {
                id: id
            },
            include: {
                categories: true
            }
        })

        if (!product) throw new Error("Product not found")

        return {
            payload: product,
            error: false,
            message: "Product details fetched successfully"
        }

    })
}
