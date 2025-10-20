"use client"

import { Button } from "@/features/shadcn/components/ui/button"
import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"
import { cn } from "@/lib/utils"
import { User, Mail, Phone, MapPin, MessageCircle, Check, Package, Truck, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { useTransition } from "react"
import { updateOrderTrackingAction } from "../actions/updateOrderTrackingAction"
import { finalizeOrderAction } from "../actions/finalizeOrderAction"
import { toast } from "sonner"
import { OrderTrackingStatus } from "@prisma/client"

type EmployeePermissions = {
    isAdmin: boolean
    permissions?: {
        can_create_orders: boolean
        can_update_orders: boolean
        can_create_products: boolean
        can_update_products: boolean
        can_manage_stock: boolean
        can_process_refunds: boolean
        can_view_reports: boolean
        can_manage_employees: boolean
        can_manage_store: boolean
    }
}

type Order = {
    id: number
    shipping_method: "PICKUP" | "DELIVERY"
    status: "PENDING" | "PROCESSING" | "READY" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "COMPLETED"
    customer_name: string | null
    customer_email: string | null
    customer_phone: string | null
    address_one?: string | null
    address_two?: string | null
    city?: string | null
    state?: string | null
    zip_code?: string | null
    country?: string | null
    branch?: {
        name: string
        address: string
    } | null
    created_by_employee?: {
        user?: {
            first_name: string | null
            last_name: string | null
            email: string
        }
    } | null
    updated_by_employee?: {
        user?: {
            first_name: string | null
            last_name: string | null
            email: string
        }
    } | null
    tracking?: {
        tracking_status: OrderTrackingStatus
    } | null
}

type Props = {
    order: Order
    employeePermissions: EmployeePermissions
}

function CustomerInfoStep({ order, employeePermissions }: Props) {
    const [isPending, startTransition] = useTransition()
    const [isFinalizing, startFinalizeTransition] = useTransition()
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const currentTrackingStatus = order.tracking?.tracking_status

    // Check if user can update orders
    const canUpdateOrders = employeePermissions.isAdmin || employeePermissions.permissions?.can_update_orders

    const handleWhatsAppClick = () => {
        if (order.customer_phone) {
            const phoneNumber = order.customer_phone.replace(/\D/g, '')
            const message = `Hi ${order.customer_name || 'there'}! Your order #${order.id} is ready for pickup.`
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, '_blank')
        }
    }

    const handleEmailClick = () => {
        // TODO: Implement email functionality
        console.log("Email functionality to be implemented")
    }

    const handleTrackingUpdate = (newStatus: OrderTrackingStatus) => {
        startTransition(async () => {
            try {
                const result = await updateOrderTrackingAction({
                    orderId: order.id.toString(),
                    newTrackingStatus: newStatus
                })

                if (result.error) {
                    toast.error(result.message)
                } else {
                    toast.success("Order tracking updated successfully")
                }
            } catch (error) {
                console.error("Error updating order tracking:", error)
                toast.error("Failed to update order tracking")
            }
        })
    }

    const handleFinalize = () => {
        startFinalizeTransition(async () => {
            try {
                const result = await finalizeOrderAction({
                    orderId: order.id.toString(),
                    shippingMethod: order.shipping_method
                })

                if (result.error) {
                    toast.error(result.message)
                } else {
                    const actionText = isPickup ? "picked up" : "delivered"
                    toast.success(`Order successfully finalized! The order has been marked as ${actionText}.`)
                }
            } catch (error) {
                console.error("Error finalizing order:", error)
                toast.error("Failed to finalize order")
            }
        })
    }

    const getTrackingStatusInfo = () => {
        if (!currentTrackingStatus) return null

        const statusConfig = {
            PREPARING_ORDER: {
                icon: Package,
                title: "Preparing Order",
                description: "The order is being prepared and will be ready soon. Mark as ready when the order is ready for pickup or delivery",
                color: "text-blue-600"
            },
            WAITING_FOR_PICKUP: {
                icon: Clock,
                title: "Ready for Pickup",
                description: "The order is ready! The customer has been notified and can come to pick it up",
                color: "text-green-600"
            },
            PICKED_UP: {
                icon: CheckCircle2,
                title: "Order Picked Up",
                description: "The order has been successfully picked up by the customer",
                color: "text-green-600"
            },
            WAITING_FOR_DELIVERY: {
                icon: Package,
                title: "Ready for Delivery",
                description: "The order is ready and waiting to be delivered",
                color: "text-green-600"
            },
            ON_THE_WAY: {
                icon: Truck,
                title: "On the Way",
                description: "The order is on its way to the customer",
                color: "text-orange-600"
            },
            DELIVERED: {
                icon: CheckCircle2,
                title: "Order Delivered",
                description: "The order has been successfully delivered to the customer",
                color: "text-green-600"
            },
            CANCELLED: {
                icon: Check,
                title: "Order Cancelled",
                description: "The order has been cancelled",
                color: "text-red-600"
            }
        }

        return statusConfig[currentTrackingStatus]
    }

    const getTrackingButtons = () => {
        if (!currentTrackingStatus) return null

        if (!canUpdateOrders) {
            return (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        You don&apos;t have sufficient permissions to update the status of this order. Please contact an administrator.
                    </AlertDescription>
                </Alert>
            )
        }

        if (isPickup) {
            return (
                <div className="space-y-2">
                    {currentTrackingStatus === "PREPARING_ORDER" && (
                        <Button
                            onClick={() => handleTrackingUpdate("WAITING_FOR_PICKUP")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "Lista para Buscar"}
                        </Button>
                    )}
                    {currentTrackingStatus === "WAITING_FOR_PICKUP" && (
                        <Button
                            onClick={() => handleTrackingUpdate("PREPARING_ORDER")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "Volver a Preparar"}
                        </Button>
                    )}
                    <Button
                        onClick={handleFinalize}
                        disabled={isFinalizing}
                        className="w-full"
                        variant="default"
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {isFinalizing ? "Finalizing..." : "Finalizar"}
                    </Button>
                </div>
            )
        } else {
            return (
                <div className="space-y-2">
                    {currentTrackingStatus === "PREPARING_ORDER" && (
                        <Button
                            onClick={() => handleTrackingUpdate("WAITING_FOR_DELIVERY")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "Esperando Delivery"}
                        </Button>
                    )}
                    {currentTrackingStatus === "WAITING_FOR_DELIVERY" && (
                        <Button
                            onClick={() => handleTrackingUpdate("ON_THE_WAY")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Truck className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "En Camino"}
                        </Button>
                    )}
                    {currentTrackingStatus !== "ON_THE_WAY" && (
                        <Button
                            onClick={handleFinalize}
                            disabled={isFinalizing}
                            className="w-full"
                            variant="default"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {isFinalizing ? "Finalizing..." : "Finalizar"}
                        </Button>
                    )}
                </div>
            )
        }
    }

    const formatAddress = () => {
        const parts = [
            order.address_one,
            order.address_two,
            order.city,
            order.state,
            order.zip_code,
            order.country
        ].filter(Boolean)

        return parts.join(', ')
    }

    const trackingInfo = getTrackingStatusInfo()

    return (
        <div className="space-y-6">
            {/* Success Message for Completed Orders */}
            {isCompleted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
                    <div className="flex items-center gap-3 flex-col">
                        <div className="flex-shrink-0 rounded-full border border-green-600  p-2">
                            <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-green-800 font-medium">
                                Order Successfully Completed!
                            </h3>
                            <p className="text-green-700 text-sm mt-1">
                                {isPickup
                                    ? "The customer has picked up their order successfully."
                                    : "The order has been delivered to the customer successfully."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Tracking Status */}

            {/* Order Tracking Controls */}
            {currentTrackingStatus && !isCompleted && (
                <div className="space-y-3">
                    <h4 className="font-medium">Order Tracking</h4>
                    {trackingInfo && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 rounded-full border border-blue-600 p-2 ${trackingInfo.color}`}>
                                    <trackingInfo.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`font-medium ${trackingInfo.color}`}>
                                        {trackingInfo.title}
                                    </h3>
                                    <p className="text-blue-700 text-sm mt-1">
                                        {trackingInfo.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {getTrackingButtons()}
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="font-medium">{order.customer_name || 'No name provided'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{order.customer_email || "No email provided"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Phone className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{order.customer_phone || "No phone provided"}</span>
                    </div>

                    {!isPickup && order.address_one && (
                        <div className="flex items-start gap-2">
                            <MapPin className="size-4 text-muted-foreground mt-0.5" />
                            <div className="text-muted-foreground">
                                <p className="font-medium">Delivery Address:</p>
                                <p>{formatAddress()}</p>
                            </div>
                        </div>
                    )}

                    {isPickup && order.branch && (
                        <div className="flex items-start gap-2">
                            <MapPin className="size-4 text-muted-foreground mt-0.5" />
                            <div className="text-muted-foreground">
                                <p>{order.branch.name}</p>
                                <p>{order.branch.address}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isPickup ? (
                <div className="space-y-3">
                    <h4 className="font-medium">Contact Customer</h4>
                    <div className="flex gap-2">
                        <div className={cn(
                            "w-full",
                            !order.customer_phone && "opacity-50 cursor-not-allowed"
                        )}>
                            <Button
                                onClick={handleWhatsAppClick}
                                className={cn("w-full")}
                                variant="outline"
                                disabled={!order.customer_phone}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Send WhatsApp Message
                            </Button>
                        </div>
                        <div className={cn(
                            "w-full",
                            !order.customer_email && "opacity-50 cursor-not-allowed"
                        )}>
                            <Button
                                onClick={handleEmailClick}
                                className={cn("w-full")}
                                variant="outline"
                                disabled={!order.customer_email}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email (Coming Soon)
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <h4 className="font-medium">Delivery Map</h4>
                    <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="aspect-video bg-muted rounded flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <MapPin className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">Google Maps Integration</p>
                                <p className="text-xs">Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(order.created_by_employee || order.updated_by_employee) && (
                <div className="space-y-3">
                    <h4 className="font-medium">Order Management</h4>
                    {order.created_by_employee && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">Created by: </span>
                            <span className="font-medium">
                                {order.created_by_employee.user?.first_name
                                    ? `${order.created_by_employee.user.first_name} ${order.created_by_employee.user.last_name || ''}`
                                    : order.created_by_employee.user?.email
                                }
                            </span>
                        </div>
                    )}
                    {order.updated_by_employee && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">Last updated by: </span>
                            <span className="font-medium">
                                {order.updated_by_employee.user?.first_name
                                    ? `${order.updated_by_employee.user.first_name} ${order.updated_by_employee.user.last_name || ''}`
                                    : order.updated_by_employee.user?.email
                                }
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CustomerInfoStep 