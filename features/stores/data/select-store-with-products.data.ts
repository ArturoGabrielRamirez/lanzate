"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreWithProductsData(subdomain: string, category: string | undefined, sort: string | undefined, search: string | undefined, min: string | undefined, max: string | undefined, limit: number = 10, page: number = 1) {

    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    /* const prisma = new PrismaClient() */

    const categoryIds = category
        ? category.split(',').map(id => id.trim())
        : undefined;

    const orderBy: {
        name?: 'asc' | 'desc',
        price?: 'asc' | 'desc',
        created_at?: 'asc' | 'desc',
        is_featured?: 'asc' | 'desc'
    } = {
        is_featured: 'desc'
    }

    if (sort?.includes('name')) {
        orderBy.name = sort.includes('-desc') ? 'desc' : 'asc'
    }

    if (sort?.includes('price')) {
        orderBy.price = sort.includes('-desc') ? 'desc' : 'asc'
    }

    if (sort?.includes('created')) {
        orderBy.created_at = sort.includes('-desc') ? 'desc' : 'asc'
    }

    const priceRange: { gte?: number, lte?: number } = {}

    if (min) {
        priceRange.gte = parseFloat(min)
    }

    if (max) {
        priceRange.lte = parseFloat(max)
    }

    const result = await prisma.store.findUnique({
        where: {
            subdomain: sanitizedSubdomain,
        },
        include: {
            products: {
                where: {
                    is_deleted: false,
                    ...(categoryIds
                        ? {
                            categories: {
                                some: {
                                    id: {
                                        in: categoryIds.map(id => parseInt(id))
                                    }
                                }
                            },
                            OR: [
                                {
                                    name: {
                                        search: search
                                    }
                                },
                                {
                                    name: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    description: {
                                        search: search
                                    }
                                },
                                {
                                    description: {
                                        contains: search, mode: "insensitive"
                                    }
                                },
                            ],
                            price: priceRange
                        }
                        : {
                            OR: [
                                {
                                    name: {
                                        search: search
                                    }
                                },
                                {
                                    name: {
                                        contains: search,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    description: {
                                        search: search
                                    }
                                },
                                {
                                    description: {
                                        contains: search, mode: "insensitive"
                                    }
                                },
                            ],
                            price: priceRange
                        })
                },
                include: {
                    variants: {
                        where: {
                            is_deleted: false
                        }
                    }
                },
                orderBy: orderBy,
                take: limit,
                skip: limit * (page - 1)
            },
            customization: true,
           /*  operational_settings: true */
           //TODO: Arreglar aca, para Hori
        },
    })

    return {
        message: "Tienda con productos recuperada con éxito desde la base de datos",
        payload: result,
        hasError: false
    };

}