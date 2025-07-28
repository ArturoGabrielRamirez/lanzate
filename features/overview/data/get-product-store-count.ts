"use server"

import { PrismaClient } from '@prisma/client'
import { formatErrorResponse } from "@/utils/lib"
import { ProductStoreCountData } from "../types"

export async function getProductStoreCount(storeId: number) {
    try {
        const client = new PrismaClient()

        // Get store with products and branches
        const store = await client.store.findUnique({
            where: {
                id: storeId
            },
            include: {
                products: true,
                branches: true
            }
        })

        if (!store) {
            throw new Error("Store not found")
        }

        const totalProducts = store.products.length
        const activeProducts = store.products.filter(product => product.is_active).length
        const publishedProducts = store.products.filter(product => product.is_published).length
        const totalStores = store.branches.length // branches as "stores"

        const productStoreCount: ProductStoreCountData = {
            totalProducts,
            totalStores,
            activeProducts,
            publishedProducts
        }

        return {
            message: "Product and store count fetched successfully",
            payload: productStoreCount,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching product store count", error, null)
    }
} 