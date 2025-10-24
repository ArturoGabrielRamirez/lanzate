import { Order, OrderTracking } from "@prisma/client"
import { CheckCircle, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { finalizeOrderAction } from "@/features/orders/actions/finalize-order.action"
import { Button } from "@/features/shadcn/components/ui/button"

type Props = {
    order: Order & { tracking: OrderTracking | null }
}

function FinalizeOrderButton({ order }: Props) {

    const [isFinalizing, startFinalizeTransition] = useTransition()

    const handleFinalize = () => {

        const isPickup = order.shipping_method === "DELIVERY"

        if (isFinalizing) return

        toast.loading("Finalizing order...")

        startFinalizeTransition(async () => {
            try {
                const { hasError, message } = await finalizeOrderAction({
                    orderId: order.id.toString(),
                    shippingMethod: order.shipping_method
                })

                if (hasError) {
                    throw new Error(message)
                }
                toast.dismiss()
                toast.success(`Order successfully finalized! The order has been marked as ${isPickup ? "picked up" : "delivered"}.`)
            } catch (error) {
                console.error("Error finalizing order:", error)
                toast.dismiss()
                toast.error("Failed to finalize order")
            }
        })
    }

    return (
        <Button onClick={handleFinalize} disabled={isFinalizing}>
            {isFinalizing ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
            {isFinalizing ? "Finalizing..." : "Finalize Order"}
        </Button>
    )
}

export { FinalizeOrderButton }