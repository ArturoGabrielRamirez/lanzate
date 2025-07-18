"use client"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/features/layout/components/data-table"
import { cn } from "@/lib/utils"
import { Order } from "@/prisma/generated/prisma"
import { ColumnDef } from "@tanstack/react-table"

type Props = {
    data: Order[]
}

function OrdersTable({ data }: Props) {

    const columns: ColumnDef<Order>[] = [
        {
            header: "ID",
            accessorKey: "id",
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <Badge
                        className={cn(
                            "bg-transparent",
                            status === "PENDING" && "border-yellow-500 text-yellow-500",
                            status === "PROCESSING" && "border-orange-500 text-orange-500",
                            status === "READY" && "border-blue-500 text-blue-500",
                            status === "SHIPPED" && "border-violet-500 text-violet-500",
                            status === "DELIVERED" && "border-green-500 text-green-500",
                            status === "CANCELLED" && "border-red-500 text-red-500",
                        )}
                    >
                        {status}
                    </Badge>
                )
            }
        },
        {
            header: "Total",
            accessorKey: "total_price",
            cell: ({ row }) => {
                const total = row.original.total_price
                return <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}</span>
            }
        },
        {
            header: "Date",
            accessorKey: "created_at",
            cell: ({ row }) => {
                const createdAt = row.original.created_at
                return <span>{Intl.DateTimeFormat("es-AR", { dateStyle: "short" }).format(createdAt)}</span>
            }
        },
        {
            header: "Items",
            accessorKey: "total_quantity",
            cell: ({ row }) => {
                const totalQuantity = row.original.total_quantity
                return <span>{totalQuantity} {totalQuantity === 1 ? "item" : "items"}</span>
            }
        },
        {
            header: "Type",
            accessorKey: "shipping_method",
        }
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
        />
    )
}
export default OrdersTable