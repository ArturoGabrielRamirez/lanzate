"use server"

import { ProductVariant } from "@prisma/client"

import { prisma } from "@/utils/prisma"

export async function selectProductById(id: number) {
    const product = await prisma.product.findUnique({
        where: {
            id: id,
            is_deleted: false
        },
        include: {
            categories: true,
            media: true,
            primary_media: true,
            variants: {
                where: {
                    is_deleted: false
                },
                include: {
                    color: true,
                    stocks: {
                        include: {
                            branch: true
                        }
                    },
                    media: true,
                    primary_media: true,
                }
            }
        }
    })

    if (!product) throw new Error("Product not found")

    // derive total stock from variants
    const enriched = product && {
        ...product,
        stock: (product.variants ?? []).flatMap((v: ProductVariant & { stocks: { quantity: number }[] }) => v.stocks ?? []).reduce((s: number, x: { quantity: number }) => s + (x.quantity ?? 0), 0)
    }

    return {
        payload: enriched,
        hasError: false,
        message: "Product details fetched successfully"
    }
}
