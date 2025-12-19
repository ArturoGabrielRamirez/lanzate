/* "use client"

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
            pageSizeOptions={[5,10, 20, 50, 100]}
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

export { ProductsTable } */
"use client";

import { Product } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";

import {
  SelectLayoutGroup,
  ToggleLayout,
  ToggleLayoutCell,
  ToggleLayoutContainer,
} from "@/components/systaliko-ui/ecommerce/toggle-layout";
import type { ProductsTableProps } from "@/features/products/types";
import { cn } from "@/lib/utils";
import { Card, CardHeader } from "@/features/shadcn/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shadcn/components/ui/select";

function ProductsTable({ data }: ProductsTableProps) {
  const [limit, setLimit] = useQueryState("limit", { shallow: false });
  const [orderBy, setOrderBy] = useQueryState("orderBy", { shallow: false });
  const [loading, startTransition] = useTransition();

  return (
    <div
      className={cn("flex flex-col gap-4 relative", loading && "opacity-50")}
    >
      {loading && (
        <Loader2 className="size-4 animate-spin absolute top-0 left-0" />
      )}
      <ToggleLayout>
        {/* Fila de controles */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* OrderBy Select */}
          <Select
            value={orderBy || "created_at-desc"}
            onValueChange={(value) => {
              startTransition(() => {
                setOrderBy(value);
              });
            }}
            disabled={loading}
          >
            <SelectTrigger size="sm" className="w-[160px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name ↑</SelectItem>
              <SelectItem value="name-desc">Name ↓</SelectItem>
              <SelectItem value="price-asc">Price ↑</SelectItem>
              <SelectItem value="price-desc">Price ↓</SelectItem>
              <SelectItem value="created_at-asc">Created ↑</SelectItem>
              <SelectItem value="created_at-desc">Created ↓</SelectItem>
            </SelectContent>
          </Select>

          {/* Limit Select */}
          <Select
            value={limit?.toString() || "5"}
            onValueChange={(value) => {
              startTransition(() => {
                setLimit(value);
              });
            }}
            disabled={loading}
          >
            <SelectTrigger size="sm" className="w-[100px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>

          {/* Toggle List/Grid */}
          <SelectLayoutGroup className="ml-auto" />
        </div>

        {/* Grid de productos */}
        <ToggleLayoutContainer>
          {data.map((product: Product) => {
            return (
              <ToggleLayoutCell key={product.id}>
                <Card>
                  <CardHeader>
                    <h2>{product.name}</h2>
                  </CardHeader>
                </Card>
              </ToggleLayoutCell>
            );
          })}
        </ToggleLayoutContainer>
      </ToggleLayout>
    </div>
  );
}

export { ProductsTable };
