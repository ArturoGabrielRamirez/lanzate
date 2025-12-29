"use client"

import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { ButtonWithPopup } from "@/features/global/components/button-with-popup"
import { changeOrderStatusAction } from "@/features/orders/actions/change-order-status.action"
import { CancelOrderButtonProps } from "@/features/orders/types"
import { cn } from "@/lib/utils"


function CancelOrderButton({ order, slug, onComplete, className, size = "default", onlyIcon = false }: CancelOrderButtonProps) {
    const t = useTranslations("store.cancel-order")

    const handleCancelOrder = async () => {
        try {
            const { hasError, message } = await changeOrderStatusAction(order.id, {
                newStatus: "CANCELLED",
                confirmPayment: false,
                confirmStockRestore: true
            }, slug)

            if (hasError) {
                return {
                    hasError: true,
                    message: message,
                    payload: null
                }
            }

            onComplete?.()

            return {
                hasError: false,
                message: "Orden cancelada con éxito",
                payload: null
            }
        } catch (error) {
            return {
                hasError: true,
                message: error instanceof Error ? error.message : "Error al cancelar la orden",
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