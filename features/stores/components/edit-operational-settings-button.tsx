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
import { PaymentMethod, Store, StoreOperationalSettings } from "@prisma/client"
import { DeliverySwitch } from "./delivery-switch"
import { PaymentMethodsSwitches } from "./payment-methods-switches"

type EditOperationalSettingsButtonProps = {
    storeId: number
    store: Store & {
        operational_settings?: StoreOperationalSettings | null
    }
}

type OperationalSettingsFormPayload = {
    offers_delivery: boolean
    delivery_price?: string
    free_delivery_minimum?: string
    delivery_radius_km?: string
    minimum_order_amount: string
    payment_methods: PaymentMethod[]
}


function EditOperationalSettingsButton({ storeId, store }: EditOperationalSettingsButtonProps) {
    const operationalSettings = store.operational_settings

    const [offersDelivery, setOffersDelivery] = useState(operationalSettings?.offers_delivery || false)

    const t = useTranslations("store.edit-operational-settings")

    const handleEditOperationalSettings = async (payload: OperationalSettingsFormPayload) => {
        try {
            const data = {
                offers_delivery: payload.offers_delivery,
                delivery_price: payload.delivery_price ? parseFloat(payload.delivery_price) : 0,
                free_delivery_minimum: payload.free_delivery_minimum ? parseFloat(payload.free_delivery_minimum) : null,
                delivery_radius_km: payload.delivery_radius_km ? parseFloat(payload.delivery_radius_km) : 5,
                minimum_order_amount: parseFloat(payload.minimum_order_amount),
                payment_methods: payload.payment_methods
            }


            return await updateOperationalSettingsAction(storeId, data)
        } catch (error) {
            return formatErrorResponse("Error updating operational settings", error, null)
        }
    }

    const handleDeliveryChange = (enabled: boolean) => {
        setOffersDelivery(enabled)
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
                        <DeliverySwitch
                            defaultValue={operationalSettings?.offers_delivery || false}
                            onDeliveryChange={handleDeliveryChange}
                        />

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
                            defaultValue={operationalSettings?.free_delivery_minimum?.toString() || "0"}
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

                        <PaymentMethodsSwitches
                            defaultMethods={operationalSettings?.payment_methods || [PaymentMethod.CASH]}
                            onPaymentMethodsChange={() => { }}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ButtonWithPopup>
    )
}

export default EditOperationalSettingsButton 