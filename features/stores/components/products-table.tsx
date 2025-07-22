"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/features/layout/components/data-table"
import { MoreHorizontal } from "lucide-react"
import { Eye } from "lucide-react"
import { Product, Category } from "@/prisma/generated/prisma"
import { ColumnDef } from "@tanstack/react-table"
import { DeleteProductButton, EditProductButton } from "@/features/products/components"

type Props = {
    data: (Product & { categories: Category[] })[]
    userId: number
}

function ProductsTable({ data, userId }: Props) {

    const columns: ColumnDef<Product>[] = [
        {
            header: "ID",
            accessorKey: "id",
        },
        {
            header: "Name",
            accessorKey: "name",
        },
        {
            header: "Price",
            accessorKey: "price",
            cell: ({ row }) => {
                const price = row.original.price
                return <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price)}</span>
            }
        },
        {
            header: "Categories",
            accessorKey: "categories",
            cell: ({ row }) => {
                const categories = row.original.categories
                return <Badge variant="outline">{categories.map((category) => category.name).join(", ")}</Badge>
            }
        },
        {
            header: "Stock",
            accessorKey: "stock",
        },
        {
            header: "Featured",
            accessorKey: "is_featured",
            cell: ({ row }) => {
                const isFeatured = row.original.is_featured
                return <Badge variant="outline">{isFeatured ? "Yes" : "No"}</Badge>
            }
        },
        {
            header: "Active",
            accessorKey: "is_published",
            cell: ({ row }) => {
                const isActive = row.original.is_published
                return <Badge variant="outline">{isActive ? "Yes" : "No"}</Badge>
            }
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="flex flex-col">
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Actions</DropdownMenuLabel>
                            <DropdownMenuItem><Eye className="w-4 h-4" />View details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <EditProductButton
                                    product={row.original}
                                    slug={row.original.slug}
                                    userId={userId}
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <DeleteProductButton
                                    productId={row.original.id}
                                    slug={row.original.slug}
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
        />
    )
}

export default ProductsTable