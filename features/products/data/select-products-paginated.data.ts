"use server"

import { Prisma } from "@prisma/client"

import { flattenProducts } from "@/features/products/utils/flatten-products"
import type { ProductsTableVariantRow } from "@/features/products/types"
import { prisma } from "@/utils/prisma"

export type PaginatedProductsParams = {
    storeId: number
    page: number
    pageSize: number
    search?: string
    sortBy?: string
    sortOrder?: "asc" | "desc"
    dateFrom?: Date
    dateTo?: Date
}

export type PaginatedProductsResponse = {
    data: ProductsTableVariantRow[]
    totalCount: number
    pageCount: number
}

export async function selectProductsPaginated(params: PaginatedProductsParams): Promise<PaginatedProductsResponse> {
    const {
        storeId,
        page,
        pageSize,
        search,
        sortBy = "created_at",
        sortOrder = "desc",
        dateFrom,
        dateTo
    } = params

    const where: Prisma.ProductWhereInput = {
        store_id: storeId,
    }

    if (search && search.trim()) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
        ]
    }

    if (dateFrom) {
        where.created_at = {
            ...((where.created_at as Prisma.DateTimeFilter) ?? {}),
            gte: dateFrom
        }
    }
    if (dateTo) {
        where.created_at = {
            ...((where.created_at as Prisma.DateTimeFilter) ?? {}),
            lte: dateTo
        }
    }

    const products = await prisma.product.findMany({
        where,
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
        },
        orderBy: {
            created_at: "desc"
        },
    })

    const flattened = flattenProducts(products)

    const sorted = sortRows(flattened, sortBy, sortOrder)
    const totalCount = sorted.length
    const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
    const start = (page - 1) * pageSize
    const paginated = sorted.slice(start, start + pageSize)

    return {
        data: paginated,
        totalCount,
        pageCount
    }
}

function sortRows(
    rows: ProductsTableVariantRow[],
    sortBy?: string,
    sortOrder: "asc" | "desc" = "desc"
) {
    const direction = sortOrder === "asc" ? 1 : -1
    const safeSort = sortBy ?? "created_at"

    return [...rows].sort((a, b) => {
        const getValue = (row: ProductsTableVariantRow) => {
            switch (safeSort) {
                case "name":
                    return row.name ?? ""
                case "price":
                    return row.variant_price ?? row.price ?? 0
                case "stock":
                    return row.stock ?? 0
                case "is_featured":
                    return row.is_featured ? 1 : 0
                case "status":
                    return row.status ?? ""
                case "created_at":
                    return row.created_at?.getTime?.() ?? new Date(row.created_at as unknown as string).getTime()
                case "updated_at":
                    return row.updated_at?.getTime?.() ?? new Date(row.updated_at as unknown as string).getTime()
                default:
                    return row.created_at?.getTime?.() ?? new Date(row.created_at as unknown as string).getTime()
            }
        }

        const aValue = getValue(a)
        const bValue = getValue(b)

        if (aValue < bValue) return -1 * direction
        if (aValue > bValue) return 1 * direction
        return 0
    })
}

