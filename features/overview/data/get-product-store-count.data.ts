"use server"

import { ProductStoreCountData } from "@/features/overview/types/types"
import { prisma } from "@/utils/prisma"

export async function getProductStoreCountData(storeId: number) {
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
        throw new Error("Tienda no encontrada")
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
        message: "Cantidad de productos y tiendas obtenida correctamente",
        payload: productStoreCount,
        error: false
    }

} 