"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/features/layout/components/data-table"
import { MoreHorizontal } from "lucide-react"
import { Eye } from "lucide-react"
import { Product, Category } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { CreateProductButton, DeleteProductButton, EditProductButton, ExportProductsButton } from "@/features/products/components"
import Link from "next/link"
import { useTranslations } from "next-intl"

type Props = {
    data: (Product & { categories: Category[] })[]
    userId: number
    slug: string
    storeId: number
}

function ProductsTable({ data, userId, slug, storeId }: Props) {

    const t = useTranslations("store.products-table")

    const columns: ColumnDef<Product & { categories: Category[] }>[] = [
        {
            header: t("headers.id"),
            accessorKey: "id",
        },
        {
            header: t("headers.name"),
            accessorKey: "name",
        },
        {
            header: t("headers.price"),
            accessorKey: "price",
            cell: ({ row }) => {
                const price = row.original.price
                return <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price)}</span>
            }
        },
        {
            header: t("headers.categories"),
            accessorKey: "categories",
            cell: ({ row }) => {
                const categories = (row.original as Product & { categories: Category[] }).categories

                if (!categories?.length)
                    return <Badge variant="outline">{t("categories.none")}</Badge>

                return (
                    <Badge variant="outline">
                        {categories.map((category: Category) => category.name).join(", ")}
                    </Badge>
                )
            },
        },
        {
            header: t("headers.stock"),
            accessorKey: "stock",
        },
        {
            header: t("headers.featured"),
            accessorKey: "is_featured",
            cell: ({ row }) => {
                const isFeatured = row.original.is_featured
                return <Badge variant="outline">{isFeatured ? t("boolean.yes") : t("boolean.no")}</Badge>
            }
        },
        {
            header: t("headers.active"),
            accessorKey: "is_published",
            cell: ({ row }) => {
                const isActive = row.original.is_published
                return <Badge variant="outline">{isActive ? t("boolean.yes") : t("boolean.no")}</Badge>
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
            topActions={
                <div className="flex items-center gap-2">
                    <ExportProductsButton data={data} />
                    <CreateProductButton storeId={storeId} userId={userId} />
                </div>
            }
        />
    )
}

export default ProductsTable