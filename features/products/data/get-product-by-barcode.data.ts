"use server"

import { prisma } from "@/utils/prisma"

export async function getProductByBarcodeData(barcode: string, storeId: number) {
    const product = await prisma.product.findFirst({
        where: {
            barcode: barcode,
            store_id: storeId,
            is_active: true,
            is_published: true,
            is_deleted: false
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
        hasError: false
    }
} 