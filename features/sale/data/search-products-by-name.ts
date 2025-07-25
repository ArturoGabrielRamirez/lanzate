"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function searchProductsByName(searchTerm: string, storeId: number) {
    try {
        const prisma = new PrismaClient()

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
                is_active: true,
                is_published: true,
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
                    {
                        sku: {
                            contains: searchTerm.trim(),
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            include: {
                categories: true,
                stock_entries: {
                    include: {
                        branch: true
                    }
                }
            },
            take: 20 // Limitar a 20 resultados
        })

        // Calcular stock total para cada producto
        const productsWithTotalStock = products.map(product => ({
            ...product,
            totalStock: product.stock_entries.reduce((total, entry) => total + entry.quantity, 0)
        }))

        return {
            message: `Se encontraron ${productsWithTotalStock.length} productos`,
            payload: productsWithTotalStock,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error searching products by name", error, [])
    }
} 