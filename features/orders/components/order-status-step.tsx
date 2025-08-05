"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useState, useTransition } from "react"
import { confirmOrderAction } from "../actions/confirmOrderAction"
import { toast } from "sonner"
import { OrderStatus } from "@prisma/client"

type Order = {
    id: number
    shipping_method: "PICKUP" | "DELIVERY"
    status: OrderStatus
}

type Props = {
    order: Order
}

function OrderStatusStep({ order }: Props) {
    const [isPending, startTransition] = useTransition()

    const handleConfirmOrder = () => {
        startTransition(async () => {
            try {
                const result = await confirmOrderAction({
                    orderId: order.id.toString()
                })

                if (result.error) {
                    toast.error(result.message)
                } else {
                    toast.success("Order confirmed successfully! The customer has been notified.")
                    window.location.reload()
                }
            } catch (error) {
                console.error("Error confirming order:", error)
                toast.error("Failed to confirm order")
            }
        })
    }

    const isOrderReady = order.status === "READY"

    return (
        <div className="grow flex flex-col justify-center">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Confirm Order</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Review all order information before confirming
                </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-2">Important Information:</p>
                        <ul className="space-y-1 text-blue-700">
                            <li>• Please review all order details carefully before confirming</li>
                            <li>• Once confirmed, the customer will be notified that their order is ready</li>
                            <li>• For <strong>pickup orders</strong>: Customer will be informed their order is ready for pickup</li>
                            <li>• For <strong>delivery orders</strong>: Customer will be informed their order is ready for delivery</li>
                            <li>• Any changes to the order can still be made after confirmation</li>
                            <li>• Order tracking will be automatically created for customer updates</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button 
                    onClick={handleConfirmOrder}
                    disabled={isPending || isOrderReady}
                    size="lg"
                    className="min-w-[200px]"
                >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {isPending ? "Confirming..." : isOrderReady ? "Order Already Confirmed" : "Confirm Order"}
                </Button>
            </div>

            {isOrderReady && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-green-600 font-medium">
                        ✓ This order has already been confirmed and the customer has been notified
                    </p>
                </div>
            )}
        </div>
    )
}

export default OrderStatusStep 