"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Order } from "@prisma/client"
import { CheckCircle, Clock, Package, Truck, MapPin, AlertCircle, Check } from "lucide-react"

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
            address: string
        }
        tracking?: {
            tracking_status: string
        } | null
    }
}

function CustomerOrderTrackingStep({ order }: Props) {
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const currentTrackingStatus = order.tracking?.tracking_status

    const getTrackingStatusInfo = () => {
        if (!currentTrackingStatus) {
            return {
                icon: Clock,
                title: "Order Received",
                description: "Your order has been received and is being processed",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200"
            }
        }

        const statusConfig = {
            PREPARING_ORDER: {
                icon: Package,
                title: "Preparing Order",
                description: "Your order is being prepared and will be ready soon",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200"
            },
            WAITING_FOR_PICKUP: {
                icon: CheckCircle,
                title: "Ready for Pickup",
                description: "Your order is ready! You can come to pick it up at the store",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200"
            },
            PICKED_UP: {
                icon: CheckCircle,
                title: "Order Picked Up",
                description: "Your order has been successfully picked up",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200"
            },
            WAITING_FOR_DELIVERY: {
                icon: Package,
                title: "Ready for Delivery",
                description: "Your order is ready and waiting to be delivered",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200"
            },
            ON_THE_WAY: {
                icon: Truck,
                title: "On the Way",
                description: "Your order is on its way to your address",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
                borderColor: "border-orange-200"
            },
            DELIVERED: {
                icon: CheckCircle,
                title: "Order Delivered",
                description: "Your order has been successfully delivered",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200"
            },
            CANCELLED: {
                icon: Check,
                title: "Order Cancelled",
                description: "Your order has been cancelled",
                color: "text-red-600",
                bgColor: "bg-red-50",
                borderColor: "border-red-200"
            }
        }

        return statusConfig[currentTrackingStatus as keyof typeof statusConfig] || statusConfig.PREPARING_ORDER
    }

    const getTrackingTimeline = () => {
        const timeline = []
        
        // Always show order placed
        timeline.push({
            icon: CheckCircle,
            title: "Order Placed",
            description: "Your order has been received",
            completed: true,
            color: "text-green-600",
            bgColor: "bg-green-100"
        })

        if (isPickup) {
            // Pickup timeline
            timeline.push({
                icon: Package,
                title: "Order Preparation",
                description: "Your order is being prepared",
                completed: order.status !== "PENDING",
                color: order.status !== "PENDING" ? "text-green-600" : "text-gray-400",
                bgColor: order.status !== "PENDING" ? "bg-green-100" : "bg-gray-100"
            })

            timeline.push({
                icon: CheckCircle,
                title: "Ready for Pickup",
                description: "Your order is ready for pickup",
                completed: order.status === "READY" || order.status === "COMPLETED",
                color: (order.status === "READY" || order.status === "COMPLETED") ? "text-green-600" : "text-gray-400",
                bgColor: (order.status === "READY" || order.status === "COMPLETED") ? "bg-green-100" : "bg-gray-100"
            })

            timeline.push({
                icon: CheckCircle,
                title: "Order Picked Up",
                description: "You have picked up your order",
                completed: order.status === "COMPLETED",
                color: order.status === "COMPLETED" ? "text-green-600" : "text-gray-400",
                bgColor: order.status === "COMPLETED" ? "bg-green-100" : "bg-gray-100"
            })
        } else {
            // Delivery timeline
            timeline.push({
                icon: Package,
                title: "Order Preparation",
                description: "Your order is being prepared",
                completed: order.status !== "PENDING",
                color: order.status !== "PENDING" ? "text-green-600" : "text-gray-400",
                bgColor: order.status !== "PENDING" ? "bg-green-100" : "bg-gray-100"
            })

            timeline.push({
                icon: CheckCircle,
                title: "Ready for Delivery",
                description: "Your order is ready for delivery",
                completed: order.status === "READY" || order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED",
                color: (order.status === "READY" || order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED") ? "text-green-600" : "text-gray-400",
                bgColor: (order.status === "READY" || order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED") ? "bg-green-100" : "bg-gray-100"
            })

            timeline.push({
                icon: Truck,
                title: "On the Way",
                description: "Your order is being delivered",
                completed: order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED",
                color: (order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED") ? "text-green-600" : "text-gray-400",
                bgColor: (order.status === "SHIPPED" || order.status === "DELIVERED" || order.status === "COMPLETED") ? "bg-green-100" : "bg-gray-100"
            })

            timeline.push({
                icon: CheckCircle,
                title: "Delivered",
                description: "Your order has been delivered",
                completed: order.status === "DELIVERED" || order.status === "COMPLETED",
                color: (order.status === "DELIVERED" || order.status === "COMPLETED") ? "text-green-600" : "text-gray-400",
                bgColor: (order.status === "DELIVERED" || order.status === "COMPLETED") ? "bg-green-100" : "bg-gray-100"
            })
        }

        return timeline
    }

    const trackingInfo = getTrackingStatusInfo()
    const timeline = getTrackingTimeline()

    return (
        <div className="space-y-6">
            {/* Success Message for Completed Orders */}
            {isCompleted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 rounded-full border border-green-600 p-2">
                            <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-green-800 font-medium">
                                Order Successfully Completed!
                            </h3>
                            <p className="text-green-700 text-sm mt-1">
                                {isPickup
                                    ? "You have successfully picked up your order."
                                    : "Your order has been delivered successfully."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Current Tracking Status */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Current Status</h3>
                <div className={cn("border rounded-lg p-4", trackingInfo.bgColor, trackingInfo.borderColor)}>
                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 rounded-full border p-2 ${trackingInfo.borderColor}`}>
                            <trackingInfo.icon className={`w-5 h-5 ${trackingInfo.color}`} />
                        </div>
                        <div>
                            <h3 className={`font-medium ${trackingInfo.color}`}>
                                {trackingInfo.title}
                            </h3>
                            <p className="text-sm mt-1 text-muted-foreground">
                                {trackingInfo.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Timeline */}
            <div>
                <h4 className="font-medium mb-3">Order Timeline</h4>
                <div className="space-y-3">
                    {timeline.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className={`flex-shrink-0 rounded-full p-2 ${step.bgColor}`}>
                                <step.icon className={`w-4 h-4 ${step.color}`} />
                            </div>
                            <div className="flex-1">
                                <h5 className={`font-medium text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.title}
                                </h5>
                                <p className={`text-xs ${step.completed ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Location Information */}
            <div>
                <h4 className="font-medium mb-3">Location Information</h4>
                <div className="bg-muted/30 border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                            <h5 className="font-medium text-sm">{order.branch.name}</h5>
                            <p className="text-sm text-muted-foreground">{order.branch.address}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isPickup 
                                    ? "This is where you'll pick up your order"
                                    : "This is where your order is being prepared"
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Need Help Section */}
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
                                If you have any questions about your order status, please contact the store directly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerOrderTrackingStep 