"use server"

import { ProductStoreCountData } from "@/features/overview/types/types"
import { prisma } from "@/utils/prisma"

export async function getProductStoreCount(storeId: number) {
    // Get store with products and branches
    const store = await prisma.store.findUnique({
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

} 