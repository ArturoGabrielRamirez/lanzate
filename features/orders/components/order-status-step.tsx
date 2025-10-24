"use client"

import { OrderStatus } from "@prisma/client"
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { confirmOrderAction } from "@/features/orders/actions/confirm-order.action"
import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"
import { Button } from "@/features/shadcn/components/ui/button"
import { cn } from "@/lib/utils"

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
    status: OrderStatus
}

type Props = {
    order: Order
    employeePermissions: EmployeePermissions
}

function OrderStatusStep({ order, employeePermissions }: Props) {
    const [isPending, startTransition] = useTransition()

    // Check if user can update orders
    const canUpdateOrders = employeePermissions.isAdmin || employeePermissions.permissions?.can_update_orders

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
    const isOrderCompleted = order.status === "COMPLETED"

    return (
        <div className="grow flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2">Confirm Order</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Review all order information before confirming
            </p>
            {isOrderReady && (
                <p className=" text-green-600 font-medium text-center mb-4">
                    ✓ This order has already been confirmed and the customer has been notified
                </p>
            )}
            <div className={cn("bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6", isOrderReady || isOrderCompleted && "opacity-30")}>
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
                {canUpdateOrders ? (
                    <Button
                        onClick={handleConfirmOrder}
                        disabled={isPending || isOrderReady || isOrderCompleted}
                        size="lg"
                        className="min-w-[200px]"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {isPending ? "Confirming..." : isOrderReady ? "Order Already Confirmed" : "Confirm Order"}
                    </Button>
                ) : (
                    <Alert className="w-full max-w-md">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            You don&apos;t have sufficient permissions to change the status of this order. Please contact an administrator.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}

export { OrderStatusStep }