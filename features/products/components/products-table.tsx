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

function ProductsTable({ data }: ProductsTableProps) {
  const [limit, setLimit] = useQueryState("limit", { shallow: false });
  const [orderBy, setOrderBy] = useQueryState("orderBy", { shallow: false });
  const [loading, startTransition] = useTransition();

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setLimit(e.target.value);
    });
  };

  const handleOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setOrderBy(e.target.value);
    });
  };

  return (
    <>
      <div
        className={cn("flex flex-col gap-4 relative", loading && "opacity-50")}
      >
        {loading && (
          <Loader2 className="size-4 animate-spin absolute top-0 left-0" />
        )}
        <ToggleLayout>
          <SelectLayoutGroup className="mb-8" />
          <ToggleLayoutContainer>
            {data.map((product: Product) => {
              return (
                <ToggleLayoutCell key={product.id}>
                  <h2>{product.name}</h2>
                </ToggleLayoutCell>
              );
            })}
          </ToggleLayoutContainer>
        </ToggleLayout>
      </div>
      <select
        value={orderBy || "created_at"}
        onChange={handleOrderByChange}
        disabled={loading}
      >
        <option value="created_at">created at</option>
        <option value="name">name</option>
        <option value="price">price</option>
      </select>
      <select value={limit?.toString() || "10"} onChange={handleLimitChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </>
  );
}

export { ProductsTable };
