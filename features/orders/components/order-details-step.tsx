"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Package } from "lucide-react"

type OrderItemWithProduct = {
    id: number
    quantity: number
    price: number
    product: {
        id: number
        name: string
        image: string | null
    }
}

type Order = {
    id: number
    created_at: Date
    shipping_method: "pickup" | "delivery"
    status: "PENDING" | "PROCESSING" | "READY" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "COMPLETED"
    total_price: number
    total_quantity: number
    items: OrderItemWithProduct[]
    payment: {
        amount: number
        status: "PENDING" | "PAID"
    }
}

type Props = {
    order: Order
    showFullDetails?: boolean
}

function OrderDetailsStep({ order, showFullDetails = false }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const t = (key: string) => {
        const translations: Record<string, string> = {
            "branches.store-pickup": "Store Pickup",
            "branches.delivery": "Delivery",
            "orders.item": "item",
            "orders.items": "items",
            "orders.quantity": "Quantity: ",
            "orders.amount": "Amount",
            "orders.status": "Status"
        }
        return translations[key] || key
    }

    return (
        <div className="space-y-6">
            {showFullDetails && (
                <div className="flex items-center gap-2 justify-between">
                    <p className="text-sm">{formatDate(order.created_at)}</p>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm uppercase border-2">
                            {order.shipping_method === "pickup" ? t("branches.store-pickup") : t("branches.delivery")}
                        </Badge>
                        <Badge
                            className={cn(
                                "bg-transparent text-sm",
                                order.status === "PENDING" && "border-yellow-500 text-yellow-500",
                                order.status === "PROCESSING" && "border-orange-500 text-orange-500",
                                order.status === "READY" && "border-blue-500 text-blue-500",
                                order.status === "SHIPPED" && "border-violet-500 text-violet-500",
                                order.status === "DELIVERED" && "border-green-500 text-green-500",
                                order.status === "CANCELLED" && "border-red-500 text-red-500",
                                order.status === "COMPLETED" && "border-green-500 text-green-500"
                            )}
                        >
                            {order.status}
                        </Badge>
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Order ID</span>
                        <span className="font-medium">#{order.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Amount</span>
                        <span className="text-lg font-bold">{formatCurrency(order.total_price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Items</span>
                        <span className="font-medium">{order.total_quantity} {order.total_quantity === 1 ? t("orders.item") : t("orders.items")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Payment Status</span>
                        <Badge variant={order.payment.status === "PAID" ? "default" : "secondary"}>
                            {order.payment.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Products</h4>
                <div className="space-y-3">
                    {order.items.map((item: OrderItemWithProduct) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-md bg-secondary">
                                    {item.product.image ? (
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <Package className="w-6 h-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <h5 className="font-medium">{item.product.name}</h5>
                                    <p className="text-sm text-muted-foreground">
                                        {t("orders.quantity")}{item.quantity} × {formatCurrency(item.price)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsStep 