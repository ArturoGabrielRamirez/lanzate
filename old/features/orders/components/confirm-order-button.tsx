"use client"
import { AlertDescription } from "@/components/ui/alert"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Order } from "@prisma/client"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { useTransition } from "react"
import { confirmOrderAction } from "../actions/confirmOrderAction"
import { toast } from "sonner"

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

type Props = {
    order: Order
    employeePermissions?: EmployeePermissions
    canUpdateOrders: boolean
    size?: "default" | "sm" | "lg"
}

const ConfirmOrderButton = ({ order, canUpdateOrders, size = "default" }: Props) => {

    const isOrderReady = order.status === "READY"
    const isOrderCompleted = order.status === "COMPLETED"
    const [isPending, startTransition] = useTransition()

    const handleConfirmOrder = () => {
        if (isPending) return
        toast.loading("Confirming order, please wait...")
        startTransition(async () => {
            try {
                const { error, message } = await confirmOrderAction({
                    orderId: order.id.toString()
                })

                if (error) {
                    throw new Error(message)
                }
                toast.dismiss()
                toast.success("Order confirmed successfully! The customer has been notified.")
            } catch (error) {
                toast.dismiss()
                toast.error(error instanceof Error ? error.message : "Failed to confirm order")
            }
        })
    }


    return (
        <div className="flex justify-center w-full lg:w-fit">
            {canUpdateOrders ? (
                <Button
                    onClick={handleConfirmOrder}
                    disabled={isPending || isOrderReady || isOrderCompleted}
                    size={size || "default"}
                    className="min-w-[200px] w-full"
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
    )
}
export default ConfirmOrderButton