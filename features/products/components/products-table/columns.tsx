"use client"

import { Category } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Crown, Eye, EllipsisVertical } from "lucide-react"
import Link from "next/link"

import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { DeleteProductButton, EditProductButton } from "@/features/products/components"
import { DeleteVariantButton } from "@/features/products/components/delete-variant-button"
import type { ProductsTableVariantRow, EmployeePermissions } from "@/features/products/types"
import { DropDrawer, DropDrawerContent, DropDrawerGroup, DropDrawerItem, DropDrawerTrigger } from "@/features/shadcn/components/components/ui/dropdrawer"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Checkbox } from "@/features/shadcn/components/ui/checkbox"
import { cn } from "@/lib/utils"

export type ColumnFactoryContext = {
    slug: string
    userId: number
    employeePermissions: EmployeePermissions
    t: (key: string) => string
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
})

function formatCurrency(value?: number | null) {
    return currencyFormatter.format(value ?? 0)
}

function getStockColorClass(quantity: number) {
    if (quantity <= 0) return "text-destructive"
    if (quantity < 10) return "text-amber-500"
    return "text-emerald-600"
}

/**
 * Get columns for the products table.
 * This follows tnks-data-table getColumns interface.
 * 
 * @param handleRowDeselection - Function to deselect a row (provided by tnks-data-table)
 */
export function getProductColumns(
    ctx: ColumnFactoryContext,
    _handleRowDeselection?: ((rowId: string) => void) | null
): ColumnDef<ProductsTableVariantRow, unknown>[] {
    return [
        // Selection column
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    isSelected={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && false)
                    }
                    onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    isSelected={row.getIsSelected()}
                    onChange={(checked) => row.toggleSelected(checked)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },

        // Name column
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={ctx.t("headers.name")} />
            ),
            cell: ({ row }) => {
                const r = row.original
                const href = r.variant_id
                    ? `/stores/${ctx.slug}/products/${r.id}/${r.variant_id}`
                    : `/stores/${ctx.slug}/products/${r.id}`
                const displayName = r.variant_id && r.variant_label && r.variant_label !== "Variante"
                    ? `${r.name} - ${r.variant_label}`
                    : r.name
                return (
                    <Link href={href} className="hover:underline font-medium">
                        {displayName}
                    </Link>
                )
            }
        },

        // Price column
        {
            accessorKey: "price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={ctx.t("headers.price")} />
            ),
            cell: ({ row }) => {
                const price = row.original.variant_price ?? (row.original.variants?.[0]?.price ?? 0)
                return <span>{formatCurrency(price)}</span>
            }
        },

        // Categories column
        {
            accessorKey: "categories",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={ctx.t("headers.categories")} />
            ),
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
                        {categories.slice(0, 2).map((category: Category) => (
                            <Badge key={category.id} variant="outline">
                                {category.name}
                            </Badge>
                        ))}
                        {categories.length > 2 && (
                            <Badge variant="outline">+{categories.length - 2}</Badge>
                        )}
                    </div>
                )
            },
            enableSorting: false,
        },

        // Stock column
        {
            accessorKey: "stock",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={ctx.t("headers.stock")} />
            ),
            cell: ({ row }) => {
                const stock = row.original.stock
                return <span className={getStockColorClass(stock)}>{stock}</span>
            }
        },

        // Featured column
        {
            accessorKey: "is_featured",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={ctx.t("headers.featured")} />
            ),
            cell: ({ row }) => (
                <Crown className={cn("size-4 text-muted-foreground", row.original.is_featured && "text-yellow-500")} />
            )
        },

        // Status column
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={ctx.t("headers.status")} />
            ),
            cell: ({ row }) => {
                const isActive = row.original.status === "ACTIVE"
                return (
                    <Badge variant="outline" className={cn(isActive && "text-accent-foreground border-accent-foreground")}>
                        {isActive ? ctx.t("boolean.yes") : ctx.t("boolean.no")}
                    </Badge>
                )
            }
        },

        // Actions column
        {
            id: "actions",
            header: ctx.t("headers.actions"),
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
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ]
}

/**
 * Mobile columns - subset for smaller screens
 */
export function getMobileProductColumns(
    ctx: ColumnFactoryContext,
    handleRowDeselection?: ((rowId: string) => void) | null
): ColumnDef<ProductsTableVariantRow, unknown>[] {
    const allColumns = getProductColumns(ctx, handleRowDeselection)
    
    // Return only name, price, and actions for mobile
    return allColumns.filter(col => 
        col.id === "actions" || 
        ('accessorKey' in col && (col.accessorKey === "name" || col.accessorKey === "price"))
    )
}

