"use server"

import { SelectStoreWithProductsReturn } from "../types/types";
import { formatErrorResponse } from "@/utils/lib";
import { PrismaClient } from "@/prisma/generated/prisma";

export async function selectStoreWithProducts(subdomain: string, category: string | undefined, sort: string | undefined, search: string | undefined, min: string | undefined, max: string | undefined, limit: number = 10, page: number = 1): Promise<SelectStoreWithProductsReturn> {
    console.log("🚀 ~ selectStoreWithProducts ~ limit:", limit)
    console.log("🚀 ~ selectStoreWithProducts ~ page:", page)
    try {

        const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const prisma = new PrismaClient()

        const categoryIds = category
            ? category.split(',').map(id => id.trim())
            : undefined;

        const orderBy: { name?: 'asc' | 'desc', price?: 'asc' | 'desc', created_at?: 'asc' | 'desc' } = {}

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
                    where: categoryIds
                        ? {
                            categories: {
                                some: {
                                    id: {
                                        in: categoryIds.map(Number)
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
                        },
                    orderBy: orderBy,
                    take: limit,
                    skip: limit * (page - 1)
                }
            },
        })
        console.log("🚀 ~ selectStoreWithProducts ~ limit * (page - 1):", limit * (page - 1))

        return {
            message: "Store with products fetched successfully from db",
            payload: result,
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching store with products from db", error, null);
    }
}