"use client"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/features/layout/components/data-table"
import { Product, Category } from "@/prisma/generated/prisma"
import { ColumnDef } from "@tanstack/react-table"

type Props = {
    data: (Product & { categories: Category[] })[]
}

function ProductsTable({ data }: Props) {

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