"use client"

import { useQuery } from "@tanstack/react-query"

import {
    getProductsPaginatedAction,
    type GetProductsPaginatedInput
} from "@/features/products/actions/get-products-paginated.action"

type DateRange = {
    from_date: string
    to_date: string
}

/**
 * Hook for fetching paginated products.
 * Follows tnks-data-table fetchDataFn interface.
 * 
 * The hook signature matches what tnks-data-table expects:
 * (page, pageSize, search, dateRange, sortBy, sortOrder) => UseQueryResult
 * 
 * @see https://github.com/jacksonkasi1/tnks-data-table#fetchdatafn-interface
 */
function useProductsDataInternal(
    storeId: number,
    page: number,
    pageSize: number,
    search: string,
    dateRange: DateRange,
    sortBy: string,
    sortOrder: string
) {
    return useQuery({
        queryKey: [
            "products",
            {
                storeId,
                page,
                pageSize,
                search,
                dateFrom: dateRange.from_date,
                dateTo: dateRange.to_date,
                sortBy,
                sortOrder
            }
        ],
        queryFn: async () => {
            const input: GetProductsPaginatedInput = {
                storeId,
                page,
                pageSize,
                search: search || undefined,
                sortBy: sortBy || undefined,
                sortOrder: (sortOrder as "asc" | "desc") || undefined,
                dateFrom: dateRange.from_date || undefined,
                dateTo: dateRange.to_date || undefined,
            }

            const result = await getProductsPaginatedAction(input)

            if (result.hasError) {
                throw new Error(result.message)
            }

            return {
                success: true,
                data: result.payload?.data ?? [],
                pagination: {
                    page,
                    limit: pageSize,
                    total_pages: result.payload?.pageCount ?? 0,
                    total_items: result.payload?.totalCount ?? 0
                }
            }
        },
        placeholderData: (previousData) => previousData,
    })
}

/**
 * Creates a products data hook bound to a specific storeId.
 * Returns a function that matches tnks-data-table fetchDataFn interface.
 */
export function createProductsDataHook(storeId: number) {
    const hook = (
        page: number,
        pageSize: number,
        search: string,
        dateRange: DateRange,
        sortBy: string,
        sortOrder: string
    ) => useProductsDataInternal(storeId, page, pageSize, search, dateRange, sortBy, sortOrder)

    // Mark as query hook for tnks-data-table
    hook.isQueryHook = true as const
    return hook
}

