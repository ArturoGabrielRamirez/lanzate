"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Order } from "@prisma/client"
import { CheckCircle, Clock, AlertCircle, Package, Truck } from "lucide-react"

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

function CustomerOrderConfirmationStep({ order }: Props) {
    const isPickup = order.shipping_method === "PICKUP"
    const isConfirmed = order.status === "READY" || order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED"
    const isProcessing = order.status === "PROCESSING"

    const getConfirmationStatus = () => {
        if (isConfirmed) {
            return {
                icon: CheckCircle,
                title: "Order Confirmed!",
                description: isPickup 
                    ? "Your order has been confirmed and is ready for pickup at the store."
                    : "Your order has been confirmed and is being prepared for delivery.",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200"
            }
        } else if (isProcessing) {
            return {
                icon: Package,
                title: "Order Being Processed",
                description: "Your order is currently being prepared. We'll notify you when it's ready!",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200"
            }
        } else {
            return {
                icon: Clock,
                title: "Order Pending Confirmation",
                description: "Your order has been received and is waiting to be confirmed by the store.",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200"
            }
        }
    }

    const status = getConfirmationStatus()

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Order Confirmation Status</h3>
                
                <div className={cn("border rounded-lg p-4", status.bgColor, status.borderColor)}>
                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 rounded-full border p-2 ${status.borderColor}`}>
                            <status.icon className={`w-5 h-5 ${status.color}`} />
                        </div>
                        <div>
                            <h3 className={`font-medium ${status.color}`}>
                                {status.title}
                            </h3>
                            <p className="text-sm mt-1 text-muted-foreground">
                                {status.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">What happens next?</h4>
                <div className="space-y-3">
                    {isPickup ? (
                        <>
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                                    <Package className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">Order Preparation</h5>
                                    <p className="text-xs text-muted-foreground">
                                        The store is preparing your order with care
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">Ready for Pickup</h5>
                                    <p className="text-xs text-muted-foreground">
                                        You'll be notified when your order is ready to pick up
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-shrink-0 rounded-full bg-purple-100 p-2">
                                    <Truck className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">Pickup</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Visit the store to collect your order
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                                    <Package className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">Order Preparation</h5>
                                    <p className="text-xs text-muted-foreground">
                                        The store is preparing your order for delivery
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">Ready for Delivery</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Your order is ready and waiting for delivery
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-shrink-0 rounded-full bg-orange-100 p-2">
                                    <Truck className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">On the Way</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Your order is on its way to your address
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-shrink-0 rounded-full bg-purple-100 p-2">
                                    <CheckCircle className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">Delivered</h5>
                                    <p className="text-xs text-muted-foreground">
                                        Your order has been delivered successfully
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Need Help?</h4>
                <div className="bg-muted/30 border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium mb-2">Contact Information:</p>
                            <ul className="space-y-1">
                                <li>• Store: {order.store.name}</li>
                                <li>• Branch: {order.branch.name}</li>
                                <li>• Order ID: #{order.id}</li>
                            </ul>
                            <p className="mt-2">
                                If you have any questions about your order, please contact the store directly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerOrderConfirmationStep 