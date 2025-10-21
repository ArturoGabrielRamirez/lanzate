"use server"

import { prisma } from "@/utils/prisma"

export async function selectProductByIdsAndSubdomain(productId: number, variantId: number, subdomain: string) {
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')

    const product = await prisma.product.findFirst({
        where: {
            id: productId,
            is_active: true,
            is_published: true,
            is_deleted: false,
            store: {
                subdomain: sanitizedSubdomain
            }
        },
        include: {
            categories: true,
            store: {
                select: {
                    id: true,
                    name: true,
                    subdomain: true,
                    customization: true
                }
            },
            variants: {
                where: { is_deleted: false },
                include: { color: true },
                orderBy: { id: 'asc' }
            }
        }
    })

    if (!product) throw new Error("Product not found or not available")

    return {
        payload: product,
        hasError: false,
        message: "Product details fetched successfully"
    }
}


