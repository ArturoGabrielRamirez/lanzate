"use client"

import { Button } from "@/components/ui/button"
import { changeOrderTrackingStatus } from "@/features/orders/actions/changeOrderTrackingStatus"
import { Order, OrderTrackingStatus, OrderTracking, OrderItem, Product, OrderPayment } from "@prisma/client"
import { Truck, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment }
}

const PickedUpOrderButton = ({ order }: Props) => {

    const [isPending, startTransition] = useTransition()

    const handleMarkAsPickedUp = () => {

        if (isPending) return

        toast.loading("Marking order as picked up, please wait...")

        startTransition(async () => {
            try {
                const newStatus = {
                    newStatus: "ON_THE_WAY" as OrderTrackingStatus,
                }

                await changeOrderTrackingStatus({ orderId: order.id, newStatus })

                toast.dismiss()
                toast.success("Order marked as picked up", { richColors: true })

            } catch (error) {
                toast.dismiss()
                toast.error(error instanceof Error ? error.message : "Failed to mark order as picked up", { richColors: true })
            }
        })


    }

    return (
        <div>
            <Button onClick={handleMarkAsPickedUp} disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Truck className="size-4" />}
                Order picked up by delivery driver
            </Button>
        </div>
    )
}

export default PickedUpOrderButton
