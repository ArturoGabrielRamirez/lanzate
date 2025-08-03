"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useState, useTransition } from "react"
import { updateOrderStatusAction } from "../actions/updateOrderStatusAction"
import { toast } from "sonner"
import { OrderStatus } from "@prisma/client"

type Order = {
    id: number
    shipping_method: "pickup" | "delivery"
    status: OrderStatus
}

type Props = {
    order: Order
}

function OrderStatusStep({ order }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(order.status)
    const [isPending, startTransition] = useTransition()

    // Define status options based on order type
    const statusOptions = order.shipping_method === "pickup"
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

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value as OrderStatus)
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

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Update Order Status</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Change the current status of this order
                </p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Order Status</label>
                    <Select value={selectedStatus} onValueChange={handleStatusChange}>
                        <SelectTrigger>
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
                </div>
                <Button 
                    onClick={handleSaveStatus}
                    disabled={isPending || selectedStatus === order.status}
                    className="w-full"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Saving..." : "Save Status"}
                </Button>
            </div>
        </div>
    )
}

export default OrderStatusStep 