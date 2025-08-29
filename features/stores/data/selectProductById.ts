"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectProductById(id: number) {
    return actionWrapper(async () => {

        /* const prisma = new PrismaClient() */

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
                        stocks: true,
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
            stock: (product.variants ?? []).flatMap((v: any) => v.stocks ?? []).reduce((s: number, x: any) => s + (x.quantity ?? 0), 0)
        }

        return {
            payload: enriched as any,
            error: false,
            message: "Product details fetched successfully"
        }

    })
}
