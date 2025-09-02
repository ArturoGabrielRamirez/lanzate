"use client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogTitle, DialogHeader, DialogTrigger, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemPreview } from "@/components/ui/file-upload"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCamera } from "@/features/auth/hooks/use-camera"
import { Form, InputField } from "@/features/layout/components"
import { useStep } from "@/hooks/use-step"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { yupResolver } from "@hookform/resolvers/yup"
import { ArrowLeft, ArrowRight, Calendar, Camera, Check, Clock, Contact2, Facebook, Globe, Image as ImageIcon, Instagram, Loader2, Mail, MapPin, Phone, Plus, Settings, Store, StoreIcon, Trash, Truck, Twitter, Upload } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import * as yup from "yup"
import CameraComponent from "@/features/auth/components/avatar/camera-component"
import { Progress } from "@/components/ui/progress"
import { createStore } from "../actions/createStore"
import AnimatedTags from "@/src/components/smoothui/ui/AnimatedTags"
import { TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

type CreateStoreFormStepsNavigatorProps = {
    canGoToNextStep: boolean;
    canGoToPrevStep: boolean;
    goToNextStep: () => void;
    goToPrevStep: () => void;
    step: number;
    setStep: (step: number) => void;
};

type FormPaneProps = {
    children: React.ReactNode;
}

type AttentionDateType = {
    date: string
    startTime: dayjs.Dayjs
    endTime: dayjs.Dayjs
    days: string[]
}

type ShippingMethod = {
    providers: string[]
    minPurchase: string
    freeShippingMin: string
    estimatedTime: string
}

type AttentionDateFormPanelProps = {
    date: AttentionDateType
    onCancel: (index: number) => void
    onSave: (index: number, startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, days: string[]) => void
    index: number
}

type ShippingMethodFormPanelProps = {
    method: ShippingMethod
    index: number
    onCancel: (index: number) => void
    onSave: (index: number, method: ShippingMethod) => void
}


const createStoreSchema = yup.object().shape({
    basic_info: yup.object().shape({
        name: yup.string().required("Name is required"),
        description: yup.string().max(255, "Description must be less than 255 characters long"),
        subdomain: yup.string().required("Subdomain is required"),
        logo: yup
            .mixed()
            .test("logo-type", "Unsupported file type. Use JPG, PNG, GIF or WebP", (value) => {
                if (value instanceof File) {
                    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
                    return allowed.includes(value.type)
                }
                return true
            })
            .test("logo-size", "File too large (max 5MB)", (value) => {
                if (value instanceof File) {
                    return value.size <= 5 * 1024 * 1024
                }
                return true
            }).nullable().optional(),
    }),
    contact_info: yup.object().shape({
        contact_phone: yup.string().max(20, "Phone must be less than 20 characters long").required("Phone is required"),
        contact_email: yup.string().email("Must be a valid email").max(255, "Email must be less than 255 characters long").required("Email is required"),
        facebook_url: yup.string().url("Must be a valid URL").max(255, "Facebook URL must be less than 255 characters long"),
        instagram_url: yup.string().url("Must be a valid URL").max(255, "Instagram URL must be less than 255 characters long"),
        x_url: yup.string().url("Must be a valid URL").max(255, "X URL must be less than 255 characters long"),
    }),
    address_info: yup.object().shape({
        is_physical_store: yup.boolean().default(false),
        address: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("Address is required when store is physical") : schema.max(255, "Address must be less than 255 characters long")
        ),
        city: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("City is required when store is physical") : schema.max(100, "City must be less than 100 characters long")
        ),
        province: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("Province is required when store is physical") : schema.max(100, "Province must be less than 100 characters long")
        ),
        country: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("Country is required when store is physical") : schema.max(100, "Country must be less than 100 characters long")
        ),
    })
})

export type CreateStoreFormValues = yup.InferType<typeof createStoreSchema>;

const ShippingFormPanel = () => {

    const [offersDelivery, setOffersDelivery] = useState(false)
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
    const [isAddingMethod, setIsAddingMethod] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const handleOffersDelivery = () => {
        setOffersDelivery(true)
    }

    const handleNotOffersDelivery = () => {
        setOffersDelivery(false)
        setIsAddingMethod(false)
        setEditingIndex(null)
    }

    const handleAddMethod = () => {
        const newMethod: ShippingMethod = {
            providers: [],
            minPurchase: "",
            freeShippingMin: "",
            estimatedTime: ""
        }
        const newIndex = shippingMethods.length
        setShippingMethods([...shippingMethods, newMethod])
        setIsAddingMethod(true)
        setEditingIndex(newIndex)
    }

    const handleCancelMethod = (index: number) => {
        setIsAddingMethod(false)
        setShippingMethods(shippingMethods.filter((_m, i) => i !== index))
        setEditingIndex(null)
    }

    const handleSaveMethod = (index: number, method: ShippingMethod) => {
        setShippingMethods(shippingMethods.map((m, i) => i === index ? method : m))
        setIsAddingMethod(false)
        setEditingIndex(null)
    }

    const handleDeleteMethod = (index: number) => {
        setShippingMethods(shippingMethods.filter((_m, i) => i !== index))
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 text-center justify-center mb-8">
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow", offersDelivery ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handleOffersDelivery}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <Truck className="size-9" />
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This store offers delivery as well as pickup.</p>
                </div>
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow", !offersDelivery ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handleNotOffersDelivery}>
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

const AttentionDateFormPanel = ({ date, onCancel, onSave, index }: AttentionDateFormPanelProps) => {

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

const ShippingMethodFormPanel = ({ method, index, onCancel, onSave }: ShippingMethodFormPanelProps) => {

    const initialTags = [
        "Delivery propio",
        "OCA",
        "Correo Argentino",
        "Otros",
    ]

    const [selectedProviders, setSelectedProviders] = useState<string[]>(method.providers || [])
    const [minPurchase, setMinPurchase] = useState<string>(method.minPurchase || "")
    const [freeShippingMin, setFreeShippingMin] = useState<string>(method.freeShippingMin || "")
    const [estimatedTime, setEstimatedTime] = useState<string>(method.estimatedTime || "")

    const handleCancel = () => {
        if (onCancel) onCancel(index)
    }

    const handleSave = () => {
        const payload: ShippingMethod = {
            providers: selectedProviders,
            minPurchase,
            freeShippingMin,
            estimatedTime,
        }
        if (onSave) onSave(index, payload)
    }

    return (
        <>
            <AnimatedTags
                initialTags={initialTags}
                selectedTags={selectedProviders}
                onChange={setSelectedProviders}
            />
            <div className="grid grid-cols-1 gap-3 mt-10">
                <InputField
                    label="Mínimo $ para delivery"
                    name="min_purchase"
                    inputMode="numeric"
                    type="number"
                    placeholder="Ej: 10000"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <InputField
                    label="Mínimo $ envío gratis"
                    name="free_shipping_min"
                    inputMode="numeric"
                    type="number"
                    placeholder="Ej: 20000"
                    value={freeShippingMin}
                    onChange={(e) => setFreeShippingMin(e.target.value.replace(/[^0-9]/g, ""))}
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
                /* onChange={handleTimeChange} */
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

const SettingsFormPanel = () => {

    const [attentionDates, setAttentionDates] = useState<AttentionDateType[]>([])
    const [isAddingDate, setIsAddingDate] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isOpen24Hours, setIsOpen24Hours] = useState(true)


    const handleIsOpen24Hours = () => {
        setIsOpen24Hours(true)
    }

    const handleIsNotOpen24Hours = () => {
        setIsOpen24Hours(false)
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
        setAttentionDates(attentionDates.filter((_date, i) => i !== index))
        setEditingIndex(null)
    }

    const handleSaveDate = (index: number, startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, days: string[]) => {
        setAttentionDates(attentionDates.map((date, i) => i === index ? { ...date, startTime, endTime, days } : date))
        setIsAddingDate(false)
        setEditingIndex(null)
    }

    const handleDeleteDate = (index: number) => {
        setAttentionDates(attentionDates.filter((_date, i) => i !== index))
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 text-center justify-center mb-8">
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

const ContactFormPanel = () => {
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
                            startContent={<Phone />}
                            isRequired
                        />
                        <InputField
                            name="contact_info.contact_email"
                            label="Email"
                            placeholder="Ej: test@example.com"
                            startContent={<Mail />}
                            type="email"
                            isRequired
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
                            startContent={<Facebook />}
                        />
                        <InputField
                            name="contact_info.instagram_url"
                            label="Instagram"
                            placeholder="Ej: https://www.instagram.com/your-page"
                            startContent={<Instagram />}
                            type="email"
                        />
                        <InputField
                            name="contact_info.x_url"
                            label="X (Twitter)"
                            placeholder="Ej: https://x.com/your-page"
                            startContent={<Twitter />}
                            type="url"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

const AddressFormPanel = () => {

    const { setValue, getValues } = useFormContext()
    const [isPhysicalStore, setIsPhysicalStore] = useState(getValues("address_info.is_physical_store") || false)

    const handlePhysicalStore = () => {
        setIsPhysicalStore(true)
        setValue("address_info.is_physical_store", true)
    }

    const handleOnlineStore = () => {
        setIsPhysicalStore(false)
        setValue("address_info.is_physical_store", false)
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 text-center justify-center mb-8">
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
            <AnimatePresence>
                {isPhysicalStore && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100, position: "absolute" }}
                        className="space-y-4"
                    >
                        <InputField
                            name="address_info.address"
                            label="Address"
                            placeholder="Ej: 123 Main St"
                            startContent={<MapPin />}
                            isRequired
                        />
                        <InputField
                            name="address_info.city"
                            label="City"
                            placeholder="Ej: New York"
                            startContent={<MapPin />}
                            isRequired
                        />
                        <InputField
                            name="address_info.province"
                            label="Province"
                            placeholder="Ej: New York"
                            startContent={<MapPin />}
                            isRequired
                        />
                        <InputField
                            name="address_info.country"
                            label="Country"
                            placeholder="Ej: United States"
                            startContent={<MapPin />}
                            isRequired
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

const BasicInfoFormPanel = () => {

    const { setValue } = useFormContext()
    const [logo, setLogo] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const handleUpload = async (file: File) => {
        try {
            toast.loading('Subiendo logo...')
            setIsUploading(true)
            setUploadProgress(0)
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'store-logo')

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

    const camera = useCamera({
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

    const handleCamera = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        camera.openCamera();
    }

    const handleFileSelect = (files: File[]) => {
        if (files.length === 0) return
        const file = files[files.length - 1]
        setLogo([file])
        setValue("basic_info.logo", file)
        handleUpload(file)
    }

    const handleDeleteLogo = () => {
        setLogo([])
        setValue("basic_info.logo", "")
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-10 mb-8">
                <div className="space-y-2">
                    <FileUpload value={logo} onValueChange={handleFileSelect}>
                        <FileUploadDropzone className={cn("rounded-full aspect-square group/dropzone relative", isUploading && "animate-pulse")}>
                            {logo.length > 0 ? (
                                <FileUploadItem value={logo[0]} className="absolute p-0 w-full h-full border-none">
                                    <FileUploadItemPreview className="w-full h-full rounded-full" />
                                </FileUploadItem>
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
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <IconButton icon={Camera} onClick={handleCamera} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Click para tomar foto
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </FileUploadDropzone>
                    </FileUpload>
                    {isUploading && <Progress value={uploadProgress} />}
                    {logo.length > 0 && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <p className="truncate">{logo[0].name}</p>
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
                <CameraComponent
                    {...camera.cameraProps}
                    title="Tomar foto para logo"
                />
                <div className="space-y-4">
                    <InputField
                        name="basic_info.name"
                        label="Name"
                        placeholder="Ej: My Store"
                        startContent={<StoreIcon />}
                        isRequired
                    />
                    <InputField
                        name="basic_info.subdomain"
                        label="URL"
                        placeholder="Ej: my-store"
                        startContent={<Globe />}
                        endContent={(
                            <span>
                                .lanzate.com
                            </span>
                        )}
                        isRequired
                    />
                </div>
            </div>
            <InputField
                name="basic_info.description"
                label="Description"
                placeholder="Ej: My Store Description"
                isTextArea
            />
        </>
    )
}

const FormPane = ({ children }: FormPaneProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100, position: "absolute" }}
            className="top-0 left-0 w-full"
        >
            {children}
        </motion.div>
    )
}

const CreateStoreFormStepsNavigator = ({
    canGoToNextStep, canGoToPrevStep, goToNextStep, goToPrevStep, step, setStep
}: CreateStoreFormStepsNavigatorProps) => {

    const { formState: { errors, isValid, isSubmitting } } = useFormContext()

    const handleStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        const step = e.currentTarget.dataset.step
        if (!step) return
        setStep(Number(step))
    }


    return (
        <div className="flex justify-between w-full">
            <div className="flex items-center gap-2">

                <Tooltip>
                    <TooltipTrigger asChild>
                        <IconButton
                            type="button"
                            icon={ArrowLeft}
                            onClick={goToPrevStep}
                            disabled={!canGoToPrevStep}
                            className={cn(canGoToPrevStep ? "" : "cursor-not-allowed opacity-50")}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        Previous step
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex items-center gap-4 justify-center flex-1">
                <IconButton
                    type="button"
                    icon={Store}
                    onClick={handleStep}
                    data-step={1}
                    active={step === 1}
                    className={cn(
                        step === 1 ? "text-primary" : "text-muted-foreground",
                        errors.basic_info ? "text-destructive" : ""
                    )}
                />
                <IconButton
                    type="button"
                    icon={MapPin}
                    onClick={handleStep}
                    data-step={2}
                    active={step === 2}
                    className={cn(
                        step === 2 ? "text-primary" : "text-muted-foreground",
                        errors.address_info ? "text-destructive" : ""
                    )}
                />
                <IconButton
                    type="button"
                    icon={Contact2}
                    onClick={handleStep}
                    data-step={3}
                    active={step === 3}
                    className={cn(
                        step === 3 ? "text-primary" : "text-muted-foreground",
                        errors.contact_info ? "text-destructive" : ""
                    )}
                />
                <IconButton
                    type="button"
                    icon={Clock}
                    onClick={handleStep}
                    data-step={4}
                    active={step === 4}
                    className={cn(
                        step === 4 ? "text-primary" : "text-muted-foreground",
                        errors.settings ? "text-destructive" : ""
                    )}
                />
                <IconButton
                    type="button"
                    icon={Settings}
                    onClick={handleStep}
                    data-step={5}
                    active={step === 5}
                    className={cn(
                        step === 5 ? "text-primary" : "text-muted-foreground",
                        errors.settings ? "text-destructive" : ""
                    )}
                />
                {isValid && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IconButton
                                type="submit"
                                icon={isSubmitting ? Loader2 : Check}
                                iconClassName={isSubmitting ? "animate-spin" : undefined}
                                disabled={isSubmitting}
                                className={cn(isSubmitting ? "cursor-not-allowed opacity-50" : "")}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            {isSubmitting ? "Submitting..." : "Create store"}
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton
                        type="button"
                        icon={ArrowRight}
                        onClick={goToNextStep}
                        disabled={!canGoToNextStep}
                        className={cn("ml-auto", canGoToNextStep ? "" : "cursor-not-allowed opacity-50")}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Next step
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

const CreateStoreForm = ({ step }: { step: number }) => {

    return (
        <fieldset className="relative overflow-hidden py-4">
            <AnimatePresence>
                {step === 1 && (
                    <FormPane key="step-1">
                        <BasicInfoFormPanel />
                    </FormPane>
                )}
                {step === 2 && (
                    <FormPane key="step-2">
                        <AddressFormPanel />
                    </FormPane>
                )}
                {step === 3 && (
                    <FormPane key="step-3">
                        <ContactFormPanel />
                    </FormPane>
                )}
                {step === 4 && (
                    <FormPane key="step-4">
                        <SettingsFormPanel />
                    </FormPane>
                )}
                {step === 5 && (
                    <FormPane key="step-5">
                        <ShippingFormPanel />
                    </FormPane>
                )}
            </AnimatePresence>
        </fieldset>
    )
}

const CreateStoreButtonNew = ({ userId }: { userId: number }) => {

    const [step, { goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep, setStep }] = useStep(5)

    const handleCreateStore = async (data: CreateStoreFormValues) => {
        const { error, message, payload } = await createStore(data, userId)
        if (error) {
            return {
                error: true,
                message: message,
                payload: null
            }
        }
        return {
            error: false,
            message: "Store created successfully",
            payload: payload
        }
    }

    const descriptions = {
        1: "Choose a name, logo and shipping methods to get started; you can edit your store details later.",
        2: "Choose whether this is a physical store or an online store and add your address information.",
        3: "Add your contact information and social media links so customers can contact you.",
        4: "Choose attention dates and hours so customers know when you are open.",
        5: "Choose your shipping methods and add your payment methods so customers can buy your products.",
    }

    const titleSlugs = {
        1: "Basic",
        2: "Address",
        3: "Contact",
        4: "Hours",
        5: "Delivery",
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    <span>Create Store</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Store - {titleSlugs[step as keyof typeof titleSlugs]}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p>{descriptions[step as keyof typeof descriptions]}</p>
                </DialogDescription>
                <Form<CreateStoreFormValues>
                    contentButton="Create Store"
                    submitButton={false}
                    resolver={yupResolver(createStoreSchema)}
                    formAction={handleCreateStore}
                >
                    <CreateStoreForm step={step} />
                    <DialogFooter>
                        <CreateStoreFormStepsNavigator
                            canGoToNextStep={canGoToNextStep}
                            canGoToPrevStep={canGoToPrevStep}
                            goToNextStep={goToNextStep}
                            goToPrevStep={goToPrevStep}
                            setStep={setStep}
                            step={step}
                        />
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateStoreButtonNew