"use client"

import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { ButtonWithPopup } from "@/features/layout/components"
import { ResponseType } from "@/features/layout/types"
import { changeOrderStatusAction } from "@/features/orders/actions/change-order-status.action"
import { CancelOrderButtonProps } from "@/features/orders/types"
import { cn } from "@/lib/utils"


function CancelOrderButton({ order, slug, onComplete, className, size = "default", onlyIcon = false }: CancelOrderButtonProps) {
    const t = useTranslations("store.cancel-order")

    const handleCancelOrder = async (): Promise<ResponseType<unknown>> => {
        try {
            const { hasError, message } = await changeOrderStatusAction(order.id, {
                newStatus: "CANCELLED",
                confirmPayment: false,
                confirmStockRestore: true
            }, slug)

            if (hasError) {
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

export { CancelOrderButton }