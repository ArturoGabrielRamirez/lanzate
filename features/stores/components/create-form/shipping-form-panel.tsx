import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

import AnimatedTags from "@/features/shadcn/components/smoothui/ui/AnimatedTags"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { DeliveryConfigPanel } from "@/features/stores/components/create-form/delivery-config-panel"
import { CreateStoreFormValues, ShippingMethod } from "@/features/stores/types"

import type { Selection } from "react-aria-components"


export function ShippingFormPanel() {

    const { setValue, getValues, trigger, formState: { errors } } = useFormContext<CreateStoreFormValues>()
    const { values, setValues: setCtxValues } = useCreateStoreContext()
    const [offersDelivery, setOffersDelivery] = useState(false)
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
    const [isAddingMethod, setIsAddingMethod] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
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
        trigger("payment_info.payment_methods")
    }, [trigger])

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
    }, [getValues, setValue, values.shipping_info, values.payment_info, setCtxValues])

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
        setIsAddingMethod(false)
        setEditingIndex(null)
        setShippingMethods([])
        setValue("shipping_info.offers_delivery", false, { shouldValidate: true, shouldDirty: true })
        setValue("shipping_info.methods", [], { shouldValidate: true, shouldDirty: true })
    }

    const handleAddMethod = () => {
        const newMethod: ShippingMethod = {
            providers: [],
            minPurchase: "",
            freeShippingMin: "",
            estimatedTime: "",
            deliveryPrice: ""
        }
        console.log("🚀 ~ handleAddMethod ~ newMethod:", newMethod)
        const next = [...shippingMethods, newMethod]
        setShippingMethods(next)
        setIsAddingMethod(true)
        setValue("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            shipping_info: {
                offers_delivery: offersDelivery,
                methods: next
            }
        })
        const newIndex = shippingMethods.length
        setEditingIndex(newIndex)
    }

    const handleCancelMethod = (index: number) => {
        setIsAddingMethod(false)
        const next = shippingMethods.filter((_m, i) => i !== index)
        setShippingMethods(next)
        setValue("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setEditingIndex(null)
    }

    const handleSaveMethod = (index: number, method: ShippingMethod) => {
        const next = shippingMethods.map((m, i) => i === index ? method : m)
        setShippingMethods(next)
        setValue("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setIsAddingMethod(false)
        setEditingIndex(null)
    }

    const handleDeleteMethod = (index: number) => {
        const next = shippingMethods.filter((_m, i) => i !== index)
        setShippingMethods(next)
        setValue("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)
    }

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
            <DeliveryConfigPanel
                offersDelivery={offersDelivery}
                onSelectionChange={handleSelectionChange}
                isAddingMethod={isAddingMethod}
                shippingMethods={shippingMethods}
                errors={errors}
                onAddMethod={handleAddMethod}
                editingIndex={editingIndex}
                onCancelMethod={handleCancelMethod}
                onSaveMethod={handleSaveMethod}
                onDeleteMethod={handleDeleteMethod}
            />

        </>
    )
}
