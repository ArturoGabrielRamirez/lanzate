"use client"

//TODO:Integrar camera from features/shared

import { yupResolver } from "@hookform/resolvers/yup"
import { TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Calendar, Check, Clock, Contact2, Facebook, Globe, Image as ImageIcon, Instagram, Loader, Mail, MapPin, Phone, Plus, Store, StoreIcon, Trash, Truck, Twitter, Upload } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import Image from "next/image";
import { useRouter } from "next/navigation"
import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field";
import { TextareaField } from "@/features/global/components/form/textarea-field";
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import AnimatedTags from "@/features/shadcn/components/smoothui/ui/AnimatedTags"
import Stepper, { Step } from "@/features/shadcn/components/Stepper"
import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogTitle, DialogHeader, DialogTrigger, DialogContent, DialogDescription } from "@/features/shadcn/components/ui/dialog"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemPreview } from "@/features/shadcn/components/ui/file-upload"
import { Progress } from "@/features/shadcn/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { useStep } from "@/features/shadcn/hooks/use-step"
import { createStoreAction } from "@/features/stores/actions"
import { basicInfoSchemaNew, addressInfoSchema, contactInfoSchema, settingsSchema, shippingPaymentSchema, BasicInfoFormType, AddressInfoFormType, ContactInfoFormType, SettingsFormType, ShippingPaymentFormType } from "@/features/stores/schemas"
import { AttentionDateType, AttentionDateFormPanelProps, ShippingMethodFormPanelProps, StepIndicatorProps, CreateStoreFormProps, CreateStoreFormValues, CreateStoreContextType, ShippingMethod } from "@/features/stores/types"
import { processOpeningHours, processShippingMethods, processPaymentMethods, slugify } from "@/features/stores/utils"
import { cn } from "@/lib/utils"
/* import { ScrollArea } from "@/features/shadcn/components/scroll-area"; */


const CreateStoreContext = createContext<CreateStoreContextType | null>(null)

function useCreateStoreContext() {
    const ctx = useContext(CreateStoreContext)
    if (!ctx) throw new Error("CreateStoreContext not found")
    return ctx
}

function CreateStoreProvider({ children }: { children: React.ReactNode }) {
    const [values, setValuesState] = useState<Partial<CreateStoreFormValues>>({})
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})

    const setValues = useCallback((partial: Partial<CreateStoreFormValues>) => {
        setValuesState(prev => ({ ...prev, ...partial }))
    }, [])

    const setStepValid = useCallback((step: number, valid: boolean) => {
        setIsStepValid(prev => ({ ...prev, [step]: valid }))
    }, [])

    return (
        <CreateStoreContext.Provider value={{ values, setValues, isStepValid, setStepValid }}>
            {children}
        </CreateStoreContext.Provider>
    )
}

function ShippingFormPanel() {

    const { setValue, getValues, formState: { errors, isValid }, watch } = useFormContext<CreateStoreFormValues>()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const setValueAny = setValue as unknown as (name: string, value: unknown, options?: { shouldValidate?: boolean; shouldDirty?: boolean }) => void
    const [offersDelivery, setOffersDelivery] = useState(false)
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
    const [isAddingMethod, setIsAddingMethod] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    // derive payment methods directly from form state to persist across steps
    const paymentMethods = (watch("payment_info.payment_methods") as string[] | undefined) || []

    const seededRef = useRef(false)
    useEffect(() => {
        if (seededRef.current) return
        seededRef.current = true
        if (values.shipping_info) {
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
        if (values.payment_info) {
            const p = values.payment_info
            const safe = {
                payment_methods: Array.isArray(p.payment_methods) ? (p.payment_methods.filter(Boolean) as string[]) : []
            }
            setValue("payment_info", safe, { shouldValidate: true })
        }
        const offers = getValues("shipping_info.offers_delivery") || false
        setOffersDelivery(!!offers)
        const existingMethods = getValues("shipping_info.methods") || []
        setShippingMethods(existingMethods as ShippingMethod[])
        // ensure form is hydrated with persisted payment methods
        const existingPayments = getValues("payment_info.payment_methods") || []
        if (Array.isArray(existingPayments)) {
            setValueAny("payment_info.payment_methods", existingPayments, { shouldValidate: true })
        }
    }, [getValues, setValue, values.shipping_info, values.payment_info, setValueAny])

    useEffect(() => {
        const sub = watch((v) => {
            const vv = v as Partial<CreateStoreFormValues>
            setCtxValues({
                shipping_info: vv.shipping_info as CreateStoreFormValues["shipping_info"],
                payment_info: vv.payment_info as CreateStoreFormValues["payment_info"],
            })
        })
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    useEffect(() => { setStepValid(5, isValid) }, [isValid, setStepValid])

    const handleOffersDelivery = () => {
        setOffersDelivery(true)
        setValueAny("shipping_info.offers_delivery", true, { shouldValidate: true, shouldDirty: true })
    }

    const handleNotOffersDelivery = () => {
        setOffersDelivery(false)
        setIsAddingMethod(false)
        setEditingIndex(null)
        setShippingMethods([])
        setValueAny("shipping_info.offers_delivery", false, { shouldValidate: true, shouldDirty: true })
        setValueAny("shipping_info.methods", [], { shouldValidate: true, shouldDirty: true })
    }

    const handleAddMethod = () => {
        const newMethod: ShippingMethod = {
            providers: [],
            minPurchase: "",
            freeShippingMin: "",
            estimatedTime: ""
        }
        const newIndex = shippingMethods.length
        const next = [...shippingMethods, newMethod]
        setShippingMethods(next)
        setValueAny("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setIsAddingMethod(true)
        setEditingIndex(newIndex)
    }

    const handleCancelMethod = (index: number) => {
        setIsAddingMethod(false)
        const next = shippingMethods.filter((_m, i) => i !== index)
        setShippingMethods(next)
        setValueAny("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setEditingIndex(null)
    }

    const handleSaveMethod = (index: number, method: ShippingMethod) => {
        const next = shippingMethods.map((m, i) => i === index ? method : m)
        setShippingMethods(next)
        setValueAny("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        setIsAddingMethod(false)
        setEditingIndex(null)
    }

    const handleDeleteMethod = (index: number) => {
        const next = shippingMethods.filter((_m, i) => i !== index)
        setShippingMethods(next)
        setValueAny("shipping_info.methods", next, { shouldValidate: true, shouldDirty: true })
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)
    }

    const handlePaymentTagsChange = (tags: string[]) => {
        setValueAny("payment_info.payment_methods", tags, { shouldValidate: true, shouldDirty: true })
    }

    return (
        <>
            <div className="space-y-3 mb-8">
                <AnimatedTags
                    initialTags={["Efectivo", "Credito", "Debito", "Mercado Pago", "Transferencia"]}
                    selectedTags={paymentMethods}
                    onChange={handlePaymentTagsChange}
                    title="Metodos de pago"
                    emptyMessage="No hay metodos de pago seleccionados"
                    key={paymentMethods.join('|')}
                />
                {errors.payment_info?.payment_methods?.message && (
                    <p className="text-sm text-red-500">{errors.payment_info.payment_methods.message as string}</p>
                )}
            </div>
            <p className="text-sm font-medium mb-2">Metodos de envio</p>
            <div className="grid grid-cols-2 items-center gap-6 text-center justify-center mb-8">
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow h-full", offersDelivery ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handleOffersDelivery}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <Truck className="size-9" />
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This store offers delivery as well as pickup.</p>
                </div>
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow h-full", !offersDelivery ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handleNotOffersDelivery}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <Store className="size-9" />
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This store does not offer delivery service; only pickup.</p>
                </div>
            </div>

            <AnimatePresence>
                {offersDelivery && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100, position: "absolute" }}
                        className="space-y-4"
                    >
                        <h3 className="text-muted-foreground text-base font-medium">Modos de envío</h3>
                        {shippingMethods.length === 0 && !isAddingMethod && (
                            <div className="text-sm text-muted-foreground border border-muted-foreground/50 p-6 rounded-md text-center border-dashed">
                                <p>No configuraste ninguna forma de envío</p>
                            </div>
                        )}
                        {isAddingMethod && editingIndex !== null && shippingMethods[editingIndex] && (
                            <ShippingMethodFormPanel
                                method={shippingMethods[editingIndex]}
                                index={editingIndex}
                                onCancel={handleCancelMethod}
                                onSave={handleSaveMethod}
                            />
                        )}
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
                        )}

                    </motion.div>
                )}
            </AnimatePresence>

        </>
    )
}

function AttentionDateFormPanel({ date, onCancel, onSave, index }: AttentionDateFormPanelProps) {

    const initialTags = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
    ]

    const [selected, setSelected] = useState<string[]>(date.days || [])
    const [startTime, setStartTime] = useState<dayjs.Dayjs>(dayjs(date.startTime))
    const [endTime, setEndTime] = useState<dayjs.Dayjs>(dayjs(date.endTime))
    const format = 'HH:mm';

    const handleTimeChange = (value: (Dayjs | null)[] | null) => {
        if (!value || value.length !== 2) return
        const [start, end] = value
        setStartTime(dayjs(start))
        setEndTime(dayjs(end))
    }

    const handleCancel = () => {
        if (onCancel) onCancel(index)
    }

    const handleSave = () => {
        if (onSave) onSave(index, startTime, endTime, selected)
    }

    return (
        <>
            <AnimatedTags
                initialTags={initialTags}
                selectedTags={selected}
                onChange={setSelected}
            />
            <div className="space-y-2">
                <p className="text-sm font-medium">Horarios de apertura</p>
                <TimePicker.RangePicker
                    defaultValue={[startTime, endTime]}
                    format={format}
                    popupClassName="!z-50"
                    rootClassName="!z-50 w-full"
                    changeOnScroll
                    hourStep={1}
                    minuteStep={5}
                    showNow
                    variant="outlined"
                    size="large"
                    className="!bg-transparent !text-primary-foreground !border-muted-foreground/50"
                    onChange={handleTimeChange}
                />
            </div>
            <div className="flex gap-2">
                <Button className="grow" type="button" onClick={handleCancel}>
                    <Trash />
                    Cancel
                </Button>
                <Button className="grow" type="button" onClick={handleSave}>
                    <Check />
                    Save
                </Button>
            </div>
        </>
    )
}

function ShippingMethodFormPanel({ method, index, onCancel, onSave }: ShippingMethodFormPanelProps) {

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
        <>
            <AnimatedTags
                initialTags={initialTags}
                selectedTags={selectedProviders}
                onChange={handleProvidersChange}
            />
            {errors.shipping_info?.methods?.[index]?.providers && (
                <p className="text-sm text-red-500">Seleccioná al menos un proveedor</p>
            )}
            <div className="grid grid-cols-1 gap-3 mt-10">
                <InputField
                    label="Mínimo $ para delivery"
                    name={`${formBase}.minPurchase`}
                    inputMode="numeric"
                    type="number"
                    placeholder="Ej: 10000"
                    defaultValue={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <InputField
                    label="Mínimo $ envío gratis"
                    name={`${formBase}.freeShippingMin`}
                    inputMode="numeric"
                    type="number"
                    placeholder="Ej: 20000"
                    defaultValue={freeShippingMin}
                    onChange={(e) => setFreeShippingMin(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <InputField
                    label="Precio $ del delivery"
                    name={`${formBase}.deliveryPrice`}
                    inputMode="numeric"
                    type="number"
                    placeholder="Ej: 1500"
                    defaultValue={deliveryPrice}
                    onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "")
                        setDeliveryPrice(v)
                        setValueAny(`${formBase}.deliveryPrice`, v, { shouldValidate: true, shouldDirty: true })
                    }}
                />
            </div>
            <div className="mb-4">
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
        </>
    )
}

function SettingsFormPanel() {

    const { setValue, getValues, formState: { isValid, errors }, watch, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const [attentionDates, setAttentionDates] = useState<AttentionDateType[]>(() => {
        const existing = getValues("settings.attention_dates") as { days: string[], startTime: string, endTime: string }[] | undefined
        if (!existing || existing.length === 0) return []
        return existing.map((d) => ({
            date: dayjs().format("YYYY-MM-DD"),
            days: d.days || [],
            startTime: dayjs(d.startTime, "HH:mm"),
            endTime: dayjs(d.endTime, "HH:mm"),
        }))
    })
    const [isAddingDate, setIsAddingDate] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isOpen24Hours, setIsOpen24Hours] = useState(() => !!(getValues("settings.is_open_24_hours") ?? true))

    const seededRefSettings = useRef(false)
    useEffect(() => {
        if (seededRefSettings.current) return
        seededRefSettings.current = true
        if (values.settings) setValue("settings", values.settings, { shouldValidate: true })
    }, [values.settings, setValue])

    useEffect(() => {
        const sub = watch((v) => setCtxValues({ settings: (v as CreateStoreFormValues).settings }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    useEffect(() => { setStepValid(4, isValid) }, [isValid, setStepValid])
    const handleIsOpen24Hours = () => {
        setIsOpen24Hours(true)
        setValue("settings.is_open_24_hours", true, { shouldValidate: true, shouldDirty: true })
        setValue("settings.attention_dates", [], { shouldValidate: true, shouldDirty: true })
        trigger("settings")
    }

    const handleIsNotOpen24Hours = () => {
        setIsOpen24Hours(false)
        setValue("settings.is_open_24_hours", false, { shouldValidate: true, shouldDirty: true })
        // force validation when switching to scheduled mode
        setValue("settings.attention_dates", attentionDates.map(d => ({
            days: d.days,
            startTime: dayjs(d.startTime).format("HH:mm"),
            endTime: dayjs(d.endTime).format("HH:mm"),
        })), { shouldValidate: true, shouldDirty: true })
        trigger("settings")
    }

    const handleAddDate = () => {

        const newDate: AttentionDateType = {
            date: dayjs().format("YYYY-MM-DD"),
            startTime: dayjs('10:00', 'HH:mm'),
            endTime: dayjs('12:00', 'HH:mm'),
            days: []
        }

        const newIndex = attentionDates.length
        setAttentionDates([...attentionDates, newDate])
        setIsAddingDate(true)
        setEditingIndex(newIndex)
    }

    const handleCancelDate = (index: number) => {
        setIsAddingDate(false)
        const next = attentionDates.filter((_date, i) => i !== index)
        setAttentionDates(next)
        setValue("settings.attention_dates", next.map(d => ({
            days: d.days,
            startTime: dayjs(d.startTime).format("HH:mm"),
            endTime: dayjs(d.endTime).format("HH:mm"),
        })), { shouldValidate: true, shouldDirty: true })
        setEditingIndex(null)
        trigger("settings")
    }

    const handleSaveDate = (index: number, startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, days: string[]) => {
        const next = attentionDates.map((date, i) => i === index ? { ...date, startTime, endTime, days } : date)
        setAttentionDates(next)
        setValue("settings.attention_dates", next.map(d => ({
            days: d.days,
            startTime: dayjs(d.startTime).format("HH:mm"),
            endTime: dayjs(d.endTime).format("HH:mm"),
        })), { shouldValidate: true, shouldDirty: true })
        setIsAddingDate(false)
        setEditingIndex(null)
        trigger("settings")
    }

    const handleDeleteDate = (index: number) => {
        const next = attentionDates.filter((_date, i) => i !== index)
        setAttentionDates(next)
        setValue("settings.attention_dates", next.map(d => ({
            days: d.days,
            startTime: dayjs(d.startTime).format("HH:mm"),
            endTime: dayjs(d.endTime).format("HH:mm"),
        })), { shouldValidate: true, shouldDirty: true })
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)
        trigger("settings")
    }

    return (
        <>
            <div className="grid grid-cols-2 items-center gap-6 text-center justify-center mb-8">
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow", isOpen24Hours ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handleIsOpen24Hours}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="size-9">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 0 0 5.998 8.485M21 12a9 9 0 1 0-18 0m9-5v5m0 3h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2m3-6v2a1 1 0 0 0 1 1h1m1-3v6"></path>
                        </svg>
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This store is open 24 hours.</p>
                </div>
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow", !isOpen24Hours ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handleIsNotOpen24Hours}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <Calendar className="size-9" />
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This store works on schedule.</p>
                </div>
            </div>
            <AnimatePresence>
                {!isOpen24Hours && (
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100, position: "absolute" }}
                    >
                        {attentionDates.length === 0 && !isAddingDate && (
                            <div className="text-sm text-muted-foreground border border-muted-foreground/50 p-6 rounded-md text-center border-dashed">
                                <p>No hay dias de atencion configurados</p>
                            </div>
                        )}
                        {errors?.settings && "attention_dates" in (errors.settings as Record<string, unknown>) && (
                            <p className="text-sm text-red-500">{(errors.settings as Record<string, { message?: string }>)["attention_dates"]?.message || ""}</p>
                        )}
                        {isAddingDate && editingIndex !== null && attentionDates[editingIndex] && (
                            <AttentionDateFormPanel
                                date={attentionDates[editingIndex]}
                                key={`edit-${editingIndex}`}
                                onCancel={handleCancelDate}
                                onSave={handleSaveDate}
                                index={editingIndex}
                            />
                        )}
                        {attentionDates.length > 0 && (
                            <div className="space-y-2">
                                {attentionDates.map((d, i) => (
                                    (isAddingDate && editingIndex === i) ? null : (
                                        <div key={i} className="flex justify-between items-center border rounded-md p-3 text-sm">
                                            <div className="space-y-1">
                                                <p className="font-medium">{d.days.length ? d.days.join(', ') : 'Sin días seleccionados'}</p>
                                                <p className="text-muted-foreground">
                                                    {dayjs(d.startTime).format('HH:mm')} - {dayjs(d.endTime).format('HH:mm')}
                                                </p>
                                            </div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton type="button" icon={Trash} onClick={() => handleDeleteDate(i)} />
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
                        {!isAddingDate && (
                            <Button className="w-full" onClick={handleAddDate} type="button">
                                <Plus />
                                Add date
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function ContactFormPanel() {
    const { formState: { isValid }, watch, setValue } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const seededRefContact = useRef(false)
    useEffect(() => {
        if (seededRefContact.current) return
        seededRefContact.current = true
        if (values.contact_info) setValue("contact_info", values.contact_info, { shouldValidate: true })
    }, [values.contact_info, setValue])
    useEffect(() => {
        const sub = watch((v) => setCtxValues({ contact_info: (v as CreateStoreFormValues).contact_info }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])
    useEffect(() => { setStepValid(3, isValid) }, [isValid, setStepValid])
    return (
        <>
            <div className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-muted-foreground text-base font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            name="contact_info.contact_phone"
                            label="Phone"
                            placeholder="Ej: 1234567890"
                            startIcon={<Phone />}
                            isRequired
                            tooltip="This is the phone number of your store. It will be used to contact your store."
                        />
                        <InputField
                            name="contact_info.contact_email"
                            label="Email"
                            placeholder="Ej: test@example.com"
                            startIcon={<Mail />}
                            type="email"
                            isRequired
                            tooltip="This is the email of your store. It will be used to contact your store."
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-muted-foreground text-base font-medium">Social Media</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <InputField
                            name="contact_info.facebook_url"
                            label="Facebook"
                            placeholder="Ej: https://www.facebook.com/your-page"
                            startIcon={<Facebook />}
                            tooltip="This is the Facebook URL of your store. It will be used to display your store on Facebook."
                        />
                        <InputField
                            name="contact_info.instagram_url"
                            label="Instagram"
                            placeholder="Ej: https://www.instagram.com/your-page"
                            startIcon={<Instagram />}
                            type="email"
                            tooltip="This is the Instagram URL of your store. It will be used to display your store on Instagram."
                        />
                        <InputField
                            name="contact_info.x_url"
                            label="X (Twitter)"
                            placeholder="Ej: https://x.com/your-page"
                            startIcon={<Twitter />}
                            type="url"
                            tooltip="This is the X (Twitter) URL of your store. It will be used to display your store on X (Twitter)."
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

function AddressFormPanel() {

    const { setValue, getValues, formState: { isValid }, watch, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const [isPhysicalStore, setIsPhysicalStore] = useState(getValues("address_info.is_physical_store") || false)

    // keep local UI state in sync with form value (rehydration or external updates)
    const isPhysicalStoreValue = watch("address_info.is_physical_store") as boolean | undefined
    useEffect(() => {
        setIsPhysicalStore(!!isPhysicalStoreValue)
    }, [isPhysicalStoreValue])

    const seededRefAddress = useRef(false)
    useEffect(() => {
        if (seededRefAddress.current) return
        seededRefAddress.current = true
        if (values.address_info) setValue("address_info", values.address_info, { shouldValidate: true })
    }, [values.address_info, setValue])

    useEffect(() => {
        const sub = watch((v) => setCtxValues({ address_info: (v as CreateStoreFormValues).address_info }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    useEffect(() => { setStepValid(2, isValid) }, [isValid, setStepValid])

    const handlePhysicalStore = () => {
        setIsPhysicalStore(true)
        setValue("address_info.is_physical_store", true, { shouldValidate: true, shouldDirty: true })
        trigger("address_info")
    }

    const handleOnlineStore = () => {
        setIsPhysicalStore(false)
        setValue("address_info.is_physical_store", false, { shouldValidate: true, shouldDirty: true })
        setValue("address_info.address", "", { shouldValidate: true, shouldDirty: true })
        setValue("address_info.city", "", { shouldValidate: true, shouldDirty: true })
        setValue("address_info.province", "", { shouldValidate: true, shouldDirty: true })
        setValue("address_info.country", "", { shouldValidate: true, shouldDirty: true })
        trigger("address_info")
    }

    return (
        <>
            <div className="grid grid-cols-2 items-center gap-6 text-center justify-center mb-8">
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow", !isPhysicalStore ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handleOnlineStore}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <Globe className="size-8" />
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This is an online store.</p>
                </div>
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow", isPhysicalStore ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handlePhysicalStore}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <Store className="size-8" />
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This is a physical store.</p>
                </div>
            </div>
            {isPhysicalStore && (
                <div className="space-y-4">
                    <InputField
                        name="address_info.address"
                        label="Address"
                        placeholder="Ej: 123 Main St"
                        startIcon={<MapPin />}
                        isRequired
                        tooltip="This is the address of your store. It will be used to display your store on the map."
                    />
                    <InputField
                        name="address_info.city"
                        label="City"
                        placeholder="Ej: New York"
                        startIcon={<MapPin />}
                        isRequired
                        tooltip="This is the city of your store. It will be used to display your store on the map."
                    />
                    <InputField
                        name="address_info.province"
                        label="Province"
                        placeholder="Ej: New York"
                        startIcon={<MapPin />}
                        isRequired
                        tooltip="This is the province of your store. It will be used to display your store on the map."
                    />
                    <InputField
                        name="address_info.country"
                        label="Country"
                        placeholder="Ej: United States"
                        startIcon={<MapPin />}
                        isRequired
                        tooltip="This is the country of your store. It will be used to display your store on the map."
                    />
                </div>
            )}
        </>
    )
}

function BasicInfoFormPanel() {

    const { setValue, watch, formState: { isValid } } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const [logo, setLogo] = useState<File[]>([])
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isSubdomainTouched, setIsSubdomainTouched] = useState(false)


    const nameValue = watch('basic_info.name') as string | undefined
    const logoValue = watch('basic_info.logo') as unknown

    const seededRefBasic = useRef(false)
    useEffect(() => {
        if (seededRefBasic.current) return
        seededRefBasic.current = true
        if (values.basic_info) setValue('basic_info', values.basic_info as never, { shouldValidate: true })
    }, [values.basic_info, setValue])

    useEffect(() => {
        const sub = watch((v) => setCtxValues({ basic_info: (v as CreateStoreFormValues).basic_info }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    useEffect(() => {
        setStepValid(1, isValid)
    }, [isValid, setStepValid])

    useEffect(() => {
        if (!isSubdomainTouched) {
            const next = slugify(nameValue || '')
            setValue('basic_info.subdomain', next, { shouldValidate: true, shouldDirty: true })
        }
    }, [nameValue, isSubdomainTouched, setValue])

    useEffect(() => {
        if (logoValue instanceof File) {
            setLogo([logoValue])
            setLogoUrl(null)
        } else if (typeof logoValue === 'string' && logoValue.length > 0) {
            setLogo([])
            setLogoUrl(logoValue)
        } else {
            setLogo([])
            setLogoUrl(null)
        }
    }, [logoValue])

    const handleUpload = async (file: File) => {
        try {
            toast.loading('Subiendo logo...')
            setIsUploading(true)
            setUploadProgress(0)
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'store-logos')

            await new Promise((resolve) => setTimeout(resolve, 1000))
            setUploadProgress(50)

            const response = await fetch('/api/store-logo', { method: 'POST', body: formData })
            if (!response.ok) throw new Error('Error uploading file')


            const data = await response.json()

            setValue("basic_info.logo", data.url)
            toast.dismiss()
            toast.success('Logo subido correctamente')
            setUploadProgress(100)
        } catch (error) {
            toast.dismiss()
            toast.error(error instanceof Error ? error.message : 'Error al subir el archivo')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    /*     const camera = useCamera({
            uploadPath: 'store-logos',
            onSuccess: (url) => {
                setValue("basic_info.logo", url)
                setLogo([])
            },
            onError: (error) => {
                console.error('Camera upload error:', error)
                toast.error('Error al subir la foto')
            },
            quality: 0.9
        })
     */
    /*   const handleCamera = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          e.stopPropagation()
          camera.openCamera();
      } */

    const handleFileSelect = (files: File[]) => {
        if (files.length === 0) return
        const file = files[files.length - 1]
        setLogo([file])
        setValue("basic_info.logo", file)
        handleUpload(file)
    }

    const handleDeleteLogo = () => {
        setLogo([])
        setLogoUrl(null)
        setValue("basic_info.logo", "")
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-10 mb-8">
                <div className="space-y-2">
                    <FileUpload value={logo} onValueChange={handleFileSelect}>
                        <FileUploadDropzone className={cn("rounded-full aspect-square group/dropzone relative max-xs:max-w-[150px] mx-auto w-full", isUploading && "animate-pulse")}>
                            {logo.length > 0 ? (
                                <FileUploadItem value={logo[0]} className="absolute p-0 w-full h-full border-none">
                                    <FileUploadItemPreview className="w-full h-full rounded-full" />
                                </FileUploadItem>
                            ) : logoUrl ? (
                                <Image src={logoUrl} alt="Logo" className="w-full h-full rounded-full object-cover absolute" />
                            ) : (
                                <div className="group-hover/dropzone:hidden flex flex-col items-center gap-1 text-center">
                                    <ImageIcon className="text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Arrastra tu logo aqui</p>
                                </div>
                            )}
                            <div className="hidden group-hover/dropzone:flex flex-col items-center gap-1 text-center absolute p-0 w-full h-full bg-background/50 justify-center backdrop-blur-xs rounded-full">
                                <div className="flex gap-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <IconButton icon={Upload} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Click para explorar archivos
                                        </TooltipContent>
                                    </Tooltip>
                                    {/* <Tooltip>
                                        <TooltipTrigger asChild>
                                            <IconButton icon={Camera} onClick={handleCamera} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Click para tomar foto
                                        </TooltipContent>
                                    </Tooltip> */}
                                </div>
                            </div>
                        </FileUploadDropzone>
                    </FileUpload>
                    {isUploading && <Progress value={uploadProgress} />}
                    {(logo.length > 0 || logoUrl) && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                            <p className="truncate">{logo.length > 0 ? logo[0].name : 'Logo cargado'}</p>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <IconButton icon={Trash} onClick={handleDeleteLogo} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Delete logo
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </div>
                {/*       <CameraComponent
                    {...camera.cameraProps}
                    title="Tomar foto para logo"
                /> */}
                <div className="space-y-4">
                    <InputField
                        name="basic_info.name"
                        label="Name"
                        placeholder="Ej: My Store"
                        startIcon={<StoreIcon />}
                        isRequired
                        tooltip="This is the name of your store. It will be used to identify your store in the system."
                    />
                    <InputField
                        name="basic_info.subdomain"
                        label="URL"
                        placeholder="Ej: my-store"
                        type="url"
                        inputMode="url"
                        startIcon={<Globe />}
                        endText={(
                            <span>
                                .lanzate.com
                            </span>
                        )}
                        isRequired
                        onChange={(e) => {
                            setIsSubdomainTouched(true)
                            const sanitized = slugify(e.target.value)
                            setValue('basic_info.subdomain', sanitized, { shouldValidate: true, shouldDirty: true })
                        }}
                    />
                </div>
            </div>
            <TextareaField
                name="basic_info.description"
                label="Description"
                placeholder="Ej: My Store Description"
            />
        </>
    )
}

function CreateStoreForm({ setStep, step, onSubmitAll }: CreateStoreFormProps) {

    const { isStepValid, values } = useCreateStoreContext()
    const isValid = !!isStepValid[step]

    const allowedMaxStep = (() => {
        let max = 1
        for (let s = 1; s <= 5; s++) {
            if (isStepValid[s]) max = s + 1; else break
        }
        return Math.min(max, 5)
    })()

    const handleFinalStepCompleted = async () => {
        await onSubmitAll(values as CreateStoreFormValues)
    }

    return (
        <Stepper
            initialStep={1}
            className="p-0 outer-container flex flex-col gap-2"
            contentClassName="!p-0"
            stepContainerClassName="!p-0"
            stepCircleContainerClassName="!rounded-lg !max-w-full !w-full !border-none"
            footerClassName="!p-0"
            onStepChange={setStep}
            onFinalStepCompleted={handleFinalStepCompleted}
            renderStepIndicator={(props: { step: number; currentStep: number; onStepClick: (step: number) => void }) => {
                return (
                    <StepIndicator
                        step={props.step}
                        currentStep={props.currentStep}
                        onStepClick={props.onStepClick}
                        disabled={props.step > allowedMaxStep}
                    />
                )
            }}
            nextButtonProps={{
                disabled: !isValid,
            }}
        >
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<BasicInfoFormType> contentButton="" submitButton={false} resolver={yupResolver(basicInfoSchemaNew as never)}>
                    <BasicInfoFormPanel />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<AddressInfoFormType> contentButton="" submitButton={false} resolver={yupResolver(addressInfoSchema as never)}>
                    <AddressFormPanel />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<ContactInfoFormType> contentButton="" submitButton={false} resolver={yupResolver(contactInfoSchema as never)}>
                    <ContactFormPanel />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<SettingsFormType> contentButton="" submitButton={false} resolver={yupResolver(settingsSchema as never)}>
                    <SettingsFormPanel />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<ShippingPaymentFormType> contentButton="" submitButton={false} resolver={yupResolver(shippingPaymentSchema as never)}>
                    <ShippingFormPanel />
                </Form>
            </Step>
            {step === 6 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Loader className="size-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">{"Creando tu tienda..."}</p>
                    </div>
                </Step>
            )}
            {step === 7 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Check className="size-12 text-green-600" />
                        <p className="text-sm text-muted-foreground">{"Tienda creada con éxito"}</p>
                    </div>
                </Step>
            )}
        </Stepper>
    )
}

function StepIndicator({ step, currentStep, onStepClick, disabled }: StepIndicatorProps) {

    const { isStepValid } = useCreateStoreContext()

    const icons = {
        1: StoreIcon,
        2: MapPin,
        3: Contact2,
        4: Clock,
        5: Truck,
        6: Check,
    }

    const isComplete = !!isStepValid[step]
    const isInvalid = step <= 5 && !isComplete

    if (step === currentStep) {
        const Icon = icons[step as keyof typeof icons]
        return (
            <div
                className={cn(
                    "aspect-square rounded-full size-8 lg:size-10 flex items-center justify-center cursor-pointer",
                    isInvalid ? "bg-destructive/20" : "bg-muted"
                )}
                onClick={() => !disabled && onStepClick(step)}
            >
                <IconButton
                    icon={Icon}
                    active={step === currentStep}
                    onClick={() => !disabled && onStepClick(step)}
                    iconClassName={cn(
                        disabled ? "opacity-50" : ""
                    )}
                    className={cn(
                        step === currentStep ? "text-primary" : "text-muted-foreground",
                        disabled ? "opacity-50" : ""
                    )}
                    disabled={disabled}
                />
            </div>
        )
    }

    return (
        <div
            className={cn(
                "aspect-square rounded-full size-8 lg:size-10 flex items-center justify-center text-xs lg:text-base cursor-pointer text-muted-foreground hover:text-primary",
                isInvalid ? "bg-destructive/20" : "bg-muted",
                disabled ? "opacity-50 pointer-events-none" : ""
            )}
            onClick={() => {
                if (!disabled) {
                    onStepClick(step)
                }
            }}
        >
            {isComplete ? (
                <Check className="size-4" />
            ) : (
                step
            )}
        </div>
    )
}

function CreateStoreButtonNew({ userId }: { userId: number }) {

    const [step, { setStep }] = useStep(7)
    const [createdSlug, setCreatedSlug] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (step === 7 && createdSlug) {
            //TODO: Redirect to the store account or do something else like close the dialog
        }
    }, [step, createdSlug, router])

    const handleCreateStore = async (data: CreateStoreFormValues) => {
        const isPhysical = !!data.address_info?.is_physical_store
        const processedData = {
            ...data,
            // If online store, clear address fields to avoid backend validations
            address_info: isPhysical ? data.address_info : { is_physical_store: false },
            processedOpeningHours: processOpeningHours(data.settings?.attention_dates as { days?: string[]; startTime?: string; endTime?: string }[] | undefined),
            processedShippingMethods: processShippingMethods(data.shipping_info?.methods as { providers?: string[]; minPurchase?: string; freeShippingMin?: string; estimatedTime?: string; deliveryPrice?: string }[] | undefined),
            processedPaymentMethods: processPaymentMethods(data.payment_info?.payment_methods as string[] | undefined),
        }

        setStep(6)
        const { hasError, message, payload } = await createStoreAction(processedData, userId)

        if (hasError) {
            toast.error(message)
            // return the form to the last step for correction
            setStep(5)
            return {
                success: false,
                error: true,
                message: message,
                data: null
            }
        }

        // On success: move to success step and redirect shortly
        setCreatedSlug(payload?.slug || null)
        setStep(7)

        return {
            success: true,
            error: false,
            message: "Store created successfully",
            data: payload
        }
    }

    const descriptions = {
        1: "Choose a name, logo and shipping methods to get started; you can edit your store details later.",
        2: "Choose whether this is a physical store or an online store and add your address information.",
        3: "Add your contact information and social media links so customers can contact you.",
        4: "Choose attention dates and hours so customers know when you are open.",
        5: "Choose your shipping methods and add your payment methods so customers can buy your products.",
        6: "Creating your store…",
        7: "All set! Redirecting…",
    }

    const titleSlugs = {
        1: "Basic",
        2: "Address",
        3: "Contact",
        4: "Hours",
        5: "Delivery",
        6: "Success",
    }

    return (
        <CreateStoreProvider>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        <span>Create Store</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full !max-w-full md:!max-w-2xl h-full rounded-none md:h-auto md:rounded-lg max-h-dvh !grid-rows-[auto_1fr]">
                    <div className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Create Store - {titleSlugs[step as keyof typeof titleSlugs]}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription asChild>
                            <p>{descriptions[step as keyof typeof descriptions]}</p>
                        </DialogDescription>
                    </div>
                    <CreateStoreForm setStep={setStep} step={step} onSubmitAll={handleCreateStore} />
                </DialogContent>
            </Dialog>
        </CreateStoreProvider>
    )
}

export { CreateStoreButtonNew }