import { TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { Check, DollarSign, Trash } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslations } from "next-intl"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button"
import AnimatedTags from "@/features/shadcn/components/smoothui/ui/AnimatedTags"
import { CreateStoreFormValues, ShippingMethod, ShippingMethodFormPanelProps } from "@/features/stores/types"

export function ShippingMethodFormPanel({ method, index, onCancel, onSave }: ShippingMethodFormPanelProps) {
    const t = useTranslations("store.create-form.shipping")

    const initialTags = [
        t("providers-options.own-delivery"),
        t("providers-options.oca"),
        t("providers-options.correo-argentino"),
        t("providers-options.others"),
    ]

    const { setValue, getValues, formState: { errors } } = useFormContext<CreateStoreFormValues>()
    const setValueAny = setValue as unknown as (name: string, value: unknown, options?: { shouldValidate?: boolean; shouldDirty?: boolean }) => void
    const [selectedProviders, setSelectedProviders] = useState<string[]>(() => (method.providers || (getValues(`shipping_info.methods.${index}.providers`) as string[]) || []))
    const [minPurchase, setMinPurchase] = useState<string>(() => (method.minPurchase || (getValues(`shipping_info.methods.${index}.minPurchase`) as string) || ""))
    const [freeShippingMin, setFreeShippingMin] = useState<string>(() => (method.freeShippingMin || (getValues(`shipping_info.methods.${index}.freeShippingMin`) as string) || ""))
    const [estimatedTime, setEstimatedTime] = useState<string>(() => (method.estimatedTime || (getValues(`shipping_info.methods.${index}.estimatedTime`) as string) || ""))
    const [deliveryPrice, setDeliveryPrice] = useState<string>(() => (method.deliveryPrice || (getValues(`shipping_info.methods.${index}.deliveryPrice`) as string) || ""))

    const formBase = `shipping_info.methods.${index}`

    const handleCancel = () => {
        if (onCancel) onCancel(index)
    }

    const handleSave = () => {
        const payload: ShippingMethod = {
            providers: selectedProviders,
            minPurchase,
            freeShippingMin,
            estimatedTime,
            deliveryPrice,
        }
        if (onSave) onSave(index, payload)
    }

    const handleProvidersChange = (tags: string[]) => {
        setSelectedProviders(tags)
        setValueAny(`${formBase}.providers`, tags, { shouldValidate: true, shouldDirty: true })
    }

    const handleETAChange = (value: Dayjs | null) => {
        const formatted = value ? dayjs(value).format("HH:mm") : ""
        setEstimatedTime(formatted)
        setValueAny(`${formBase}.estimatedTime`, formatted, { shouldValidate: true, shouldDirty: true })
    }

    return (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >

            <div className="flex flex-col gap-4">
                <InputField
                    label={t("delivery-price")}
                    name={`${formBase}.deliveryPrice`}
                    inputMode="numeric"
                    type="number"
                    placeholder={t("delivery-price-placeholder")}
                    defaultValue={deliveryPrice}
                    isRequired
                    onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "")
                        setDeliveryPrice(v)
                        setValueAny(`${formBase}.deliveryPrice`, v, { shouldValidate: true, shouldDirty: true })
                    }}
                />
                <InputField
                    label={t("min-purchase")}
                    name={`${formBase}.minPurchase`}
                    inputMode="numeric"
                    type="number"
                    placeholder={t("min-purchase-placeholder")}
                    defaultValue={minPurchase}
                    startIcon={<DollarSign />}
                    tooltip={t("min-purchase-tooltip")}
                    onChange={(e) => setMinPurchase(e.target.value.replace(/[^0-9]/g, ""))}
                />

                <InputField
                    label={t("free-shipping-min")}
                    name={`${formBase}.freeShippingMin`}
                    inputMode="numeric"
                    type="number"
                    placeholder={t("free-shipping-min-placeholder")}
                    defaultValue={freeShippingMin}
                    onChange={(e) => setFreeShippingMin(e.target.value.replace(/[^0-9]/g, ""))}
                />

            </div>

            <div className="space-y-5">
                <div>
                    <AnimatedTags
                        title={t("providers")}
                        initialTags={initialTags}
                        selectedTags={selectedProviders}
                        onChange={handleProvidersChange}
                    />
                    {errors.shipping_info?.methods?.[index]?.providers && (
                        <p className="text-sm text-red-500">{t("providers-error")}</p>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium">{t("estimated-time")}</p>
                    <TimePicker
                        format="HH:mm"
                        hourStep={1}
                        minuteStep={15}
                        variant="outlined"
                        size="large"
                        className="!bg-transparent !text-primary-foreground !border-muted-foreground/50 w-full"
                        placeholder={t("estimated-time-placeholder")}
                        value={estimatedTime ? dayjs(estimatedTime, "HH:mm") : null}
                        onChange={handleETAChange}
                    />
                </div>
                <div className="flex gap-2">
                    <Button className="grow" type="button" onClick={handleCancel}>
                        <Trash />
                        {t("cancel")}
                    </Button>
                    <Button className="grow" type="button" onClick={handleSave}>
                        <Check />
                        {t("save")}
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
