"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/features/layout/components/data-table"
import { cn } from "@/lib/utils"
import { Order } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Eye, MapPin, MoreHorizontal, Trash2, Truck } from "lucide-react"
import Link from "next/link"
import ChangeOrderStatusButton from "./change-order-status-button"
import CancelOrderButton from "./cancel-order-button"

type Props = {
    data: Order[]
    slug: string
    userId: number
}

function OrdersTable({ data, slug, userId }: Props) {

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
            header: "Customer",
            accessorKey: "user",
            cell: ({ row }) => {
                console.log(row.original)
                return <span>test@test.com</span>
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
            cell: ({ row }) => {
                const shippingMethod = row.original.shipping_method
                return <span>{shippingMethod === "pickup" ? <MapPin className="w-4 h-4" /> : <Truck className="w-4 h-4" />}</span>
            }
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => {
                const order = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/stores/${slug}/orders/${order.id}`} className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    View details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <ChangeOrderStatusButton 
                                    order={order}
                                    slug={slug}
                                    userId={userId}
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <CancelOrderButton
                                    order={order}
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
            filterKey="id"
        />
    )
}
export default OrdersTable