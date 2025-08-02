"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { Trash2 } from "lucide-react"
import { Order } from "@prisma/client"
import { changeOrderStatus } from "../actions/changeOrderStatus"
import { useTranslations } from "next-intl"

type Props = {
    order: Order
    slug: string
    userId: number
    onComplete?: () => void
}

function CancelOrderButton({ order, slug, userId, onComplete }: Props) {
    
    const t = useTranslations("store.cancel-order")
    
    const handleCancelOrder = async () => {
        const data = {
            newStatus: "CANCELLED",
            confirmPayment: false,
            confirmStockRestore: true // Auto-confirm for direct cancellation
        }

        return changeOrderStatus(order.id, data, slug, userId)
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
                    <Trash2 className="text-muted-foreground size-4" />
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
            className="bg-transparent w-full justify-start text-red-600 hover:text-red-700"
        />
    )
}
export default CancelOrderButton 