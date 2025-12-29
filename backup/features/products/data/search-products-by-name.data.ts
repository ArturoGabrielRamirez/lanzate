"use server"

import { prisma } from "@/utils/prisma"

export async function searchProductsByNameData(searchTerm: string, storeId: number) {
    if (!searchTerm || searchTerm.trim() === '') {
        return {
            message: "No hay término de búsqueda",
            payload: [],
            error: false
        }
    }

    const products = await prisma.product.findMany({
        where: {
            store_id: storeId,
           /*  is_active: true, */
         /*    is_published: true, */
          /*   is_deleted: false, */
            OR: [
                {
                    name: {
                        contains: searchTerm.trim(),
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: searchTerm.trim(),
                        mode: 'insensitive'
                    }
                },
          /*       {
                    sku: {
                        contains: searchTerm.trim(),
                        mode: 'insensitive'
                    }
                } */
            ]
        },
        include: {
            categories: true,
           /*  stock_entries: {
                include: {
                    branch: true
                }
            } */
        },
        take: 20 // Limitar a 20 resultados
    })

    // Calcular stock total para cada producto
    const productsWithTotalStock = products.map(product => ({
        ...product,
      /*   totalStock: product.stock_entries.reduce((total, entry) => total + entry.quantity, 0) */
    }))

    return {
        message: "Productos encontrados exitosamente",
        payload: productsWithTotalStock,
        hasError: false
    }
} 