"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { Loader2, Trash2 } from "lucide-react"
import { Order } from "@prisma/client"
import { changeOrderStatus } from "../actions/changeOrderStatus"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTransition } from "react"
import { toast } from "sonner"

type Props = {
    order: Order
    slug: string
    userId?: number
    onComplete?: () => void
    className?: string
    size?: "default" | "sm" | "lg",
    onlyIcon?: boolean
}

function CancelOrderButton({ order, slug, onComplete, className, size = "default", onlyIcon = false }: Props) {

    const t = useTranslations("store.cancel-order")
    const [isPending, startTransition] = useTransition()

    const handleCancelOrder = async () => {

        if (isPending) return

        toast.loading("Cancelling order, please wait...", { richColors: true })

        startTransition(async () => {
            try {
                const { error, message } = await changeOrderStatus(order.id, {
                    newStatus: "CANCELLED",
                    confirmPayment: false,
                    confirmStockRestore: true // Auto-confirm for direct cancellation
                }, slug)

                if (error) {
                    throw new Error(message)
                }

                toast.dismiss()
                toast.success("Order cancelled successfully", { richColors: true })
            } catch (error) {
                toast.dismiss()
                toast.error(error instanceof Error ? error.message : "Failed to cancel order", { richColors: true })
            }
        })

        onComplete?.()
    }


    const isOrderCancellable = order.status !== 'DELIVERED' && order.status !== 'CANCELLED'

    if (!isOrderCancellable) {
        return (
            <div className="flex items-center gap-2 w-full p-2 text-muted-foreground text-sm cursor-not-allowed">
                <Trash2 className="w-4 h-4" />
                {t("cannot-cancel")}
            </div>
        )
    }

    return (
        <ButtonWithPopup
            onlyIcon={onlyIcon}
            text={(
                <>
                    {onlyIcon ? <Trash2 className="size-4 text-current" /> : t("button")}
                </>
            )}
            title={t("title")}
            description={t("description")}
            action={handleCancelOrder}
            onComplete={onComplete}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            //className={cn("bg-transparent w-full justify-start text-red-600 hover:text-red-700", className)}
            className={cn(className)}
            size={size}
        />
    )
}
export default CancelOrderButton 