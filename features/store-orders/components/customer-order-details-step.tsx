"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Order } from "@prisma/client"
import { Package, Store, MapPin, Calendar, Check, Clock, X, Loader2, Truck } from "lucide-react"

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
        store: {
            name: string
        }
        branch: {
            name: string
        }
    }
}

function CustomerOrderDetailsStep({ order }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusIcon = () => {
        switch (order.status) {
            case 'PENDING':
                return Clock
            case 'PROCESSING':
                return Loader2
            case 'READY':
                return Check
            case 'SHIPPED':
                return Truck
            case 'DELIVERED':
                return Check
            case 'CANCELLED':
                return X
            case 'COMPLETED':
                return Check
            default:
                return Clock
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'READY':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'DELIVERED':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                <div className="flex flex-col gap-3 border rounded-lg bg-muted/30 p-4">
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
                        <span className="font-medium">{order.total_quantity} {order.total_quantity === 1 ? 'item' : 'items'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Order Status</span>
                        <Badge className={cn("border", getStatusColor(order.status))}>
                            {React.createElement(getStatusIcon(), { className: "w-4 h-4 mr-1" })}
                            {order.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Shipping Method</span>
                        <Badge variant="outline">
                            {order.shipping_method === "PICKUP" ? (
                                <>
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Store Pickup
                                </>
                            ) : (
                                <>
                                    <Truck className="w-4 h-4 mr-1" />
                                    Delivery
                                </>
                            )}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Store</span>
                        <div className="flex items-center gap-1">
                            <Store className="w-4 h-4" />
                            <span className="font-medium">{order.store.name}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Branch</span>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{order.branch.name}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Order Date</span>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{formatDate(order.created_at)}</span>
                        </div>
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
                                        Quantity: {item.quantity} × {formatCurrency(item.price)}
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

export default CustomerOrderDetailsStep 