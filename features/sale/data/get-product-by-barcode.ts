"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function getProductByBarcode(barcode: string, storeId: number) {
    try {
        const prisma = new PrismaClient()

        const product = await prisma.product.findFirst({
            where: {
                barcode: barcode,
                store_id: storeId,
                is_active: true,
                is_published: true
            },
            include: {
                categories: true,
                stock_entries: {
                    include: {
                        branch: true
                    }
                }
            }
        })

        if (!product) {
            return {
                message: "Product not found",
                payload: null,
                error: true
            }
        }

        // Calcular stock total
        const totalStock = product.stock_entries.reduce((total, entry) => total + entry.quantity, 0)

        return {
            message: "Product found successfully",
            payload: {
                ...product,
                totalStock
            },
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error searching product by barcode", error, null)
    }
} 