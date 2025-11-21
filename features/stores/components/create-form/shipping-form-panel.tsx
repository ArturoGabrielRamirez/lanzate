import { Store, Truck } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

/* import { Button } from "@/features/shadcn/components/button"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button" */
import AnimatedTags from "@/features/shadcn/components/smoothui/ui/AnimatedTags"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
/* import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip" */
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
/* import { ShippingMethodFormPanel } from "@/features/stores/components/create-form/shipping-method-form-panel" */
import { CreateStoreFormValues/* , ShippingMethod */ } from "@/features/stores/types"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"


export function ShippingFormPanel() {

    const { setValue, getValues, formState: { errors }/* , watch */ } = useFormContext<CreateStoreFormValues>()
    const { values, setValues: setCtxValues } = useCreateStoreContext()
    /* const setValueAny = setValue as unknown as (name: string, value: unknown, options?: { shouldValidate?: boolean; shouldDirty?: boolean }) => void */
    const [offersDelivery, setOffersDelivery] = useState(false)
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
    const [isAddingMethod, setIsAddingMethod] = useState(false)
    /* const [editingIndex, setEditingIndex] = useState<number | null>(null) */
    const [paymentMethods, setPaymentMethods] = useState<string[]>(() => (getValues("payment_info.payment_methods") as string[] | undefined) || [])

    console.log("🚀 ~ ShippingFormPanel ~ paymentMethods:", paymentMethods)
    console.log("🚀 ~ ShippingFormPanel ~ values:", values)

    // Sync payment methods state with form value when it changes
    /* const paymentMethodsValue = watch("payment_info.payment_methods") as string[] | undefined */

    /* useEffect(() => {
        setPaymentMethods(paymentMethodsValue || [])
    }, [paymentMethodsValue]) */

    const seededRef = useRef(false)

    useEffect(() => {
        if (seededRef.current) return

        seededRef.current = true

        if (values.payment_info) {

            const p = values.payment_info

            const safe = {
                payment_methods: Array.isArray(p.payment_methods) ? (p.payment_methods.filter(Boolean) as string[]) : []
            }

            setValue("payment_info", safe, { shouldValidate: true })
            setPaymentMethods(safe.payment_methods)
            setCtxValues({ payment_info: safe })
        }

        if (values.shipping_info) {

            const s = values.shipping_info

            const safe = {
                offers_delivery: s.offers_delivery || false
            }

            setValue("shipping_info", safe, { shouldValidate: true })
            setOffersDelivery(safe.offers_delivery)
            setCtxValues({ shipping_info: safe })

        }
        /* if (values.shipping_info) {
            const s = values.shipping_info
            const safe = {
                offers_delivery: !!s.offers_delivery,
                methods: Array.isArray(s.methods)
                    ? (s.methods.filter(Boolean).map((m) => ({
                        providers: m?.providers || [],
                        minPurchase: m?.minPurchase,
                        freeShippingMin: m?.freeShippingMin,
                        estimatedTime: m?.estimatedTime,
                        deliveryPrice: m?.deliveryPrice ?? "",
                    })) as NonNullable<CreateStoreFormValues["shipping_info"]["methods"]>)
                    : []
            }
            setValue("shipping_info", safe, { shouldValidate: true })
        }
        
        const offers = getValues("shipping_info.offers_delivery") || false
        setOffersDelivery(!!offers)
        const existingMethods = getValues("shipping_info.methods") || []
        setShippingMethods(existingMethods as ShippingMethod[])
        const existingPayments = getValues("payment_info.payment_methods") || []
        if (Array.isArray(existingPayments)) {
            setValue("payment_info.payment_methods", existingPayments, { shouldValidate: true })
        } */
    }, [getValues, setValue, values.shipping_info, values.payment_info])

    /* useEffect(() => {
        if (offersDelivery) {
            setValue("shipping_info.methods", shippingMethods, { shouldValidate: true })
            trigger("shipping_info.methods")
        } else {
            setValue("shipping_info.methods", [], { shouldValidate: true })
        }
    }, [shippingMethods, offersDelivery, setValue, trigger]) */

    /* useEffect(() => {
        const sub = watch((v) => {
            const vv = v as Partial<CreateStoreFormValues>
            setCtxValues({
                shipping_info: vv.shipping_info as CreateStoreFormValues["shipping_info"],
                payment_info: vv.payment_info as CreateStoreFormValues["payment_info"],
            })
        })
        return () => sub.unsubscribe()
    }, [watch, setCtxValues]) */

    /* useEffect(() => { setStepValid(5, isValid) }, [isValid, setStepValid]) */

    const handleOffersDelivery = () => {
        setCtxValues({ shipping_info: { offers_delivery: true, methods: [] } })
        setOffersDelivery(true)
        setValue("shipping_info.offers_delivery", true, { shouldValidate: true, shouldDirty: true })
        /* setOffersDelivery(true)
        setValueAny("shipping_info.offers_delivery", true, { shouldValidate: true, shouldDirty: true }) */
    }

    const handleNotOffersDelivery = () => {
        setCtxValues({ shipping_info: { offers_delivery: false, methods: [] } })
        setOffersDelivery(false)
        setValue("shipping_info.offers_delivery", false, { shouldValidate: true, shouldDirty: true })
        /* setOffersDelivery(false)
        setIsAddingMethod(false)
        setEditingIndex(null)
        setShippingMethods([])
        setValueAny("shipping_info.offers_delivery", false, { shouldValidate: true, shouldDirty: true })
        setValueAny("shipping_info.methods", [], { shouldValidate: true, shouldDirty: true }) */
    }

    /* const handleAddMethod = () => {
        const newMethod: ShippingMethod = {
            providers: [],
            minPurchase: "",
            freeShippingMin: "",
            estimatedTime: "",
            deliveryPrice: ""
        }
        const newIndex = shippingMethods.length
        const next = [...shippingMethods, newMethod]
        setShippingMethods(next)
        setValueAny("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setIsAddingMethod(true)
        setEditingIndex(newIndex)
    } */

    /* const handleCancelMethod = (index: number) => {
        setIsAddingMethod(false)
        const next = shippingMethods.filter((_m, i) => i !== index)
        setShippingMethods(next)
        setValueAny("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setEditingIndex(null)
    } */

    /* const handleSaveMethod = (index: number, method: ShippingMethod) => {
        const next = shippingMethods.map((m, i) => i === index ? method : m)
        setShippingMethods(next)
        setValueAny("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setIsAddingMethod(false)
        setEditingIndex(null)
    } */

    /* const handleDeleteMethod = (index: number) => {
        const next = shippingMethods.filter((_m, i) => i !== index)
        setShippingMethods(next)
        setValueAny("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)
    } */

    const handlePaymentTagsChange = (tags: string[]) => {
        setValue("payment_info.payment_methods", tags, { shouldValidate: true, shouldDirty: true })
        setPaymentMethods(tags)
        setCtxValues({ payment_info: { payment_methods: tags } })
    }

    const handleSelectionChange = (selection: Selection) => {
        if (selection === "all") return

        const selected = Array.from(selection)[0]

        if (selected === "delivery") {
            handleOffersDelivery()
        } else if (selected === "pickup") {
            handleNotOffersDelivery()
        }
    }

    return (
        <>
            <div className="space-y-3 mb-8">
                <AnimatedTags
                    initialTags={["Efectivo", "Credito", "Debito", "Mercado Pago", "Transferencia"]}
                    selectedTags={paymentMethods}
                    onChange={handlePaymentTagsChange}
                    title="Metodos de pago"
                />
                {errors.payment_info?.payment_methods?.message && (
                    <p className="text-sm text-red-500">{errors.payment_info.payment_methods.message as string}</p>
                )}
            </div>
            <p className="text-sm font-medium mb-2">Metodos de envio</p>
            <ChoiceBox
                columns={2}
                gap={6}
                selectionMode="single"
                selectedKeys={[offersDelivery ? "delivery" : "pickup"]}
                onSelectionChange={handleSelectionChange}
            >
                <ChoiceBoxItem id="pickup" textValue="Pickup Only">
                    <Store />
                    <ChoiceBoxLabel>Pickup Only</ChoiceBoxLabel>
                    <ChoiceBoxDescription>This store does not offer delivery service; only pickup.</ChoiceBoxDescription>
                </ChoiceBoxItem>
                <ChoiceBoxItem id="delivery" textValue="Delivery & Pickup">
                    <Truck />
                    <ChoiceBoxLabel>Delivery & Pickup</ChoiceBoxLabel>
                    <ChoiceBoxDescription>This store offers delivery as well as pickup.</ChoiceBoxDescription>
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
                        {!isAddingMethod && (errors?.shipping_info && "methods" in (errors.shipping_info as Record<string, unknown>) || (shippingMethods.length === 0)) && (
                            <div className={cn(
                                "text-sm border p-6 rounded-md text-center border-dashed",
                                errors?.shipping_info && "methods" in (errors.shipping_info as Record<string, unknown>)
                                    ? "text-red-500 border-red-500 bg-red-500/5"
                                    : "text-muted-foreground border-muted-foreground/50"
                            )}>
                                <p>
                                    {errors?.shipping_info && "methods" in (errors.shipping_info as Record<string, unknown>)
                                        ? (errors.shipping_info as Record<string, { message?: string }>)["methods"]?.message
                                        : "No configuraste ninguna forma de envío"
                                    }
                                </p>
                            </div>
                        )}
                        {/* 
                        <AnimatePresence key={"inset"}>
                            {isAddingMethod && editingIndex !== null && shippingMethods[editingIndex] && (
                                <ShippingMethodFormPanel
                                    method={shippingMethods[editingIndex]}
                                    index={editingIndex}
                                    onCancel={handleCancelMethod}
                                    onSave={handleSaveMethod}
                                />
                            )}
                        </AnimatePresence>
                        {shippingMethods.length > 0 && (
                            <div className="space-y-2">
                                {shippingMethods.map((m, i) => (
                                    (isAddingMethod && editingIndex === i) ? null : (
                                        <div key={i} className="flex justify-between items-center border rounded-md p-3 text-sm">
                                            <div className="space-y-1">
                                                <p className="font-medium">{m.providers.length ? m.providers.join(', ') : 'Sin proveedor seleccionado'}</p>
                                                <p className="text-muted-foreground">
                                                    {m.minPurchase ? `Mín compra: $${m.minPurchase}` : 'Sin mínimo'}
                                                    {" • "}
                                                    {m.freeShippingMin ? `Envío gratis desde: $${m.freeShippingMin}` : 'Sin gratis'}
                                                    {" • "}
                                                    {m.estimatedTime ? `ETA: ${m.estimatedTime}` : 'ETA no establecido'}
                                                    {m.deliveryPrice ? ` • Precio: $${m.deliveryPrice}` : ''}
                                                </p>
                                            </div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton type="button" icon={Trash} onClick={() => handleDeleteMethod(i)} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Eliminar
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                        {!isAddingMethod && (
                            <Button className="w-full" onClick={handleAddMethod} type="button">
                                <Plus />
                                Agregar modo de envío
                            </Button>
                        )} */}

                    </motion.div>
                )}
            </AnimatePresence>

        </>
    )
}
