"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { /* Loader2, */ Trash2 } from "lucide-react"
import { Order } from "@prisma/client"
import { changeOrderStatusAction } from "../actions/change-order-status.action"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { ResponseType } from "@/features/layout/types"
/* import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTransition } from "react"
import { toast } from "sonner" */


type Props = {
    order: Order
    slug: string
    userId?: number
    onComplete?: () => void
    className?: string
    size?: "default" | "sm" | "lg"
    onlyIcon?: boolean
}

function CancelOrderButton({ order, slug, onComplete, className, size = "default", onlyIcon = false }: Props) {
    const t = useTranslations("store.cancel-order")

    const handleCancelOrder = async (): Promise<ResponseType<unknown>> => {
        try {
            const { error, message } = await changeOrderStatusAction(order.id, {
                newStatus: "CANCELLED",
                confirmPayment: false,
                confirmStockRestore: true
            }, slug)

            if (error) {
                return {
                    error: true,
                    message: message,
                    payload: null
                }
            }

            onComplete?.()
            
            return {
                error: false,
                message: "Order cancelled successfully",
                payload: null
            }
        } catch (error) {
            return {
                error: true,
                message: error instanceof Error ? error.message : "Failed to cancel order",
                payload: null
            }
        }
    }

    const isOrderCancellable = order.status !== 'DELIVERED' && order.status !== 'CANCELLED'

    return (
        <ButtonWithPopup
            onlyIcon={onlyIcon}
            disabled={!isOrderCancellable}
            text={(
                <>
                    {onlyIcon ? <Trash2 className="size-4 text-current" /> : t("button")}
                </>
            )}
            title={isOrderCancellable ? t("title") : t("cannot-cancel")}
            description={isOrderCancellable ? t("description") : ""}
            action={handleCancelOrder}
            onComplete={onComplete}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className={cn(className)}
            size={size}
        />
    )
}

export default CancelOrderButton