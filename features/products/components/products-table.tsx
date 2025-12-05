/* "use client"

import { Category } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { EllipsisVertical, Eye, Crown } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useMemo, useCallback } from "react"
import { useMedia } from "react-use"

import { DataTable } from "@/features/global/components/data-table"
import {
    createTypedColumnHelper,
    SortableHeader,
    formatters,
    getStockColorClass
} from "@/features/global/utils/column-helpers"
import { DeleteProductButton, EditProductButton } from "@/features/products/components"
import { DeleteVariantButton } from "@/features/products/components/delete-variant-button"
import type { ProductsTableProps, ProductsTableVariantRow, EmployeePermissions } from "@/features/products/types"
import { buildVariantLabel, calculateVariantStock } from "@/features/products/utils"
import { DropDrawer, DropDrawerContent, DropDrawerGroup, DropDrawerItem, DropDrawerTrigger } from "@/features/shadcn/components/components/ui/dropdrawer"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { cn } from "@/lib/utils"

// ==========================================
// Column Helper & Types
// ==========================================

const columnHelper = createTypedColumnHelper<ProductsTableVariantRow>()

type ColumnFactoryContext = {
    slug: string
    userId: number
    employeePermissions: EmployeePermissions
    t: ReturnType<typeof useTranslations>
    isMobile: boolean
}

// ==========================================
// Column Factory Functions
// ==========================================

function createNameColumn(ctx: ColumnFactoryContext): ColumnDef<ProductsTableVariantRow> {
    return {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader label={ctx.t("headers.name")} column={column} />,
        cell: ({ row }) => {
            const r = row.original
            const href = r.variant_id
                ? `/stores/${ctx.slug}/products/${r.id}/${r.variant_id}`
                : `/stores/${ctx.slug}/products/${r.id}`
            const displayName = r.variant_id && r.variant_label && r.variant_label !== "Variante"
                ? `${r.name} - ${r.variant_label}`
                : r.name
            return (
                <Link href={href} className="hover:underline">
                    {displayName}
                </Link>
            )
        }
    }
}

function createPriceColumn(ctx: ColumnFactoryContext): ColumnDef<ProductsTableVariantRow> {
    return {
        accessorKey: "price",
        header: ({ column }) => <SortableHeader label={ctx.t("headers.price")} column={column} />,
        cell: ({ row }) => {
            const price = row.original.variant_price ?? (row.original.variants?.[0]?.price ?? 0)
            return <span>{formatters.currency(price)}</span>
        }
    }
}

function createStockColumn(ctx: ColumnFactoryContext): ColumnDef<ProductsTableVariantRow> {
    return {
        accessorKey: "stock",
        header: ({ column }) => <SortableHeader label={ctx.t("headers.stock")} column={column} />,
        cell: ({ row }) => {
            const stock = row.original.stock
            return <span className={getStockColorClass(stock)}>{stock}</span>
        }
    }
}

function createCategoriesColumn(ctx: ColumnFactoryContext): ColumnDef<ProductsTableVariantRow> {
    return {
        accessorKey: "categories",
        header: ({ column }) => <SortableHeader label={ctx.t("headers.categories")} column={column} />,
        cell: ({ row }) => {
            const categories = row.original.categories
            if (!categories?.length) {
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        {ctx.t("categories.none")}
                    </Badge>
                )
            }
            return (
                <div className="flex flex-wrap gap-1">
                    {categories.map((category: Category) => (
                        <Badge key={category.id} variant="outline">
                            {category.name}
                        </Badge>
                    ))}
                </div>
            )
        }
    }
}

function createFeaturedColumn(ctx: ColumnFactoryContext): ColumnDef<ProductsTableVariantRow> {
    return {
        accessorKey: "is_featured",
        header: ({ column }) => <SortableHeader label={ctx.t("headers.featured")} column={column} />,
        cell: ({ row }) => (
            <Crown className={cn("size-4 text-muted-foreground", row.original.is_featured && "text-yellow-500")} />
        )
    }
}

function createStatusColumn(ctx: ColumnFactoryContext): ColumnDef<ProductsTableVariantRow> {
    return {
        accessorKey: "status",
        header: ({ column }) => <SortableHeader label={ctx.t("headers.status")} column={column} />,
        cell: ({ row }) => {
            const isActive = row.original.status === "ACTIVE"
            return (
                <Badge variant="outline" className={cn(isActive && "text-accent-foreground border-accent-foreground")}>
                    {isActive ? ctx.t("boolean.yes") : ctx.t("boolean.no")}
                </Badge>
            )
        }
    }
}

function createActionsColumn(ctx: ColumnFactoryContext): ColumnDef<ProductsTableVariantRow> {
    return {
        id: "actions",
        header: ctx.isMobile ? undefined : ctx.t("headers.actions"),
        cell: ({ row }) => (
            <DropDrawer>
                <DropDrawerTrigger asChild>
                    <IconButton className="shrink-0" icon={EllipsisVertical} />
                </DropDrawerTrigger>
                <DropDrawerContent>
                    <DropDrawerGroup>
                        <DropDrawerItem icon={<Eye className="size-6 lg:size-4" />} asChild>
                            <Link href={`/stores/${ctx.slug}/products/${row.original.id}`}>
                                Ver detalle
                            </Link>
                        </DropDrawerItem>
                        {ctx.employeePermissions.isAdmin && (
                            <>
                                <DropDrawerItem asChild>
                                    <EditProductButton
                                        product={row.original}
                                        slug={ctx.slug}
                                        userId={ctx.userId}
                                    />
                                </DropDrawerItem>
                                {row.original.variant_id && (
                                    <DropDrawerItem asChild>
                                        <DeleteVariantButton
                                            variantId={row.original.variant_id}
                                            slug={ctx.slug}
                                            productId={row.original.id}
                                        />
                                    </DropDrawerItem>
                                )}
                                <DropDrawerItem asChild>
                                    <DeleteProductButton
                                        productId={row.original.id}
                                        slug={ctx.slug}
                                        userId={ctx.userId}
                                    />
                                </DropDrawerItem>
                            </>
                        )}
                    </DropDrawerGroup>
                </DropDrawerContent>
            </DropDrawer>
        )
    }
}

// ==========================================
// Main Component
// ==========================================

function ProductsTable({
    data,
    userId,
    slug,
    employeePermissions,
    headerActions
}: ProductsTableProps) {
    const t = useTranslations("store.products-table")
    const isMobile = useMedia("(max-width: 768px)")

    // Create column context
    const columnContext: ColumnFactoryContext = useMemo(() => ({
        slug,
        userId,
        employeePermissions,
        t,
        isMobile: !!isMobile
    }), [slug, userId, employeePermissions, t, isMobile])

    // Transform data to variant rows
    const rows = useMemo(() => {
        const flattened: ProductsTableVariantRow[] = []

        for (const p of data) {
            const variants = p.variants ?? []
            if (variants.length === 0) {
                flattened.push({
                    ...p,
                    variant_id: undefined,
                    variant_label: undefined,
                    stock: 0,
                    variant_price: undefined
                })
                continue
            }

            for (const v of variants) {
                flattened.push({
                    ...p,
                    stock: calculateVariantStock(v),
                    variant_id: v.id,
                    variant_label: buildVariantLabel(v),
                    variant_price: v.price
                })
            }
        }
        return flattened
    }, [data])

    // Build columns using factory functions
    const columns = useMemo((): ColumnDef<ProductsTableVariantRow>[] => [
        columnHelper.selectColumn(),
        createNameColumn(columnContext),
        createPriceColumn(columnContext),
        createCategoriesColumn(columnContext),
        createStockColumn(columnContext),
        createFeaturedColumn(columnContext),
        createStatusColumn(columnContext),
        createActionsColumn(columnContext),
    ], [columnContext])

    // Mobile columns - subset of full columns
    const mobileColumns = useMemo((): ColumnDef<ProductsTableVariantRow>[] => [
        createNameColumn(columnContext),
        createPriceColumn(columnContext),
        createStockColumn(columnContext),
        createActionsColumn(columnContext),
    ], [columnContext])

    // Row ID getter for expandable functionality
    const getRowId = useCallback((row: ProductsTableVariantRow) =>
        `${row.id}-${row.variant_id ?? "base"}`,
    [])

    return (
        <DataTable
            columns={isMobile ? mobileColumns : columns}
            data={rows}
            filterKey="name"
            headerActions={headerActions}
            getRowId={getRowId}
        />
    )
}

export { ProductsTable } */
"use client"

import { Product } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs"
import { useTransition } from "react";

import type { ProductsTableProps } from "@/features/products/types";
import { cn } from "@/lib/utils";

function ProductsTable({ data }: ProductsTableProps) {
    const [limit, setLimit] = useQueryState("limit", { shallow: false })
    const [orderBy, setOrderBy] = useQueryState("orderBy", { shallow: false })
    const [loading, startTransition] = useTransition()

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        startTransition(() => {
            setLimit(e.target.value)
        })
    }

    const handleOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        startTransition(() => {
            setOrderBy(e.target.value)
        })
    }

    return (
        <>
            <div className={cn("flex flex-col gap-4 relative", loading && "opacity-50")}>
                {loading && <Loader2 className="size-4 animate-spin absolute top-0 left-0" />}
                {data.map((product: Product) => {
                    return (
                        <article key={product.id}>
                            <h2>{product.name}</h2>
                        </article>
                    )
                })}
            </div>
            <select value={orderBy || "created_at"} onChange={handleOrderByChange} disabled={loading}>
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
    )
}

export { ProductsTable }