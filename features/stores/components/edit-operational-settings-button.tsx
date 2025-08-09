"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { updateOperationalSettingsAction } from "../actions/updateOperationalSettings"
import { operationalSettingsSchema } from "../schemas/operational-settings-schema"
import { formatErrorResponse } from "@/utils/lib"
import { Settings, Truck, DollarSign } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PaymentMethod, Store, StoreOperationalSettings } from "@prisma/client"

type EditOperationalSettingsButtonProps = {
    storeId: number
    store: Store & {
        operational_settings?: StoreOperationalSettings | null
    }
}

type OperationalSettingsFormPayload = {
    delivery_price?: string
    free_delivery_minimum?: string
    delivery_radius_km?: string
    minimum_order_amount: string
}

function EditOperationalSettingsButton({ storeId, store }: EditOperationalSettingsButtonProps) {
    const operationalSettings = store.operational_settings
    
    const [offersDelivery, setOffersDelivery] = useState(operationalSettings?.offers_delivery || false)
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>(
        operationalSettings?.payment_methods || [PaymentMethod.CASH]
    )
    
    const t = useTranslations("store.edit-operational-settings")

    const handleEditOperationalSettings = async (payload: OperationalSettingsFormPayload) => {
        try {
            const data = {
                offers_delivery: offersDelivery,
                delivery_price: offersDelivery ? (parseFloat(payload.delivery_price || "0") || 0) : 0,
                free_delivery_minimum: offersDelivery ? (payload.free_delivery_minimum ? parseFloat(payload.free_delivery_minimum) : null) : null,
                delivery_radius_km: offersDelivery ? (parseFloat(payload.delivery_radius_km || "5") || 5) : 5,
                payment_methods: selectedPaymentMethods,
                minimum_order_amount: parseFloat(payload.minimum_order_amount) || 0
            }

            return await updateOperationalSettingsAction(storeId, data)
        } catch (error) {
            return formatErrorResponse("Error updating operational settings", error, null)
        }
    }

    const handlePaymentMethodChange = (method: PaymentMethod, checked: boolean) => {
        if (checked) {
            setSelectedPaymentMethods(prev => [...prev, method])
        } else {
            setSelectedPaymentMethods(prev => prev.filter(m => m !== method))
        }
    }

    const paymentMethodLabels: Record<PaymentMethod, string> = {
        CASH: 'Efectivo',
        CREDIT_CARD: 'Tarjeta de Crédito',
        DEBIT_CARD: 'Tarjeta de Débito',
        TRANSFER: 'Transferencia',
        MERCADO_PAGO: 'Mercado Pago',
        PAYPAL: 'PayPal',
        CRYPTO: 'Criptomonedas'
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Settings className="size-4" />
                    {t("button")}
                </>
            )}
            title={t("title")}
            schema={operationalSettingsSchema}
            description={t("description")}
            action={handleEditOperationalSettings}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
        >
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTriggerWithValidation keys={["delivery_price", "delivery_radius_km", "free_delivery_minimum"]}>
                        <span className="flex items-center gap-2">
                            <Truck className="size-4" />
                            {t("delivery-section")}
                        </span>
                    </AccordionTriggerWithValidation>
                    <AccordionContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="offers-delivery">{t("offers-delivery")}</Label>
                                <p className="text-xs text-muted-foreground">
                                    {t("offers-delivery-description")}
                                </p>
                            </div>
                            <Switch
                                id="offers-delivery"
                                checked={offersDelivery}
                                onCheckedChange={setOffersDelivery}
                            />
                        </div>
                        
                        <InputField
                            name="delivery_price"
                            label={t("delivery-price")}
                            type="number"
                            defaultValue={operationalSettings?.delivery_price?.toString() || "0"}
                            disabled={!offersDelivery}
                        />
                        
                        <InputField
                            name="free_delivery_minimum"
                            label={t("free-delivery-minimum")}
                            type="number"
                            defaultValue={operationalSettings?.free_delivery_minimum?.toString() || ""}
                            placeholder={t("free-delivery-minimum-placeholder")}
                            disabled={!offersDelivery}
                        />
                        
                        <InputField
                            name="delivery_radius_km"
                            label={t("delivery-radius")}
                            type="number"
                            defaultValue={operationalSettings?.delivery_radius_km?.toString() || "5"}
                            disabled={!offersDelivery}
                        />
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                    <AccordionTriggerWithValidation keys={["minimum_order_amount"]}>
                        <span className="flex items-center gap-2">
                            <DollarSign className="size-4" />
                            {t("payment-section")}
                        </span>
                    </AccordionTriggerWithValidation>
                    <AccordionContent className="space-y-4">
                        <InputField
                            name="minimum_order_amount"
                            label={t("minimum-order-amount")}
                            type="number"
                            defaultValue={operationalSettings?.minimum_order_amount?.toString() || "0"}
                        />
                        
                        <div className="space-y-3">
                            <Label>{t("payment-methods")}</Label>
                            <div className="space-y-2">
                                {Object.values(PaymentMethod).map((method) => (
                                    <div key={method} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={method}
                                            checked={selectedPaymentMethods.includes(method)}
                                            onCheckedChange={(checked) => handlePaymentMethodChange(method, checked as boolean)}
                                        />
                                        <label
                                            htmlFor={method}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {paymentMethodLabels[method]}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ButtonWithPopup>
    )
}

export default EditOperationalSettingsButton 