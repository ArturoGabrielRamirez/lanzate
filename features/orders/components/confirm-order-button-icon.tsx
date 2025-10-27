"use client"

import { CheckCircle, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { confirmOrderAction } from "@/features/orders/actions/confirm-order.action"
import { ConfirmOrderButtonIconProps } from "@/features/orders/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"

function ConfirmOrderButtonIcon({ orderId }: ConfirmOrderButtonIconProps) {
    const [isPending, startTransition] = useTransition()

    const handleConfirmOrder = () => {
        if (isPending) return
        toast.loading("Confirming order, please wait...", { richColors: true })
        startTransition(async () => {
            try {
                const { hasError, message } = await confirmOrderAction({
                    orderId: orderId.toString()
                })

                if (hasError) {
                    throw new Error(message)
                }
                toast.dismiss()
                toast.success("Order confirmed successfully! The customer has been notified.", { richColors: true })
            } catch (error) {
                toast.dismiss()
                toast.error(error instanceof Error ? error.message : "Failed to confirm order", { richColors: true })
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
                {isPending ? "Confirming order..." : "Confirm order"}
            </TooltipContent>
        </Tooltip>
    )
}

export { ConfirmOrderButtonIcon }