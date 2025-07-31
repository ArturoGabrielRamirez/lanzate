"use server"

import { PrismaClient } from '@prisma/client'
import { formatErrorResponse } from "@/utils/lib"

export async function selectProductByIdAndSubdomain(id: number, subdomain: string) {
    try {
        const prisma = new PrismaClient()

        const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

        const product = await prisma.product.findFirst({
            where: {
                id: id,
                is_active: true,
                is_published: true,
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
                }
            }
        })

        if (!product) throw new Error("Product not found or not available")

        return {
            payload: product,
            error: false,
            message: "Product details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching product details", error)
    }
} 