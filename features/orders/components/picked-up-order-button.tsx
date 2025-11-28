"use client"

import { OrderTrackingStatus } from "@prisma/client"
import { Truck, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { changeOrderTrackingStatusAction } from "@/features/orders/actions/change-order-tracking-status.action"
import { PickedUpOrderButtonProps } from "@/features/orders/types"
import { Button } from "@/features/shadcn/components/ui/button"

function PickedUpOrderButton({ order }: PickedUpOrderButtonProps) {

    const [isPending, startTransition] = useTransition()

    const handleMarkAsPickedUp = () => {

        if (isPending) return

        toast.loading("Marcando el pedido como retirado, por favor esperá...")

        startTransition(async () => {
            try {
                const newStatus = {
                    newStatus: "ON_THE_WAY" as OrderTrackingStatus,
                }

                await changeOrderTrackingStatusAction({ orderId: order.id, newStatus })

                toast.dismiss()
                toast.success("Pedido marcado como retirado", { richColors: true })

            } catch (error) {
                toast.dismiss()
                toast.error(error instanceof Error ? error.message : "Error al marcar el pedido como retirado", { richColors: true })
            }
        })


    }

    return (
        <div>
            <Button onClick={handleMarkAsPickedUp} disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Truck className="size-4" />}
                Pedido retirado por el repartidor
            </Button>
        </div>
    )
}

export { PickedUpOrderButton }
