"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { Trash2 } from "lucide-react"
import { Order } from "@prisma/client"
import { changeOrderStatus } from "../actions/changeOrderStatus"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

type Props = {
    order: Order
    slug: string
    userId?: number
    onComplete?: () => void
    className?: string
    size?: "default" | "sm" | "lg"
}

function CancelOrderButton({ order, slug, onComplete, className, size = "default" }: Props) {

    const t = useTranslations("store.cancel-order")

    const handleCancelOrder = async () => {
        const data = {
            newStatus: "CANCELLED",
            confirmPayment: false,
            confirmStockRestore: true // Auto-confirm for direct cancellation
        }

        return changeOrderStatus(order.id, data, slug)
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
            text={(
                <>
                    <Trash2 className="size-4 text-current" />
                    {t("button")}
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