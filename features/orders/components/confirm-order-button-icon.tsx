"use client"

import { CheckCircle, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { confirmOrderAction } from "@/features/orders/actions/confirm-order.action"
import { ConfirmOrderButtonIconProps } from "@/features/orders/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"

function ConfirmOrderButtonIcon({ orderId }: ConfirmOrderButtonIconProps) {
    const [isPending, startTransition] = useTransition()

    const handleConfirmOrder = () => {
        if (isPending) return
        toast.loading("Confirmando la orden, por favor espera...", { richColors: true })
        startTransition(async () => {
            try {
                const { hasError, message } = await confirmOrderAction({
                    orderId: orderId.toString()
                })

                if (hasError) {
                    throw new Error(message)
                }
                toast.dismiss()
                toast.success("Orden confirmada con éxito! El cliente ha sido notificado.", { richColors: true })
            } catch (error) {
                toast.dismiss()
                toast.error(error instanceof Error ? error.message : "Error al confirmar la orden", { richColors: true })
            }
        })
    }

    return (
        <Tooltip>
            <TooltipTrigger>
                <IconButton
                    icon={isPending ? Loader2 : CheckCircle}
                    onClick={handleConfirmOrder}
                    disabled={isPending}
                    className={cn("text-green-500 hover:text-green-600", isPending && "animate-spin")}
                />
            </TooltipTrigger>
            <TooltipContent>
                {isPending ? "Confirmando la orden..." : "Confirmar orden"}
            </TooltipContent>
        </Tooltip>
    )
}

export { ConfirmOrderButtonIcon }