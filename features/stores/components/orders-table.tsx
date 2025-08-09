"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/features/layout/components/data-table"
import { cn } from "@/lib/utils"
import { Order } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MapPin, MoreHorizontal, Truck } from "lucide-react"
import Link from "next/link"
import CancelOrderButton from "./cancel-order-button"
import { ExportOrdersButton } from "@/features/orders/components"
import { useTranslations } from "next-intl"

type Props = {
    data: Order[]
    slug: string
    userId: number
}

function OrdersTable({ data, slug, userId }: Props) {

    const t = useTranslations("store.orders-table")

    const columns: ColumnDef<Order>[] = [
        {
            header: t("headers.id"),
            accessorKey: "id",
        },
        {
            //header: t("headers.status"),
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
            accessorKey: "status",
            cell: ({ row }) => {
                const status = row.original.status
                const statusMap = {
                    "PENDING": t("statuses.pending"),
                    "PROCESSING": t("statuses.processing"),
                    "READY": t("statuses.ready"),
                    "SHIPPED": t("statuses.shipped"),
                    "DELIVERED": t("statuses.delivered"),
                    "CANCELLED": t("statuses.cancelled"),
                    "COMPLETED": t("statuses.completed")
                }
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
                            status === "COMPLETED" && "border-green-500 text-green-500"
                        )}
                    >
                        {statusMap[status as keyof typeof statusMap] || status}
                    </Badge>
                )
            }
        },
        {
            //header: t("headers.total"),
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.total")}
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
            accessorKey: "total_price",
            cell: ({ row }) => {
                const total = row.original.total_price
                return <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}</span>
            }
        },
        {
            //header: t("headers.customer"),
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.customer")}
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
            accessorKey: "user",
            cell: ({ row }) => {
                console.log(row.original)
                return <span>{row.original.customer_email || "No email"}</span>
            }
        },
        {
            //header: t("headers.date"),
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.date")}
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
            accessorKey: "created_at",
            cell: ({ row }) => {
                const createdAt = row.original.created_at
                return <span>{Intl.DateTimeFormat("es-AR", { dateStyle: "short" }).format(createdAt)}</span>
            }
        },
        {
            //header: t("headers.items"),
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.items")}
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
            accessorKey: "total_quantity",
            cell: ({ row }) => {
                const totalQuantity = row.original.total_quantity
                return <span>{totalQuantity} {totalQuantity === 1 ? t("items-count.item") : t("items-count.items")}</span>
            }
        },
        {
            header: t("headers.type"),
            accessorKey: "shipping_method",
            cell: ({ row }) => {
                const shippingMethod = row.original.shipping_method
                return <span>{shippingMethod === "PICKUP" ? <MapPin className="w-4 h-4" /> : <Truck className="w-4 h-4" />}</span>
            }
        },
        {
            header: t("dropdown.actions"),
            accessorKey: "actions",
            cell: ({ row }) => {
                const order = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("dropdown.open-menu")}</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">{t("dropdown.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/stores/${slug}/orders/${order.id}`} className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    {t("dropdown.view-details")}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
            topActions={<ExportOrdersButton data={data} />}
        />
    )
}
export default OrdersTable