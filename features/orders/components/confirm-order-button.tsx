"use client"

import { AlertTriangle, CheckCircle } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { confirmOrderAction } from "@/features/orders/actions/confirm-order.action"
import { ConfirmOrderButtonProps } from "@/features/orders/types"
import { AlertDescription } from "@/features/shadcn/components/ui/alert"
import { Alert } from "@/features/shadcn/components/ui/alert"
import { Button } from "@/features/shadcn/components/ui/button"

function ConfirmOrderButton({ order, canUpdateOrders, size = "default" }: ConfirmOrderButtonProps) {

    const isOrderReady = order.status === "READY"
    const isOrderCompleted = order.status === "COMPLETED"
    const [isPending, startTransition] = useTransition()

    const handleConfirmOrder = () => {
        if (isPending) return
        toast.loading("Confirming order, please wait...")
        startTransition(async () => {
            try {
                const { hasError, message } = await confirmOrderAction({
                    orderId: order.id.toString()
                })

                if (hasError) {
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

export { ConfirmOrderButton }