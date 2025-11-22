"use client"

import { OrderTrackingStatus } from "@prisma/client"
import { CheckCircle, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { changeOrderTrackingStatusAction } from "@/features/orders/actions/change-order-tracking-status.action"
import { OrderReadyButtonProps } from "@/features/orders/types"
import { Button } from "@/features/shadcn/components/ui/button"

function OrderReadyButton({ order }: OrderReadyButtonProps) {

    const [isPending, startTransition] = useTransition()

    const handleMarkAsReady = () => {

        if (isPending) return

        toast.loading("Marcando el pedido como listo, por favor esperá...")

        startTransition(async () => {
            try {
                const newStatus = {
                    newStatus: (order.shipping_method === "DELIVERY" ? "WAITING_FOR_DELIVERY" : "WAITING_FOR_PICKUP") as OrderTrackingStatus,
                }

                await changeOrderTrackingStatusAction({ orderId: order.id, newStatus })

                toast.dismiss()
                toast.success("Pedido marcado como listo", { richColors: true })

            } catch (error) {
                toast.dismiss()
                toast.error(error instanceof Error ? error.message : "Error al marcar el pedido como listo", { richColors: true })
            }
        })


    }

    return (
        <div>
            <Button onClick={handleMarkAsReady} disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                {order.shipping_method === "PICKUP" && "Listo para recoger"}
                {order.shipping_method === "DELIVERY" && "Listo y esperando entrega"}
            </Button>
        </div>
    )
}
export { OrderReadyButton }