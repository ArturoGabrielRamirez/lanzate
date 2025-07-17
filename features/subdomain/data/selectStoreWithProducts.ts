"use server"

import { SelectStoreWithProductsReturn } from "../types/types";
import { formatErrorResponse } from "@/utils/lib";
import { PrismaClient } from "@/prisma/generated/prisma";

export async function selectStoreWithProducts(subdomain: string, category: string | undefined): Promise<SelectStoreWithProductsReturn> {
    try {

        const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const prisma = new PrismaClient()

        const categoryIds = category
            ? category.split(',').map(id => id.trim())
            : undefined;

        const result = await prisma.store.findUnique({
            where: {
                subdomain: sanitizedSubdomain
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
                            }
                        }
                        : {}
                }
            }
        })

        return {
            message: "Store with products fetched successfully from db",
            payload: result,
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching store with products from db", error, null);
    }
}