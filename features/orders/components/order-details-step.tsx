"use client"

import { Badge } from "@/features/shadcn/components/ui/badge"
import { cn } from "@/lib/utils"
import { Order } from "@prisma/client"
import { Package, User, Store, Globe, MapPin, Truck, CheckCircle, Check, Clock, X, Loader2 } from "lucide-react"
import React from "react"

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

type Props = {
    order: Order & {
        items: OrderItemWithProduct[]
        payment: {
            status: "PENDING" | "PAID"
        }
        customer_name?: string | null
        customer_email?: string | null
        customer_phone?: string | null
    }
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
            "orders.status": "Status",
            "orders.cash-register": "Cash Register",
            "orders.public-store": "Online Store",
            "orders.customer-info": "Customer Information",
            "orders.order-type": "Order Type"
        }
        return translations[key] || key
    }

    const getOrderTypeIcon = () => {
        return order.order_type === "CASH_REGISTER" ? Store : Globe
    }

    const getOrderTypeLabel = () => {
        return order.order_type === "CASH_REGISTER" ? t("orders.cash-register") : t("orders.public-store")
    }

    return (
        <div className="space-y-2 md:space-y-4 lg:space-y-6">
            {showFullDetails && (
                <div className="flex items-center gap-2 justify-between">
                    {/* <p className="text-sm">{formatDate(order.created_at)}</p> */}
                    {/*  */}
                </div>
            )}

            <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 flex items-center justify-between gap-2">
                    <span>Order Details</span>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs md:text-sm uppercase border-2">
                            {order.shipping_method === "PICKUP" ? t("branches.store-pickup") : t("branches.delivery")}
                        </Badge>
                        <Badge
                            className={cn(
                                "bg-transparent text-xs md:text-sm",
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
                </h3>
                <div className="flex flex-col gap-1 md:gap-2 border rounded-lg bg-muted/30 p-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Order ID</span>
                        <span className="text-sm md:text-base font-medium">#{order.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Total Amount</span>
                        <span className="text-lg md:text-xl font-bold">{formatCurrency(order.total_price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Total Items</span>
                        <span className="text-sm md:text-base font-medium">{order.total_quantity} {order.total_quantity === 1 ? t("orders.item") : t("orders.items")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Payment Status</span>
                        <Badge variant={"outline"} className={cn(
                            "text-xs md:text-sm",
                            order.payment.status === "PAID" && "bg-green-500 text-white"
                        )}>
                            {order.payment.status === "PAID" && <Check className="w-4 h-4" />}
                            {order.payment.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Order Status</span>
                        <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"}
                            className={cn(
                                "text-xs md:text-sm",
                                order.status === "COMPLETED" && "bg-green-500 text-white",
                                order.status === "CANCELLED" && "bg-red-500 text-white",
                                order.status === "PENDING" && "bg-yellow-500 text-white",
                                order.status === "PROCESSING" && "bg-orange-500 text-white",
                                order.status === "READY" && "bg-blue-500 text-white",
                                order.status === "SHIPPED" && "bg-violet-500 text-white",
                                order.status === "DELIVERED" && "bg-green-500 text-white"
                            )}
                        >
                            {order.status === "COMPLETED" && <Check className="w-4 h-4" />}
                            {order.status === "CANCELLED" && <X className="w-4 h-4" />}
                            {order.status === "PENDING" && <Clock className="w-4 h-4" />}
                            {order.status === "PROCESSING" && <Loader2 className="w-4 h-4" />}
                            {order.status === "READY" && <Check className="w-4 h-4" />}
                            {order.status === "SHIPPED" && <Truck className="w-4 h-4" />}
                            {order.status === "DELIVERED" && <Check className="w-4 h-4" />}
                            {order.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Shipping Method</span>
                        {order.shipping_method === "PICKUP" ? (
                            <Badge variant="outline">
                                <MapPin className="w-4 h-4" />
                                {order.shipping_method}
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="text-xs md:text-sm">
                                {order.shipping_method}
                            </Badge>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">{t("orders.order-type")}</span>
                        <div className="flex items-center gap-2">
                            {React.createElement(getOrderTypeIcon(), { className: "w-4 h-4" })}
                            <span className="text-sm md:text-base font-medium">{getOrderTypeLabel()}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">

                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Order Date</span>
                        <span className="text-sm md:text-base font-medium">{formatDate(order.created_at)}</span>
                    </div>
                </div>
            </div>

            {/* Customer Information */}
            <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t("orders.customer-info")}
                </h4>
                <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Name</span>
                        <span className="text-sm md:text-base font-medium">{order.customer_name || "Name not available"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Email</span>
                        <span className="text-sm md:text-base font-medium">{order.customer_email || "Email not available"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Phone</span>
                        <span className="text-sm md:text-base font-medium">{order.customer_phone || "Phone not available"}</span>
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