"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function insertProduct(payload: any, storeId: number) {
    try {

        const prisma = new PrismaClient()

        const store = await prisma.store.findUnique({
            where: {
                id: storeId
            }
        })

        if (!store) throw new Error("Store not found")

        const mainBranch = await prisma.branch.findFirst({
            where: {
                store_id: store.id,
            }
        })

        if (!mainBranch) throw new Error("Main branch not found")


        const product = await prisma.product.create({
            data: {
                name: payload.name,
                price: payload.price,
                stock: payload.stock,
                store_id: store.id,
                description: payload.description,
                stock_entries: {
                    create: {
                        branch_id: mainBranch.id,
                        quantity: payload.stock,
                    }
                },
                categories: {
                    connect: [
                        ...payload.categories.map((category: any) => ({ id: category.value }))
                    ]
                }
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
