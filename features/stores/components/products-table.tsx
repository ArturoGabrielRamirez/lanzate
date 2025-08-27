"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/features/layout/components/data-table"
import { ArrowUpDown, Crown, MoreHorizontal } from "lucide-react"
import { Eye } from "lucide-react"
import { Product, Category, Branch, ProductStock } from "@prisma/client"
import { RowModel, ColumnDef } from "@tanstack/react-table"
import { CreateProductButton, DeleteProductButton, EditProductButton, ExportProductsButton, DistributeStockButton } from "@/features/products/components"
import { UpdatePricesButton } from "./update-prices-button"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

type EmployeePermissions = {
    isAdmin: boolean
    permissions?: {
        can_create_orders: boolean
        can_update_orders: boolean
        can_create_products: boolean
        can_update_products: boolean
        can_manage_stock: boolean
        can_process_refunds: boolean
        can_view_reports: boolean
        can_manage_employees: boolean
        can_manage_store: boolean
    }
}

type Props = {
    data: (Product & { categories: Category[] })[]
    userId: number
    slug: string
    storeId: number
    employeePermissions: EmployeePermissions
    branches: (Branch & {
        stock: ProductStock[]
    })[]
}

function ProductsTable({ data, userId, slug, storeId, employeePermissions, branches }: Props) {

    const t = useTranslations("store.products-table")

    // Check if user can create products
    //const canCreateProducts = employeePermissions.isAdmin || employeePermissions.permissions?.can_create_products

    const columns: ColumnDef<Product & { categories: Category[] }>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
        },
        {
            header: t("headers.id"),
            accessorKey: "id",
        },
        {
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
        },
        {
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
                const price = row.original.price
                return <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price)}</span>
            }
        },
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
                return (
                    <Badge variant="outline">
                        {!categories?.length
                            ? t("categories.none")
                            : categories.map((category: Category) => category.name).join(", ")
                        }
                    </Badge>
                )
            },
        },
        {
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
        },
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
            accessorKey: "is_active",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.active")}
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
                const isActive = row.original.is_active
                return <Badge variant="outline" className={cn(isActive && "text-accent-foreground border-accent-foreground")}>{isActive ? t("boolean.yes") : t("boolean.no")}</Badge>
            }
        },
        {
            accessorKey: "is_published",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.published")}
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
                const isPublished = row.original.is_published
                return <Badge variant="outline" className={cn(isPublished && "text-accent-foreground border-accent-foreground")}>{isPublished ? t("boolean.yes") : t("boolean.no")}</Badge>
            }
        },
        {
            header: t("headers.actions"),
            accessorKey: "actions",
            cell: ({ row }) => {
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
                                    <Link href={`/stores/${slug}/products/${row.original.id}`} >
                                        <Eye className="w-4 h-4" />{t("dropdown.view-details")}
                                    </Link>
                                </Button>
                            </DropdownMenuItem>
                            {(employeePermissions.isAdmin || employeePermissions.permissions?.can_manage_stock) && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <DistributeStockButton
                                            productId={row.original.id}
                                            productName={row.original.name}
                                            availableStock={row.original.stock}
                                            branches={branches}
                                        />
                                    </DropdownMenuItem>
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
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            filterKey="name"
            /* topActions={
                (filteredSelectedRowModel: RowModel<Product & { categories: Category[] }>) => {
                    return (
                        <div className="grid grid-cols-3 gap-2">
                            <UpdatePricesButton
                                selectedRows={filteredSelectedRowModel}
                                storeId={storeId}
                            />
                        </div>
                    )
                }
            } */
        />
    )
}

export default ProductsTable