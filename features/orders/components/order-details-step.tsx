"use client"

import { Package, User, Store, Globe, MapPin, Truck, Check, Clock, X, Loader2 } from "lucide-react"
import Image from "next/image"
import React from "react"

import { OrderDetailsStepProps, OrderItemWithProduct } from "@/features/orders/types"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { cn } from "@/lib/utils"

function OrderDetailsStep({ order, showFullDetails = false }: OrderDetailsStepProps) {
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
            "branches.store-pickup": "Recogida en tienda",
            "branches.delivery": "Entrega",
            "orders.item": "artículo",
            "orders.items": "artículos",
            "orders.quantity": "Cantidad: ",
            "orders.amount": "Monto",
            "orders.status": "Estado",
            "orders.cash-register": "Caja Registradora",
            "orders.public-store": "Tienda Online",
            "orders.customer-info": "Información del Cliente",
            "orders.order-type": "Tipo de Pedido"
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
                    <span>Detalles del Pedido</span>
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
                        <span className="text-xs md:text-sm text-muted-foreground">ID de Pedido</span>
                        <span className="text-sm md:text-base font-medium">#{order.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Monto Total</span>
                        <span className="text-lg md:text-xl font-bold">{formatCurrency(order.total_price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Total Artículos</span>
                        <span className="text-sm md:text-base font-medium">{order.total_quantity} {order.total_quantity === 1 ? t("orders.item") : t("orders.items")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Estado de Pago</span>
                        <Badge variant={"outline"} className={cn(
                            "text-xs md:text-sm",
                            order.payment.status === "PAID" && "bg-green-500 text-white"
                        )}>
                            {order.payment.status === "PAID" && <Check className="w-4 h-4" />}
                            {order.payment.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Estado del Pedido</span>
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
                        <span className="text-xs md:text-sm text-muted-foreground">Método de Envío</span>
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
                        <span className="text-xs md:text-sm text-muted-foreground">Fecha de Pedido</span>
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
                        <span className="text-xs md:text-sm text-muted-foreground">Nombre</span>
                        <span className="text-sm md:text-base font-medium">{order.customer_name || "Nombre no disponible"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Correo Electrónico</span>
                        <span className="text-sm md:text-base font-medium">{order.customer_email || "Correo no disponible"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">Teléfono</span>
                        <span className="text-sm md:text-base font-medium">{order.customer_phone || "Teléfono no disponible"}</span>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Productos</h4>
                <div className="space-y-3">
                    {order.items.map((item: OrderItemWithProduct) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-md bg-secondary">
                                    {item.product.image ? (
                                        <Image
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

export { OrderDetailsStep }