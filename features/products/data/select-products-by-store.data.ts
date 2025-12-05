"use server"

import { StoreIdentifier } from "@/features/products/types/products-by-store.types"
import { prisma } from "@/utils/prisma"

export async function selectProductsByStoreData(identifier: StoreIdentifier, limit: number, orderBy: string, page: number, search: string) {

    const storeWhere: { id?: number; slug?: string; subdomain?: string } = {}

    if ('storeId' in identifier) {
        storeWhere.id = identifier.storeId
    } else if ('slug' in identifier) {
        storeWhere.slug = identifier.slug
    } else if ('subdomain' in identifier) {
        const sanitizedSubdomain = identifier.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
        storeWhere.subdomain = sanitizedSubdomain
    }

    const products = await prisma.product.findMany({
        where: {
            store: storeWhere,
            status: "ACTIVE",
            ...(search ? {
                AND: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ]
            } : {}),
        },
        include: {
            categories: true,
            variants: {
                where: {
                    is_active: true
                },
                include: {
                    option_values: {
                        include: {
                            value: {
                                include: {
                                    option: true
                                }
                            }
                        }
                    },
                    stock_items: {
                        include: {
                            branch: true
                        }
                    }
                }
            }
        },
        orderBy: {
            [orderBy]: 'desc'
        },
        take: limit,
        skip: limit * (page - 1)
    })

    return {
        payload: products,
        hasError: false,
        message: "Productos obtenidos correctamente"
    }
}

