"use client"

import { CheckCircle, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { finalizeOrderAction } from "@/features/orders/actions/finalize-order.action"
import { FinalizeOrderButtonProps } from "@/features/orders/types"
import { Button } from "@/features/shadcn/components/ui/button"

function FinalizeOrderButton({ order }: FinalizeOrderButtonProps) {

    const [isFinalizing, startFinalizeTransition] = useTransition()

    const handleFinalize = () => {

        const isPickup = order.shipping_method === "DELIVERY"

        if (isFinalizing) return

        toast.loading("Finalizando orden...")

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
                toast.success(`¡Orden finalizada con éxito! La orden fue marcada como ${isPickup ? "recogida" : "entregada"}.`)
            } catch (error) {
                console.error("Error finalizing order:", error)
                toast.dismiss()
                toast.error("Error al finalizar la orden")
            }
        })
    }

    return (
        <Button onClick={handleFinalize} disabled={isFinalizing}>
            {isFinalizing ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
            {isFinalizing ? "Finalizando..." : "Finalizar Orden"}
        </Button>
    )
}

export { FinalizeOrderButton }