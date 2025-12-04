"use client"

import { Product, Category } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { EllipsisVertical, Eye } from "lucide-react"
import { ArrowUpDown, Crown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { useMedia } from "react-use"

import { DataTable } from "@/features/global/components/data-table"
import { DeleteProductButton, EditProductButton/* , DistributeStockButton  */ } from "@/features/products/components"
import { DeleteVariantButton } from "@/features/products/components/delete-variant-button"
import type { ProductsTableProps, ProductsTableVariantRow } from "@/features/products/types"
import { buildVariantLabel, calculateVariantStock } from "@/features/products/utils"
import { DropDrawer, DropDrawerContent, DropDrawerGroup, DropDrawerItem, DropDrawerTrigger } from "@/features/shadcn/components/components/ui/dropdrawer"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"
import { Checkbox } from "@/features/shadcn/components/ui/checkbox"
import { DropdownMenu } from "@/features/shadcn/components/ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/features/shadcn/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

function ProductsTable({
    data,
    userId,
    slug,
    employeePermissions,
    headerActions // ✅ Nuevo prop
    /* , branches */
}: ProductsTableProps) {

    const t = useTranslations("store.products-table")
    const isMobile = useMedia("(max-width: 768px)")

    // Check if user can create products
    //const canCreateProducts = employeePermissions.isAdmin || employeePermissions.permissions?.can_create_products

    const nameColumnDef = {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    {t("headers.name")}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="size-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const r = row.original
            if (r.variant_id) {
                const displayName = r.variant_label && r.variant_label !== "Variante"
                    ? `${r.name} - ${r.variant_label}`
                    : r.name
                return (
                    <Link href={`/stores/${slug}/products/${r.id}/${r.variant_id}`} className="hover:underline">
                        {displayName}
                    </Link>
                )
            }
            return (
                <Link href={`/stores/${slug}/products/${r.id}`} className="hover:underline">
                    {r.name}
                </Link>
            )
        }
    }

    const priceColumnDef = {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    {t("headers.price")}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="size-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const rowData = row.original
            const price = rowData.variant_price ?? (rowData.variants?.[0]?.price ?? 0)
            return <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price)}</span>
        }
    }

    const stockColumnDef = {
        accessorKey: "stock",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    {t("headers.stock")}
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="size-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const stock = row.original.stock
            return <span className={cn(stock < 10 && "text-red-500", stock < 25 && "text-yellow-500", stock >= 25 && "text-green-500")}>{stock}</span>
        }
    }

    const actionsColumnDef = {
        header: isMobile ? undefined : t("headers.actions"),
        accessorKey: "actions",
        cell: ({ row }) => {

            return (
                <DropDrawer>
                    <DropDrawerTrigger asChild>
                        <IconButton
                            className="shrink-0"
                            icon={EllipsisVertical}
                        />
                    </DropDrawerTrigger>
                    <DropDrawerContent>
                        <DropDrawerGroup>
                            <DropDrawerItem icon={<Eye className="size-6 lg:size-4" />} asChild>
                                <Link href={`/stores/${slug}/products/${row.original.id}`}>
                                    Ver detalle
                                </Link>
                            </DropDrawerItem>
                            <DropDrawerItem>
                                {/* <DeleteVariantButton
                                    variantId={row.original.variant_id}
                                    slug={slug}
                                    productId={row.original.id}
                                /> */}
                            </DropDrawerItem>

                        </DropDrawerGroup>
                    </DropDrawerContent>
                </DropDrawer>
            )
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("dropdown.open-menu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="flex flex-col">
                        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">{t("dropdown.actions")}</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Button variant="ghost" className="w-full justify-start cursor-pointer hover:!bg-primary" asChild>
                                <Link href={`/stores/${slug}/products/${row.original.id}${row.original.variant_id ? `/${row.original.variant_id}` : ""}`} >
                                    <Eye className="w-4 h-4" />{t("dropdown.view-details")}
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button variant="ghost" className="w-full justify-start cursor-pointer hover:!bg-primary" asChild>
                                <Link href={`/stores/${slug}/products/${row.original.id}`}>
                                    <Eye className="w-4 h-4" />Ver producto / View product
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                        {(employeePermissions.isAdmin || employeePermissions.permissions?.can_manage_stock) && (
                            <>
                                <DropdownMenuSeparator />
                                {/*  <DropdownMenuItem asChild>
                                    {(() => {
                                        const currentVariantStocks = row.original.variant_id
                                            ? (row.original as any).variants?.find((v: { id: number | undefined }) => v.id === row.original.variant_id)?.stocks as
                                                | { branch_id: number; quantity: number }[]
                                                | undefined
                                            : undefined
                                        return (
                                            <DistributeStockButton
                                                productId={row.original.id}
                                                productName={row.original.name}
                                                availableStock={row.original.stock}
                                                branches={branches}
                                                variantStocks={currentVariantStocks}
                                            />
                                        )
                                    })()}
                                </DropdownMenuItem> */}
                            </>
                        )}
                        {employeePermissions.isAdmin && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <EditProductButton
                                        product={row.original}
                                        slug={slug}
                                        userId={userId}
                                    />
                                </DropdownMenuItem>
                                {row.original.variant_id && (
                                    <DropdownMenuItem asChild>
                                        <DeleteVariantButton
                                            variantId={row.original.variant_id}
                                            slug={slug}
                                            productId={row.original.id}
                                        />
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <DeleteProductButton
                                        productId={row.original.id}
                                        slug={slug}
                                        userId={userId}
                                    />
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }

    const rows: ProductsTableVariantRow[] = useMemo(() => {
        const flattened: ProductsTableVariantRow[] = []

        for (const p of data) {
            const variants = p.variants ?? []
            if (variants.length === 0) {
                // Product without variants - calculate stock from all variants if any exist
                const totalStock = 0
                flattened.push({
                    ...p,
                    variant_id: undefined,
                    variant_label: undefined,
                    stock: totalStock,
                    variant_price: undefined
                })
                continue
            }

            for (const v of variants) {
                const vStock = calculateVariantStock(v)
                const label = buildVariantLabel(v)
                flattened.push({
                    ...p,
                    stock: vStock,
                    variant_id: v.id,
                    variant_label: label,
                    variant_price: v.price
                })
            }
        }
        return flattened
    }, [data])

    const columns: ColumnDef<ProductsTableVariantRow>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    value={row.getIsSelected() ? "true" : "false"}
                    onChange={(checked) => row.toggleSelected(checked)}
                    aria-label="Select row"
                />
            ),
        },
        nameColumnDef,
        priceColumnDef,
        {
            accessorKey: "categories",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.categories")}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <ArrowUpDown className="size-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const categories = (row.original as Product & { categories: Category[] }).categories
                if (!categories?.length) {
                    return (
                        <Badge variant="outline" className="text-muted-foreground">
                            {t("categories.none")}
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
            },
        },
        stockColumnDef,
        {
            accessorKey: "is_featured",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.featured")}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <ArrowUpDown className="size-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const isFeatured = row.original.is_featured
                return <Crown className={cn("size-4 text-muted-foreground", isFeatured && "text-yellow-500")} />
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.status")}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <ArrowUpDown className="size-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const status = row.original.status
                const isActive = status === "ACTIVE"
                return <Badge variant="outline" className={cn(isActive && "text-accent-foreground border-accent-foreground")}>{isActive ? t("boolean.yes") : t("boolean.no")}</Badge>
            }
        },
        actionsColumnDef,
    ]

    const mobileColumns = [
        nameColumnDef,
        priceColumnDef,
        stockColumnDef,
        actionsColumnDef,
    ]

    return (
        <DataTable
            columns={isMobile ? mobileColumns : columns}
            data={rows}
            filterKey="name"
            headerActions={headerActions}
        />
    )
}

export { ProductsTable }