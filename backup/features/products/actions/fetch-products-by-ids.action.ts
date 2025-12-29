"use server"

import { flattenProducts } from "@/features/products/utils/flatten-products"
import { prisma } from "@/utils/prisma"

/**
 * Fetch products by their IDs.
 * Used by tnks-data-table for multi-page selection.
 */
export async function fetchProductsByIds(ids: number[]) {
    if (!ids.length) return []

    const products = await prisma.product.findMany({
        where: {
            id: { in: ids }
        },
        include: {
            categories: true,
            variants: {
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
        }
    })

    return flattenProducts(products)
}

