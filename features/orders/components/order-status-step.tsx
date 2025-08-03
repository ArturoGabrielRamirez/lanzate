"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Save, Truck, Store } from "lucide-react"
import { useState, useTransition } from "react"
import { updateOrderStatusAction } from "../actions/updateOrderStatusAction"
import { updateOrderShippingMethodAction } from "../actions/updateOrderShippingMethodAction"
import { toast } from "sonner"
import { OrderStatus } from "@prisma/client"
import { usePathname } from "next/navigation"

type Order = {
    id: number
    shipping_method: "PICKUP" | "DELIVERY"
    status: OrderStatus
}

type Props = {
    order: Order
}

function OrderStatusStep({ order }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(order.status)
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(order.shipping_method)
    const [isPending, startTransition] = useTransition()
    const [isShippingPending, startShippingTransition] = useTransition()
    const pathname = usePathname()

    // Define status options based on order type
    const statusOptions = selectedShippingMethod === "PICKUP"
        ? [
            { value: "PROCESSING", label: "Processing" },
            { value: "READY", label: "Ready" },
            { value: "CANCELLED", label: "Cancelled" }
          ]
        : [
            { value: "PROCESSING", label: "Processing" },
            { value: "READY", label: "Ready" },
            { value: "DELIVERED", label: "Delivered" },
            { value: "CANCELLED", label: "Cancelled" }
          ]

    const shippingMethodOptions = [
        { value: "PICKUP", label: "Pickup", icon: Store },
        { value: "DELIVERY", label: "Delivery", icon: Truck }
    ]

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value as OrderStatus)
    }

    const handleShippingMethodChange = (value: string) => {
        setSelectedShippingMethod(value as "PICKUP" | "DELIVERY")
    }

    const handleSaveStatus = () => {
        if (selectedStatus === order.status) {
            toast.info("Status is already the same")
            return
        }

        startTransition(async () => {
            try {
                const result = await updateOrderStatusAction({
                    orderId: order.id.toString(),
                    newStatus: selectedStatus
                })

                if (result.error) {
                    toast.error(result.message)
                } else {
                    toast.success("Order status updated successfully")
                    window.location.reload()
                }
            } catch (error) {
                console.error("Error updating order status:", error)
                toast.error("Failed to update order status")
            }
        })
    }

    const handleSaveShippingMethod = () => {
        if (selectedShippingMethod === order.shipping_method) {
            toast.info("Shipping method is already the same")
            return
        }

        startShippingTransition(async () => {
            try {
                const result = await updateOrderShippingMethodAction({
                    orderId: order.id.toString(),
                    newShippingMethod: selectedShippingMethod,
                    pathname
                })

                if (result.error) {
                    toast.error(result.message)
                } else {
                    toast.success("Order shipping method updated successfully")
                    window.location.reload()
                }
            } catch (error) {
                console.error("Error updating order shipping method:", error)
                toast.error("Failed to update order shipping method")
            }
        })
    }

    return (
        <div className="grow flex flex-col justify-center">
            <div>
                <h3 className="text-lg font-semibold mb-2">Update Order Status</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Change the current status and shipping method of this order
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Shipping Method Section */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Shipping Method</label>
                    <Select value={selectedShippingMethod} onValueChange={handleShippingMethodChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                        <SelectContent>
                            {shippingMethodOptions.map((option) => {
                                const IconComponent = option.icon
                                return (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <IconComponent className="w-4 h-4" />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    <Button 
                        onClick={handleSaveShippingMethod}
                        disabled={isShippingPending || selectedShippingMethod === order.shipping_method}
                        variant="outline"
                        className="self-end"
                    >
                        <Truck className="w-4 h-4 mr-2" />
                        {isShippingPending ? "Saving..." : "Save Method"}
                    </Button>
                </div>

                {/* Order Status Section */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Order Status</label>
                    <Select value={selectedStatus} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button 
                        onClick={handleSaveStatus}
                        disabled={isPending || selectedStatus === order.status}
                        className="self-end"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isPending ? "Saving..." : "Save Status"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OrderStatusStep 