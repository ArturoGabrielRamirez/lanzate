"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { formatErrorResponse } from "@/utils/lib"
import { Edit } from "lucide-react"
import { Order, OrderStatus } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { Label } from "@/features/shadcn/components/ui/label"
import { Checkbox } from "@/features/shadcn/components/ui/checkbox"
import { useState } from "react"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { cn } from "@/lib/utils"
import { changeOrderStatusAction } from "../actions/change-order-status.action"
import { useTranslations } from "next-intl"

type Props = {
    order: Order
    slug: string
    userId?: number
    onComplete?: () => void
}

function ChangeOrderStatusButton({ order, slug, onComplete }: Props) {

    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status)
    const [confirmPayment, setConfirmPayment] = useState(false)
    const [confirmStockRestore, setConfirmStockRestore] = useState(false)
    const t = useTranslations("store.change-order-status")

    const statusOptions = [
        { value: 'PENDING' as OrderStatus, label: t("../orders-table.statuses.pending"), color: 'border-yellow-500 text-yellow-500' },
        { value: 'PROCESSING' as OrderStatus, label: t("../orders-table.statuses.processing"), color: 'border-orange-500 text-orange-500' },
        { value: 'READY' as OrderStatus, label: t("../orders-table.statuses.ready"), color: 'border-blue-500 text-blue-500' },
        { value: 'SHIPPED' as OrderStatus, label: t("../orders-table.statuses.shipped"), color: 'border-violet-500 text-violet-500' },
        { value: 'DELIVERED' as OrderStatus, label: t("../orders-table.statuses.delivered"), color: 'border-green-500 text-green-500' },
        { value: 'CANCELLED' as OrderStatus, label: t("../orders-table.statuses.cancelled"), color: 'border-red-500 text-red-500' }
    ]

    const selectedStatusInfo = statusOptions.find(s => s.value === selectedStatus)

    const showPaymentConfirmation = selectedStatus !== 'PENDING' && selectedStatus !== 'CANCELLED' && order.status === 'PENDING'
    const showStockRestoreConfirmation = selectedStatus === 'CANCELLED' && order.status !== 'CANCELLED'

    const isFormValid = () => {
        if (selectedStatus === order.status) return false
        if (showPaymentConfirmation && !confirmPayment) return false
        if (showStockRestoreConfirmation && !confirmStockRestore) return false
        return true
    }

    const handleChangeStatus = async () => {
        if (!isFormValid()) {
            return formatErrorResponse(t("messages.confirm-required"), null, null)
        }

        const data = {
            newStatus: selectedStatus,
            confirmPayment: showPaymentConfirmation ? confirmPayment : false,
            confirmStockRestore: showStockRestoreConfirmation ? confirmStockRestore : false
        }

        return changeOrderStatusAction(order.id, data, slug)
    }

    const getStatusChangeDescription = () => {
        if (selectedStatus === 'CANCELLED' && order.status !== 'CANCELLED') {
            return t("descriptions.cancel")
        }
        if (selectedStatus !== 'PENDING' && order.status === 'PENDING') {
            return t("descriptions.from-pending")
        }
        return t("descriptions.default")
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Edit className="text-muted-foreground size-4" />
                    {t("button")}
                </>
            )}
            title={t("title")}
            description={getStatusChangeDescription()}
            action={handleChangeStatus}
            onComplete={onComplete}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className="bg-transparent w-full justify-start"
            formDisabled={!isFormValid()}
        >
            <div className="space-y-4">

                {/* Current Status */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <h4 className="font-medium text-sm mb-2">{t("current-order-status")}</h4>
                    <Badge
                        className={cn(
                            "bg-transparent",
                            order.status === "PENDING" && "border-yellow-500 text-yellow-500",
                            order.status === "PROCESSING" && "border-orange-500 text-orange-500",
                            order.status === "READY" && "border-blue-500 text-blue-500",
                            order.status === "SHIPPED" && "border-violet-500 text-violet-500",
                            order.status === "DELIVERED" && "border-green-500 text-green-500",
                            order.status === "CANCELLED" && "border-red-500 text-red-500",
                        )}
                    >
                        {statusOptions.find(s => s.value === order.status)?.label || order.status}
                    </Badge>
                </div>

                {/* Status Selection */}
                <div className="space-y-2">
                    <Label htmlFor="status">{t("new-status")}</Label>
                    <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("status-placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn("bg-transparent text-xs", status.color)}>
                                            {status.label}
                                        </Badge>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Preview of selected status */}
                {selectedStatusInfo && selectedStatus !== order.status && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <h4 className="font-medium text-sm mb-2">{t("new-status-preview")}</h4>
                        <Badge className={cn("bg-transparent", selectedStatusInfo.color)}>
                            {selectedStatusInfo.label}
                        </Badge>
                    </div>
                )}

                {/* Payment Confirmation */}
                {showPaymentConfirmation && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                        <div className="space-y-3">
                            <p className="text-sm font-medium">
                                {t("payment-marked-paid")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t("payment-explanation", { status: selectedStatus })}
                            </p>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="confirm_payment"
                                    checked={confirmPayment}
                                    onCheckedChange={(checked) => setConfirmPayment(checked === true)}
                                />
                                <Label
                                    htmlFor="confirm_payment"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t("confirm-payment")}
                                </Label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stock Restore Confirmation */}
                {showStockRestoreConfirmation && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="space-y-3">
                            <p className="text-sm font-medium">
                                {t("stock-restore-warning")}
                            </p>
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p>{t("cancellation-consequences")}</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>{t("restore-stock")}</li>
                                    <li>{t("reverse-balance")}</li>
                                    <li>{t("create-refund")}</li>
                                    <li>{t("log-action")}</li>
                                </ul>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="confirm_stock_restore"
                                    checked={confirmStockRestore}
                                    onCheckedChange={(checked) => setConfirmStockRestore(checked === true)}
                                />
                                <Label
                                    htmlFor="confirm_stock_restore"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t("understand-consequences")}
                                </Label>
                            </div>
                        </div>
                    </div>
                )}

                {/* No changes warning */}
                {selectedStatus === order.status && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <p className="text-sm text-muted-foreground">
                            {t("no-changes-warning")}
                        </p>
                    </div>
                )}

            </div>
        </ButtonWithPopup>
    )
}

export default ChangeOrderStatusButton 