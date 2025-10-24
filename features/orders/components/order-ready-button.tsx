import { Order, OrderTrackingStatus, OrderTracking, OrderItem, Product, OrderPayment } from "@prisma/client"
import { CheckCircle, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { changeOrderTrackingStatusAction } from "@/features/orders/actions/change-order-tracking-status.action"
import { Button } from "@/features/shadcn/components/ui/button"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment }
}

function OrderReadyButton({ order }: Props) {

    const [isPending, startTransition] = useTransition()

    const handleMarkAsReady = () => {

        if (isPending) return

        toast.loading("Marking order as ready, please wait...")

        startTransition(async () => {
            try {
                const newStatus = {
                    newStatus: (order.shipping_method === "DELIVERY" ? "WAITING_FOR_DELIVERY" : "WAITING_FOR_PICKUP") as OrderTrackingStatus,
                }

                await changeOrderTrackingStatusAction({ orderId: order.id, newStatus })

                toast.dismiss()
                toast.success("Order marked as ready", { richColors: true })

            } catch (error) {
                toast.dismiss()
                toast.error(error instanceof Error ? error.message : "Failed to mark order as ready", { richColors: true })
            }
        })


    }

    return (
        <div>
            <Button onClick={handleMarkAsReady} disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                {order.shipping_method === "PICKUP" && "Ready for pickup"}
                {order.shipping_method === "DELIVERY" && "Ready and waiting delivery"}
            </Button>
        </div>
    )
}
export { OrderReadyButton }