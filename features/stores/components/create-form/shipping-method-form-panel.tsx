import { TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { Check, DollarSign, Trash } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button"
import AnimatedTags from "@/features/shadcn/components/smoothui/ui/AnimatedTags"
import { CreateStoreFormValues, ShippingMethod, ShippingMethodFormPanelProps } from "@/features/stores/types"

export function ShippingMethodFormPanel({ method, index, onCancel, onSave }: ShippingMethodFormPanelProps) {

    const initialTags = [
        "Delivery propio",
        "OCA",
        "Correo Argentino",
        "Otros",
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
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >

            <div className="space-y-4">
                <InputField
                    label="Precio envío"
                    name={`${formBase}.deliveryPrice`}
                    inputMode="numeric"
                    type="number"
                    placeholder="Ej: 1500"
                    defaultValue={deliveryPrice}
                    isRequired
                    onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "")
                        setDeliveryPrice(v)
                        setValueAny(`${formBase}.deliveryPrice`, v, { shouldValidate: true, shouldDirty: true })
                    }}
                />
                <InputField
                    label="Mín. $ envío"
                    name={`${formBase}.minPurchase`}
                    inputMode="numeric"
                    type="number"
                    placeholder="Ej: 10000"
                    defaultValue={minPurchase}
                    startIcon={<DollarSign />}
                    tooltip="El precio mínimo de una orden para que el cliente pueda realizar un pedido con envío"
                    onChange={(e) => setMinPurchase(e.target.value.replace(/[^0-9]/g, ""))}
                />

                <InputField
                    label="Mín. $ envío gratis"
                    name={`${formBase}.freeShippingMin`}
                    inputMode="numeric"
                    type="number"
                    placeholder="Ej: 20000"
                    defaultValue={freeShippingMin}
                    onChange={(e) => setFreeShippingMin(e.target.value.replace(/[^0-9]/g, ""))}
                />

            </div>

            <div className="space-y-5">
                <div>
                    <AnimatedTags
                        title="Proveedores"
                        initialTags={initialTags}
                        selectedTags={selectedProviders}
                        onChange={handleProvidersChange}
                    />
                    {errors.shipping_info?.methods?.[index]?.providers && (
                        <p className="text-sm text-red-500">Seleccioná al menos un proveedor</p>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium">Tiempo de entrega aproximado</p>
                    <TimePicker
                        format="HH:mm"
                        hourStep={1}
                        minuteStep={15}
                        variant="outlined"
                        size="large"
                        className="!bg-transparent !text-primary-foreground !border-muted-foreground/50 w-full"
                        placeholder="Ej: 24-48 hs"
                        value={estimatedTime ? dayjs(estimatedTime, "HH:mm") : null}
                        onChange={handleETAChange}
                    />
                </div>
                <div className="flex gap-2">
                    <Button className="grow" type="button" onClick={handleCancel}>
                        <Trash />
                        Cancelar
                    </Button>
                    <Button className="grow" type="button" onClick={handleSave}>
                        <Check />
                        Guardar
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
