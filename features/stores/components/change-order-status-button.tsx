"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { formatErrorResponse } from "@/utils/lib"
import { Edit } from "lucide-react"
import { Order, OrderStatus } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { changeOrderStatus } from "../actions/changeOrderStatus"

type Props = {
    order: Order
    slug: string
    userId: number
    onComplete?: () => void
}

function ChangeOrderStatusButton({ order, slug, userId, onComplete }: Props) {
    
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status)
    const [confirmPayment, setConfirmPayment] = useState(false)
    const [confirmStockRestore, setConfirmStockRestore] = useState(false)

    const statusOptions = [
        { value: 'PENDING' as OrderStatus, label: 'Pending', color: 'border-yellow-500 text-yellow-500' },
        { value: 'PROCESSING' as OrderStatus, label: 'Processing', color: 'border-orange-500 text-orange-500' },
        { value: 'READY' as OrderStatus, label: 'Ready', color: 'border-blue-500 text-blue-500' },
        { value: 'SHIPPED' as OrderStatus, label: 'Shipped', color: 'border-violet-500 text-violet-500' },
        { value: 'DELIVERED' as OrderStatus, label: 'Delivered', color: 'border-green-500 text-green-500' },
        { value: 'CANCELLED' as OrderStatus, label: 'Cancelled', color: 'border-red-500 text-red-500' }
    ]

    const selectedStatusInfo = statusOptions.find(s => s.value === selectedStatus)

    const showPaymentConfirmation = selectedStatus !== 'PENDING' && selectedStatus !== 'CANCELLED' && order.status === 'PENDING'
    const showStockRestoreConfirmation = selectedStatus === 'CANCELLED' && order.status !== 'CANCELLED'

    const isFormValid = () => {
        if (selectedStatus === order.status) return false
        if (showPaymentConfirmation && !confirmPayment) return false
        if (showStockRestoreConfirmation && !confirmStockRestore) return false
        return true
    }

    const handleChangeStatus = async () => {
        if (!isFormValid()) {
            return formatErrorResponse("Please confirm all required fields", null, null)
        }

        const data = {
            newStatus: selectedStatus,
            confirmPayment: showPaymentConfirmation ? confirmPayment : false,
            confirmStockRestore: showStockRestoreConfirmation ? confirmStockRestore : false
        }

        return changeOrderStatus(order.id, data, slug, userId)
    }

    const getStatusChangeDescription = () => {
        if (selectedStatus === 'CANCELLED' && order.status !== 'CANCELLED') {
            return "Cancelling this order will restore product stock and reverse the store balance."
        }
        if (selectedStatus !== 'PENDING' && order.status === 'PENDING') {
            return "Changing from PENDING status will mark the order as paid and update payment records."
        }
        return "Update the order status to reflect its current state."
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Edit className="text-muted-foreground size-4" />
                    Change Status
                </>
            )}
            title="Change Order Status"
            description={getStatusChangeDescription()}
            action={handleChangeStatus}
            onComplete={onComplete}
            messages={{
                success: "Order status updated successfully!",
                error: "Failed to update order status",
                loading: "Updating order status..."
            }}
            className="bg-transparent w-full justify-start"
            formDisabled={!isFormValid()}
        >
            <div className="space-y-4">
                
                {/* Current Status */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Current Order Status</h4>
                    <Badge
                        className={cn(
                            "bg-transparent",
                            order.status === "PENDING" && "border-yellow-500 text-yellow-500",
                            order.status === "PROCESSING" && "border-orange-500 text-orange-500",
                            order.status === "READY" && "border-blue-500 text-blue-500",
                            order.status === "SHIPPED" && "border-violet-500 text-violet-500",
                            order.status === "DELIVERED" && "border-green-500 text-green-500",
                            order.status === "CANCELLED" && "border-red-500 text-red-500",
                        )}
                    >
                        {order.status}
                    </Badge>
                </div>

                {/* Status Selection */}
                <div className="space-y-2">
                    <Label htmlFor="status">New Status</Label>
                    <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn("bg-transparent text-xs", status.color)}>
                                            {status.label}
                                        </Badge>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Preview of selected status */}
                {selectedStatusInfo && selectedStatus !== order.status && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <h4 className="font-medium text-sm mb-2">New Status Preview</h4>
                        <Badge className={cn("bg-transparent", selectedStatusInfo.color)}>
                            {selectedStatusInfo.label}
                        </Badge>
                    </div>
                )}

                {/* Payment Confirmation */}
                {showPaymentConfirmation && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                        <div className="space-y-3">
                            <p className="text-sm font-medium">
                                Payment will be automatically marked as PAID
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Changing from PENDING to {selectedStatus} indicates the order has been paid. 
                                The payment status will be updated accordingly.
                            </p>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="confirm_payment" 
                                    checked={confirmPayment} 
                                    onCheckedChange={(checked) => setConfirmPayment(checked === true)}
                                />
                                <Label 
                                    htmlFor="confirm_payment" 
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I confirm this order has been paid
                                </Label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stock Restore Confirmation */}
                {showStockRestoreConfirmation && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="space-y-3">
                            <p className="text-sm font-medium">
                                This will restore product stock and reverse store balance
                            </p>
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p>Cancelling this order will:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Restore product stock quantities</li>
                                    <li>Reverse the store balance transaction</li>
                                    <li>Create a new REFUND transaction</li>
                                    <li>Log the cancellation action</li>
                                </ul>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="confirm_stock_restore" 
                                    checked={confirmStockRestore} 
                                    onCheckedChange={(checked) => setConfirmStockRestore(checked === true)}
                                />
                                <Label 
                                    htmlFor="confirm_stock_restore" 
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I understand the consequences of cancelling this order
                                </Label>
                            </div>
                        </div>
                    </div>
                )}

                {/* No changes warning */}
                {selectedStatus === order.status && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <p className="text-sm text-muted-foreground">
                            The selected status is the same as the current status. No changes will be made.
                        </p>
                    </div>
                )}

            </div>
        </ButtonWithPopup>
    )
}

export default ChangeOrderStatusButton 