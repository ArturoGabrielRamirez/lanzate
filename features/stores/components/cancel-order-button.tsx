"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { formatErrorResponse } from "@/utils/lib"
import { Trash2 } from "lucide-react"
import { Order } from "@prisma/client"
import { changeOrderStatus } from "../actions/changeOrderStatus"

type Props = {
    order: Order
    slug: string
    userId: number
    onComplete?: () => void
}

function CancelOrderButton({ order, slug, userId, onComplete }: Props) {
    
    const handleCancelOrder = async () => {
        const data = {
            newStatus: "CANCELLED",
            confirmPayment: false,
            confirmStockRestore: true // Auto-confirm for direct cancellation
        }

        return changeOrderStatus(order.id, data, slug, userId)
    }

    const isOrderCancellable = order.status !== 'DELIVERED' && order.status !== 'CANCELLED'

    if (!isOrderCancellable) {
        return (
            <div className="flex items-center gap-2 w-full p-2 text-muted-foreground text-sm cursor-not-allowed">
                <Trash2 className="w-4 h-4" />
                Cannot cancel
            </div>
        )
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Trash2 className="text-muted-foreground size-4" />
                    Cancel Order
                </>
            )}
            title="Cancel Order"
            description="Are you sure you want to cancel this order? This will restore product stock and reverse the store balance. This action cannot be undone."
            action={handleCancelOrder}
            onComplete={onComplete}
            messages={{
                success: "Order cancelled successfully!",
                error: "Failed to cancel order",
                loading: "Cancelling order..."
            }}
            className="bg-transparent w-full justify-start text-red-600 hover:text-red-700"
        />
    )
}

export default CancelOrderButton 