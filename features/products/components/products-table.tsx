"use client"

import { useTranslations } from "next-intl"
import { useCallback, useMemo } from "react"

import { DataTable } from "@/components/data-table/data-table"
import { getProductColumns } from "@/features/products/components/products-table/columns"
import { createProductsDataHook } from "@/features/products/hooks/use-products-data"
import type { ProductsTableProps } from "@/features/products/types"

export function ProductsTable({
    storeId,
    userId,
    slug,
    employeePermissions,
    headerActions,
}: ProductsTableProps) {
    const t = useTranslations("store.products-table")

    const columnContext = useMemo(() => ({
        slug,
        userId,
        employeePermissions,
        t: (key: string) => t(key),
    }), [slug, userId, employeePermissions, t])

    const useProductsData = useMemo(() => createProductsDataHook(storeId), [storeId])

    const getColumns = useCallback(
        (handleRowDeselection?: ((rowId: string) => void) | null) =>
            getProductColumns(columnContext, handleRowDeselection),
        [columnContext]
    )

    return (
        <DataTable
            getColumns={getColumns}
            fetchDataFn={useProductsData}
            idField="row_id"
            pageSizeOptions={[10, 20, 50, 100]}
            renderToolbarContent={() => headerActions ?? null}
            config={{
                enableRowSelection: true,
                enableSearch: true,
                enableDateFilter: true,
                enableColumnVisibility: true,
                enableUrlState: true,
                enableToolbar: true,
                enablePagination: true,
                searchPlaceholder: t("search-placeholder") || undefined,
            }}
            exportConfig={{
                entityName: "productos",
                columnMapping: {
                    name: t("headers.name"),
                    price: t("headers.price"),
                    categories: t("headers.categories"),
                    stock: t("headers.stock"),
                    is_featured: t("headers.featured"),
                    status: t("headers.status"),
                },
                columnWidths: [
                    { wch: 32 },
                    { wch: 14 },
                    { wch: 24 },
                    { wch: 10 },
                    { wch: 12 },
                    { wch: 12 },
                ],
                headers: ["name", "price", "categories", "stock", "is_featured", "status"],
            }}
        />
    )
}

