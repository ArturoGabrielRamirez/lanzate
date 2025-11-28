import { Check, Clock, DollarSign, Package, Plus, Store, Trash2, Truck, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button"
import { Empty, EmptyContent, EmptyDescription, EmptyMedia } from "@/features/shadcn/components/empty"
import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { TimePicker } from "@/features/stores/components/create-form/time-picker"
import { CreateStoreFormType } from "@/features/stores/schemas"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"

export function ShippingFormPanel() {
    const t = useTranslations("store.create-form.shipping")
    const { control, formState: { isValid, errors, disabled }, setValue, getValues, trigger, watch } = useFormContext<CreateStoreFormType>()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const { shipping_info } = values

    const { fields, append, remove } = useFieldArray({
        control,
        name: "shipping_info.methods"
    })

    const [isAddingMethod, setIsAddingMethod] = useState(false)
    const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())
    const [offersDelivery, setOffersDelivery] = useState(shipping_info?.offers_delivery || false)

    const shippingMethods = watch("shipping_info.methods")
    const watchedOffersDelivery = watch("shipping_info.offers_delivery")

    useEffect(() => {
        if (disabled) {
            setOffersDelivery(shipping_info?.offers_delivery || false)
        }
    }, [disabled, shipping_info?.offers_delivery])

    useEffect(() => {
        if (shipping_info) {
            setValue("shipping_info", shipping_info)
            setOffersDelivery(shipping_info.offers_delivery || false)
        } else {
            setValue("shipping_info", { offers_delivery: false, methods: [] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (watchedOffersDelivery !== undefined) {
            setOffersDelivery(watchedOffersDelivery)
        }
    }, [watchedOffersDelivery])

    useEffect(() => {
        setStepValid(6, isValid)
    }, [isValid, setStepValid])

    useEffect(() => {
        if (fields.length > 0 && confirmedIds.size === 0) {
            const newConfirmed = new Set<string>()
            const currentMethods = getValues("shipping_info.methods") || []

            fields.forEach((field, index) => {
                const methodData = currentMethods[index]
                if (methodData && methodData.providers && methodData.providers.length > 0) {
                    newConfirmed.add(field.id)
                }
            })

            if (newConfirmed.size > 0) {
                setConfirmedIds(newConfirmed)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.length])

    const handleSelectionChange = (selection: Selection) => {
        if (selection === "all") return
        if (disabled) return
        const selected = Array.from(selection)[0]

        const newOffersDelivery = selected === "delivery"
        setOffersDelivery(newOffersDelivery)
        setValue("shipping_info.offers_delivery", newOffersDelivery, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            shipping_info: {
                ...getValues("shipping_info"),
                offers_delivery: newOffersDelivery
            }
        })

        if (!newOffersDelivery) {
            setValue("shipping_info.methods", [])
            setCtxValues({
                ...values,
                shipping_info: {
                    offers_delivery: false,
                    methods: []
                }
            })
            setConfirmedIds(new Set())
            setIsAddingMethod(false)
        }
    }

    const handleAddMethod = () => {
        append({
            providers: [],
            minPurchase: "",
            freeShippingMin: "",
            estimatedTime: "00:30",
            deliveryPrice: "1000"
        })
        setIsAddingMethod(true)
    }

    const handleRemoveMethod = (index: number) => {
        remove(index)
        setIsAddingMethod(false)

        const currentMethods = getValues("shipping_info.methods") || []
        const updatedMethods = currentMethods.filter((_, i) => i !== index)

        setCtxValues({
            ...values,
            shipping_info: {
                ...getValues("shipping_info"),
                methods: updatedMethods
            }
        })
    }

    const handleConfirmMethod = async (index: number) => {
        const isValidField = await trigger(`shipping_info.methods.${index}`)
        // Custom validation for providers since it might not be caught by trigger if not set up in schema correctly for array length
        const providers = getValues(`shipping_info.methods.${index}.providers`)
        const hasProviders = providers && providers.length > 0

        if (isValidField && hasProviders) {
            const field = fields[index]
            if (field && field.id) {
                setConfirmedIds(prev => {
                    const next = new Set(prev)
                    next.add(field.id)
                    return next
                })
            }
            setIsAddingMethod(false)

            const currentMethods = getValues("shipping_info.methods") || []
            setCtxValues({
                ...values,
                shipping_info: {
                    ...getValues("shipping_info"),
                    methods: currentMethods
                }
            })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMethodChange = (index: number, field: string, value: any) => {
        const currentMethods = getValues("shipping_info.methods") || []
        const updatedMethods = currentMethods.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value }
            }
            return item
        })

        // We update local context but setValue is already handled by the input onChange calling setValue/register logic if using RHF properly.
        // However, since we are using custom inputs/onChange, we need to ensure RHF value is updated.
        // The helper function passed to onChange usually updates RHF.
        // Here we just sync context.

        setCtxValues({
            ...values,
            shipping_info: {
                ...getValues("shipping_info"),
                methods: updatedMethods
            }
        })
    }

    const handleToggleProvider = (index: number, provider: string) => {
        const currentMethods = getValues("shipping_info.methods") || []
        const currentMethod = currentMethods[index]
        const currentProviders = currentMethod?.providers || []
        let newProviders = []

        if (currentProviders.includes(provider)) {
            newProviders = currentProviders.filter(p => p !== provider)
        } else {
            newProviders = [...currentProviders, provider]
        }

        setValue(`shipping_info.methods.${index}.providers`, newProviders, { shouldValidate: true, shouldDirty: true })
        handleMethodChange(index, 'providers', newProviders)
    }

    const initialTags = [
        t("providers-options.own-delivery"),
        t("providers-options.oca"),
        t("providers-options.correo-argentino"),
        t("providers-options.others"),
    ]

    return (
        <div className="flex flex-col gap-4">
            <ChoiceBox
                columns={2}
                gap={6}
                selectionMode="single"
                selectedKeys={[offersDelivery ? "delivery" : "pickup"]}
                onSelectionChange={handleSelectionChange}
                className={cn(disabled && "pointer-events-none")}
            >
                <ChoiceBoxItem id="pickup" textValue={t("pickup-only")}>
                    <Store />
                    <ChoiceBoxLabel>{t("pickup-only")}</ChoiceBoxLabel>
                    <ChoiceBoxDescription>{t("pickup-only-description")}</ChoiceBoxDescription>
                </ChoiceBoxItem>
                <ChoiceBoxItem id="delivery" textValue={t("delivery-pickup")}>
                    <Truck />
                    <ChoiceBoxLabel>{t("delivery-pickup")}</ChoiceBoxLabel>
                    <ChoiceBoxDescription>{t("delivery-pickup-description")}</ChoiceBoxDescription>
                </ChoiceBoxItem>
            </ChoiceBox>

            <AnimatePresence>
                {offersDelivery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{t("shipping-methods")}</p>
                            </div>

                            {fields.length === 0 && !isAddingMethod && (
                                <Empty className="border-dashed border-muted-foreground/50 border !py-2">
                                    <EmptyDescription className="!text-xs">
                                        <p>{t("no-shipping-configured")}</p>
                                    </EmptyDescription>
                                </Empty>
                            )}

                            {fields.map((field, index) => {
                                const isConfirmed = confirmedIds.has(field.id)
                                const isCurrentAdding = isAddingMethod && index === fields.length - 1
                                const method = shippingMethods?.[index]
                                const hasError = !!errors?.shipping_info?.methods?.[index]

                                if (isConfirmed && !isCurrentAdding) {
                                    return (
                                        <Item key={field.id} className="border rounded-md p-4 border-muted-foreground/50">
                                            <ItemMedia>
                                                <Package className="size-5 text-muted-foreground" />
                                            </ItemMedia>
                                            <ItemContent className="grow">
                                                <ItemHeader>
                                                    <ItemTitle>{method?.providers?.join(", ") || t("no-provider-selected")}</ItemTitle>
                                                </ItemHeader>
                                                <ItemDescription>
                                                    {method?.deliveryPrice ? `${t("price")}: $${method.deliveryPrice}` : t("free")}
                                                    {method?.minPurchase ? ` • ${t("min-purchase")}: $${method.minPurchase}` : ""}
                                                    {method?.estimatedTime ? ` • ETA: ${method.estimatedTime}` : ""}
                                                </ItemDescription>
                                            </ItemContent>
                                            <ItemActions>
                                                {!disabled && (
                                                    <IconButton
                                                        icon={Trash2}
                                                        onClick={() => handleRemoveMethod(index)}
                                                        color={[255, 0, 0]}
                                                        className="text-destructive hover:bg-destructive/10 active:bg-destructive/20"
                                                        tooltip={t("delete")}
                                                        disabled={disabled}
                                                    />
                                                )}
                                            </ItemActions>
                                        </Item>
                                    )
                                }

                                return (
                                    <div key={field.id} className="flex gap-2 items-start w-full relative group flex-col">
                                        <div className="flex-1 space-y-4 w-full">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-medium">{t("providers")}</p>
                                                    <span className="text-sm text-muted-foreground">
                                                        {method?.providers?.length || 0} {method?.providers?.length === 1 ? "Provider" : "Providers"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {initialTags.map((provider) => {
                                                        const isSelected = method?.providers?.includes(provider)
                                                        return (
                                                            <Badge
                                                                key={provider}
                                                                variant={isSelected ? "default" : "outline"}
                                                                className={cn(
                                                                    "cursor-pointer select-none px-4 py-1.5",
                                                                    !isSelected && "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                                )}
                                                                onClick={() => handleToggleProvider(index, provider)}
                                                            >
                                                                {provider}
                                                            </Badge>
                                                        )
                                                    })}
                                                </div>
                                                {errors.shipping_info?.methods?.[index]?.providers && (
                                                    <p className="text-sm text-red-500 mt-1">{t("providers-error") || "Required"}</p>
                                                )}
                                            </div>

                                            {(!method?.providers || method.providers.length === 0) ? (
                                                <Empty className="gap-1 border-dashed border-muted-foreground/50 border">
                                                    <EmptyMedia>
                                                        <Package className="size-8 text-muted-foreground" />
                                                    </EmptyMedia>
                                                    <EmptyContent className="gap-1">
                                                        <EmptyDescription>
                                                            Seleccioná al menos un proveedor
                                                        </EmptyDescription>
                                                    </EmptyContent>
                                                </Empty>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField
                                                            name={`shipping_info.methods.${index}.deliveryPrice`}
                                                            label={t("delivery-price")}
                                                            placeholder={t("delivery-price-placeholder")}
                                                            type="number"
                                                            inputMode="decimal"
                                                            disabled={isConfirmed && !isCurrentAdding}
                                                            onChange={(e) => handleMethodChange(index, 'deliveryPrice', e.target.value)}
                                                            startIcon={<DollarSign />}
                                                            tooltip={"Precio de envío"}
                                                        />
                                                        <InputField
                                                            name={`shipping_info.methods.${index}.minPurchase`}
                                                            label={t("min-purchase")}
                                                            placeholder={t("min-purchase-placeholder")}
                                                            type="number"
                                                            inputMode="decimal"
                                                            disabled={isConfirmed && !isCurrentAdding}
                                                            onChange={(e) => handleMethodChange(index, 'minPurchase', e.target.value)}
                                                            startIcon={<DollarSign />}
                                                            tooltip={"Precio mínimo de compra para envío gratis"}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <InputField
                                                            name={`shipping_info.methods.${index}.freeShippingMin`}
                                                            label={t("free-shipping-min")}
                                                            placeholder={t("free-shipping-min-placeholder")}
                                                            type="number"
                                                            inputMode="decimal"
                                                            disabled={isConfirmed && !isCurrentAdding}
                                                            onChange={(e) => handleMethodChange(index, 'freeShippingMin', e.target.value)}
                                                            startIcon={<DollarSign />}
                                                            tooltip={"Precio mínimo de compra para envío gratis"}
                                                        />
                                                        <div>
                                                            <TimePicker
                                                                name={`shipping_info.methods.${index}.estimatedTime`}
                                                                label={t("estimated-time")}
                                                                placeholder={t("estimated-time-placeholder")}
                                                                startIcon={<Clock className="size-4" />}
                                                                onChange={(e) => handleMethodChange(index, 'estimatedTime', e.target.value)}
                                                                tooltip={"Tiempo estimado de entrega"}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex gap-2 justify-end w-full mt-2">
                                            <Button variant="destructive" onClick={() => handleRemoveMethod(index)}>
                                                <X className="mr-2 size-4" />
                                                {t("cancel")}
                                            </Button>
                                            <Button variant="default" onClick={() => handleConfirmMethod(index)} disabled={hasError || !method?.providers?.length}>
                                                <Check className="mr-2 size-4" />
                                                {t("save")}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}

                            {!isAddingMethod && !disabled && (
                                <Button variant="outline" onClick={handleAddMethod}>
                                    <Plus className="mr-2 size-4" />
                                    {t("add-shipping-method")}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
