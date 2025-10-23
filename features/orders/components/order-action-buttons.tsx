"use client"

import { Button } from "@/features/shadcn/components/ui/button"
import { Order, OrderTracking, OrderTrackingStatus } from "@prisma/client"
import { Clock, Package, CheckCircle2, Truck } from "lucide-react"
import { useTransition } from "react"
import { updateOrderTrackingAction } from "../actions/update-order-tracking.action"
import { toast } from "sonner"
import { finalizeOrderAction } from "../actions/finalize-order.action"

type Props = {
    order: Order & { tracking: OrderTracking | null }
}

const OrderActionButtons = ({ order }: Props) => {

    const [isPending, startTransition] = useTransition()
    const [isFinalizing, startFinalizeTransition] = useTransition()
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const currentTrackingStatus = order.tracking?.tracking_status

    const handleTrackingUpdate = (newStatus: OrderTrackingStatus) => {

        if (isPending) return

        toast.loading("Updating order tracking...")

        if (isCompleted) {
            toast.error("Order is already completed")
            return
        }

        startTransition(async () => {
            try {
                const { error, message } = await updateOrderTrackingAction({
                    orderId: order.id.toString(),
                    newTrackingStatus: newStatus
                })

                if (error) {
                    throw new Error(message)
                }
                toast.dismiss()
                toast.success("Order tracking updated successfully")
            } catch (error) {
                console.error("Error updating order tracking:", error)
                toast.dismiss()
                toast.error("Failed to update order tracking")
            }
        })
    }

    const handleFinalize = () => {

        if (isFinalizing) return

        toast.loading("Finalizing order...")

        startFinalizeTransition(async () => {
            try {
                const { error, message } = await finalizeOrderAction({
                    orderId: order.id.toString(),
                    shippingMethod: order.shipping_method
                })


                if (error) {
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
        <div className="mt-4 flex flex-col gap-2 w-full">
            {isPickup && (
                <>
                    {currentTrackingStatus === "PREPARING_ORDER" && (
                        <Button
                            onClick={() => handleTrackingUpdate("WAITING_FOR_PICKUP")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "Lista para retirar"}
                        </Button>
                    )}
                    {currentTrackingStatus === "WAITING_FOR_PICKUP" && (
                        <Button
                            onClick={() => handleTrackingUpdate("PREPARING_ORDER")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "Volver a Preparar"}
                        </Button>
                    )}

                </>
            )}
            {!isPickup && (
                <>
                    {currentTrackingStatus === "PREPARING_ORDER" && (
                        <Button
                            onClick={() => handleTrackingUpdate("WAITING_FOR_DELIVERY")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "Esperando Delivery"}
                        </Button>
                    )}
                    {currentTrackingStatus === "WAITING_FOR_DELIVERY" && (
                        <Button
                            onClick={() => handleTrackingUpdate("ON_THE_WAY")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Truck className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "En Camino"}
                        </Button>
                    )}
                    {currentTrackingStatus === "ON_THE_WAY" && (
                        <Button
                            onClick={() => handleTrackingUpdate("DELIVERED")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {isPending ? "Updating..." : "Entregado"}
                        </Button>
                    )}
                </>
            )}
            <Button
                onClick={handleFinalize}
                disabled={isFinalizing}
                className="w-full"
                variant="default"
            >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isFinalizing ? "Finalizing..." : "Finalizar"}
            </Button>
        </div>
    )
}
export default OrderActionButtons