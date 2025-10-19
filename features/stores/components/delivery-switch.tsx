"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type DeliverySwitchProps = {
    defaultValue?: boolean
    onDeliveryChange?: (enabled: boolean) => void
}

function DeliverySwitch({ defaultValue = false, onDeliveryChange }: DeliverySwitchProps) {
    const [offersDelivery, setOffersDelivery] = useState(defaultValue)
    const { setValue } = useFormContext()
    const t = useTranslations("store.edit-operational-settings")

    useEffect(() => {
        // Set initial value in form context
        setValue("offers_delivery", offersDelivery)
    }, [setValue, offersDelivery])

    const handleChange = (checked: boolean) => {
        setOffersDelivery(checked)
        setValue("offers_delivery", checked)
        onDeliveryChange?.(checked)
    }

    return (
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
                onCheckedChange={handleChange}
            />
        </div>
    )
}

export { DeliverySwitch }