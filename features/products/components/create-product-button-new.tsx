"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Stepper, { Step } from "@/components/Stepper"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useCallback, useContext, useEffect, useMemo, useState, createContext } from "react"
import { useFormContext } from "react-hook-form"
import { Form, InputField } from "@/features/layout/components"
import { Check, Loader, Box, Image as ImageIcon, Plus, Globe, Upload, Camera, Trash, Tag, Barcode, DollarSign, Package, Settings, X, Ruler, Shirt, Palette, Sparkles, PlusIcon, CheckIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { FileUpload, FileUploadCameraTrigger, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Progress } from "@/components/ui/progress"
import { useCamera } from "@/features/auth/hooks/use-camera"
import CameraComponent from "@/features/auth/components/avatar/camera-component"
import { toast } from "sonner"
import { generate } from "random-words"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import CategoryTagsSelect from "@/features/store-landing/components/category-tags-select"
import { getCategories } from "@/features/store-landing/actions/getCategories"
import AnimatedTags from "@/src/components/smoothui/ui/AnimatedTags"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tags, TagsContent, TagsEmpty, TagsGroup, TagsInput, TagsItem, TagsList, TagsTrigger, TagsValue } from "@/src/components/ui/shadcn-io/tags"
import { get as rhfGet } from "react-hook-form"
import InputColor from "@/components/color-input"

const CreateProductContext = createContext<CreateProductContextType | null>(null)
const hexColorRegex = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/

const basicInfoSchema = yup.object({
    basic_info: yup.object({
        name: yup.string().required("Name is required"),
        slug: yup.string().required("Slug is required"),
        sku: yup.string().optional(),
        barcode: yup.string().optional(),
        description: yup.string().max(255, "Description must be less than 255 characters long").optional(),
        image: yup
            .mixed()
            .test("image-type", "Unsupported file type. Use JPG, PNG, GIF or WebP", (value) => {
                if (value instanceof File) {
                    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
                    return allowed.includes(value.type)
                }
                return true
            })
            .test("image-size", "File too large (max 5MB)", (value) => {
                if (value instanceof File) {
                    return value.size <= 5 * 1024 * 1024
                }
                return true
            }).nullable().optional(),
    })
})

const pricingSchema = yup.object({
    pricing: yup.object({
        price: yup
            .number()
            .typeError("Price must be a number")
            .min(0, "Price must be greater or equal to 0")
            .required("Price is required"),
        stock: yup
            .number()
            .typeError("Stock must be a number")
            .integer("Stock must be an integer")
            .min(0, "Stock must be greater or equal to 0")
            .required("Stock is required"),
    })
})

const emptySchema = yup.object({})

const extraSchema = yup.object({
    extra: yup.object({
        dimensions: yup.object({
            peso: yup.object({ value: yup.string().optional(), unit: yup.string().optional() }).optional(),
            alto: yup.object({ value: yup.string().optional(), unit: yup.string().optional() }).optional(),
            ancho: yup.object({ value: yup.string().optional(), unit: yup.string().optional() }).optional(),
            largo: yup.object({ value: yup.string().optional(), unit: yup.string().optional() }).optional(),
            profundidad: yup.object({ value: yup.string().optional(), unit: yup.string().optional() }).optional(),
            circumferencia: yup.object({ value: yup.string().optional(), unit: yup.string().optional() }).optional(),
        }).optional(),
        expiration: yup.object({
            date: yup.string().optional(),
        }).optional(),
        sizes: yup.object({
            talle: yup.array(yup.string()).optional(),
            tamano: yup.array(yup.string()).optional(),
        }).optional(),
        sensorial: yup.object({
            flavors: yup.array(yup.string()).optional(),
            fragrances: yup.array(yup.string()).optional(),
        }).optional(),
        surface: yup.object({
            colors: yup.array(
                yup.object({
                    value: yup
                        .string()
                        .required("Color requerido")
                        .matches(hexColorRegex, "Color inválido"),
                    name: yup
                        .string()
                        .max(64, "Máximo 64 caracteres")
                        .optional(),
                })
            ).default([]).optional(),
            materials: yup.array(yup.mixed()).default([]).optional(),
        }).optional(),
        // keep space for other groups; not strictly validated here
    }).optional(),
    extra_meta: yup.object({
        selectedDimensionTags: yup.array(yup.string()).default([]).optional(),
        selectedSurfaceTags: yup.array(yup.string()).default([]).optional(),
        selectedSizeTags: yup.array(yup.string()).default([]).optional(),
        selectedSensorialTags: yup.array(yup.string()).default([]).optional(),
    }).optional(),
}).test('require-colors-when-selected', 'Agrega al menos un color', function (obj) {
    type ExtraSchemaShape = {
        extra?: { surface?: { colors?: { value: string; name?: string }[] } }
        extra_meta?: { selectedSurfaceTags?: string[] }
    }
    const shape = (obj as unknown) as ExtraSchemaShape
    const selectedSurfaceTags = shape?.extra_meta?.selectedSurfaceTags
    const requiresColor = Array.isArray(selectedSurfaceTags) && selectedSurfaceTags.includes('Color')
    if (!requiresColor) return true
    const colors = shape?.extra?.surface?.colors
    return Array.isArray(colors) && colors.length > 0
}).test('require-materials-when-selected', 'Agrega al menos un material', function (obj) {
    type ExtraSchemaShape2 = {
        extra?: { surface?: { colors?: { value: string; name?: string }[]; materials?: unknown[] } }
        extra_meta?: { selectedSurfaceTags?: string[] }
    }
    const shape2 = (obj as unknown) as ExtraSchemaShape2
    const selectedSurfaceTags2 = shape2?.extra_meta?.selectedSurfaceTags
    const requiresMaterials = Array.isArray(selectedSurfaceTags2) && selectedSurfaceTags2.includes('Material')
    if (!requiresMaterials) return true
    const materials = shape2?.extra?.surface?.materials
    return Array.isArray(materials) && materials.length > 0
})

type ExtraFormType = yup.InferType<typeof extraSchema>
type EmptyFormType = yup.InferType<typeof emptySchema>
type PricingFormType = yup.InferType<typeof pricingSchema>
type BasicInfoFormType = yup.InferType<typeof basicInfoSchema>

const unitSizeOptions = [
    { label: "mm", value: "mm" },
    { label: "cm", value: "cm" },
    { label: "m", value: "m" },
    { label: "in", value: "in" },
    { label: "ft", value: "ft" },
]

const unitWeightOptions = [
    { label: "mg", value: "mg" },
    { label: "g", value: "g" },
    { label: "kg", value: "kg" },
    { label: "oz", value: "oz" },
    { label: "lb", value: "lb" },
]

const unitVolumeOptions = [
    { label: "ml", value: "ml" },
    { label: "lt", value: "lt" },
]

const unitOptionsByKey: Record<string, { label: string; value: string }[]> = {
    peso: [
        ...unitWeightOptions,
        ...unitVolumeOptions,
    ],
    alto: [
        ...unitSizeOptions,
    ],
    ancho: [
        ...unitSizeOptions,
    ],
    largo: [
        ...unitSizeOptions,
    ],
    profundidad: [
        ...unitSizeOptions,
    ],
    circumferencia: [
        ...unitSizeOptions,
    ],
}

const tagToKey: Record<string, string> = {
    Peso: "peso",
    Alto: "alto",
    Ancho: "ancho",
    Largo: "largo",
    Profundidad: "profundidad",
    Circumferencia: "circumferencia",
}

type MediaItem = { file?: File; url?: string }

type MediaState = { items: MediaItem[]; primaryIndex: number | null }

type CreateProductFormValues = {
    basic_info?: Record<string, unknown>
    media?: Record<string, unknown>
    pricing?: { price?: number; stock?: number }
    settings?: { is_active?: boolean; is_featured?: boolean; is_published?: boolean }
    categories?: { label: string; value: string }[]
    extra?: { dimensions?: Record<string, { value?: number | string; unit?: string }> }
    extra_meta?: { selectedDimensionTags?: string[] }
}

type CreateProductContextType = {
    values: Partial<CreateProductFormValues>
    setValues: (partial: Partial<CreateProductFormValues>) => void
    availableCategories: { id: string; label: string }[]
    setAvailableCategories: (opts: { id: string; label: string }[]) => void
    isStepValid: Record<number, boolean>
    setStepValid: (step: number, valid: boolean) => void
}

type CreateProductFormProps = {
    step: number
    setStep: (s: number) => void
    onSubmitAll: (data: CreateProductFormValues) => Promise<{ error: boolean; message: string; payload?: unknown } | undefined>
    storeId: number
}

type UnitSelectProps = {
    name: string
    options: { label: string; value: string }[]
    placeholder?: string
    className?: string
}

type DimensionFieldRowProps = {
    tag: string
}

type SizesTagsProps = {
    name: string
    label: string
    preset: { id: string; label: string }[]
}

type FreeTagsProps = {
    name: string
    label: string
    preset: { id: string; label: string }[]
}

type VariantRow = {
    attributes: Record<string, string>
}

type StepIndicatorProps = {
    step: number
    currentStep: number
    onStepClick: (s: number) => void
    disabled: boolean
}

function useCreateProductContext() {
    const ctx = useContext(CreateProductContext)
    if (!ctx) throw new Error("CreateProductContext not found")
    return ctx
}

function CreateProductProvider({ children, storeId }: { children: React.ReactNode; storeId: number }) {
    const [values, setValuesState] = useState<Partial<CreateProductFormValues>>({})
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})
    const [availableCategories, setAvailableCategoriesState] = useState<{ id: string; label: string }[]>([])

    const setValues = useCallback((partial: Partial<CreateProductFormValues>) => {
        setValuesState(prev => {
            // Shallow compare arrays of categories by id to avoid churn
            const next: Partial<CreateProductFormValues> = { ...prev }
            if (partial.categories) {
                const a = prev.categories || []
                const b = partial.categories || []
                const sameLength = a.length === b.length
                const sameIds = sameLength && a.every((x, i) => x.value === b[i]?.value)
                if (!sameLength || !sameIds) next.categories = b
            }
            // Compare media state (items length, urls, primaryIndex)
            const prevMedia = prev.media as unknown as MediaState | undefined
            const newMedia = partial.media as unknown as MediaState | undefined
            if (newMedia) {
                let mediaChanged = false
                if (!prevMedia) mediaChanged = true
                else {
                    mediaChanged = prevMedia.primaryIndex !== newMedia.primaryIndex ||
                        (prevMedia.items?.length || 0) !== (newMedia.items?.length || 0) ||
                        (prevMedia.items || []).some((it, idx) => {
                            const other = newMedia.items[idx]
                            const a = it?.url || (it?.file as unknown as File | undefined)?.name
                            const b = other?.url || (other?.file as unknown as File | undefined)?.name
                            return a !== b
                        })
                }
                if (mediaChanged) next.media = partial.media
            }
            for (const key of Object.keys(partial) as (keyof CreateProductFormValues)[]) {
                if (key === 'categories') continue
                if (key === 'media') continue
                if (partial[key] !== prev[key]) (next as Record<keyof CreateProductFormValues, unknown>)[key] = partial[key] as unknown
            }
            // If nothing changed, return prev
            const changed = (Object.keys(next) as (keyof CreateProductFormValues)[]).some(k => next[k] !== (prev as Partial<CreateProductFormValues>)[k])
            return changed ? next : prev
        })
    }, [])

    const setAvailableCategories = useCallback((opts: { id: string; label: string }[]) => {
        setAvailableCategoriesState(opts)
    }, [])

    useEffect(() => {
        let mounted = true
        const refresh = async () => {
            if (!storeId) return
            try {
                const { payload, error } = await getCategories(storeId)
                if (error || !mounted) return
                const options = (payload || []).map((c: { id: number; name: string }) => ({ id: String(c.id), label: c.name }))
                setAvailableCategoriesState(prev => {
                    const sameLength = prev.length === options.length
                    const same = sameLength && prev.every((p, i) => p.id === options[i]?.id && p.label === options[i]?.label)
                    return same ? prev : options
                })
            } catch {
                // silent refresh
            }
        }
        // Always refresh in background; keeps previous options as initial cache
        refresh()
        return () => { mounted = false }
    }, [storeId])

    const setStepValid = useCallback((step: number, valid: boolean) => {
        setIsStepValid(prev => ({ ...prev, [step]: valid }))
    }, [])

    return (
        <CreateProductContext.Provider value={{ values, setValues, availableCategories, setAvailableCategories, isStepValid, setStepValid }}>
            {children}
        </CreateProductContext.Provider>
    )
}

function UnitSelect({ name, options, placeholder = "Unidad", className }: UnitSelectProps) {
    const { watch, setValue } = useFormContext()
    const current = watch(name) as string | undefined
    return (
        <Select value={current} onValueChange={(val) => setValue(name as never, val as never, { shouldDirty: true, shouldValidate: true })}>
            <SelectTrigger className={cn("", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function DimensionFieldRow({ tag }: DimensionFieldRowProps) {
    const { watch, setValue } = useFormContext()
    const key = tagToKey[tag]
    const baseName = `extra.dimensions.${key}`
    const unitName = `${baseName}.unit`
    const valueName = `${baseName}.value`
    const unitVal = watch(unitName) as string | undefined
    useEffect(() => {
        if (!unitVal) {
            const first = unitOptionsByKey[key]?.[0]?.value
            if (first) setValue(unitName as never, first as never, { shouldDirty: true })
        }
    }, [unitVal, key, unitName, setValue])
    return (
        <div className="flex items-end">
            <div className="flex-1">
                <InputField
                    name={valueName}
                    label={tag}
                    placeholder={`Ej: valor de ${tag.toLowerCase()}`}
                    type="number"
                    inputMode="numeric"
                    className="!rounded-r-none"
                    onChange={(e) => {
                        setValue(valueName as never, e.target.value as never, { shouldDirty: true, shouldValidate: true })
                    }}
                />
            </div>
            <UnitSelect name={unitName} options={unitOptionsByKey[key] || []} className="!rounded-l-none !border-l-0 !h-[40px] mb-4" />
        </div>
    )
}

function ExpirationDateFieldRow() {
    const baseName = `extra.expiration`
    const valueName = `${baseName}.date`
    return (
        <div className="flex items-end">
            <div className="flex-1">
                <InputField
                    name={valueName}
                    label={"Fecha de vencimiento"}
                    placeholder={"Ej: 2026-12-31"}
                    type="date"
                    inputMode="none"
                />
            </div>
        </div>
    )
}

function SizesTags({ name, label, preset }: SizesTagsProps) {
    const { getValues, setValue, setError, clearErrors, formState: { errors } } = useFormContext()
    const [options, setOptions] = useState(preset)
    const [selected, setSelected] = useState<string[]>(() => (getValues(name as never) as string[] | undefined) || [])
    const [input, setInput] = useState("")
    const error = rhfGet(errors, name) as { message?: string } | undefined

    const applySelection = (next: string[]) => {
        setSelected(next)
        setValue(name as never, next as never, { shouldDirty: true, shouldValidate: true })
        if (next.length === 0) setError(name as never, { type: 'required', message: 'Selecciona al menos una opción' })
        else clearErrors(name as never)
    }

    const handleRemove = (id: string) => {
        const next = selected.filter(v => v !== id)
        applySelection(next)
    }

    const handleSelect = (id: string) => {
        const next = selected.includes(id) ? selected.filter(v => v !== id) : [...selected, id]
        applySelection(next)
    }

    const handleCreate = () => {
        const labelValue = (input || "").trim()
        if (!labelValue) return
        const id = labelValue
        if (!options.some(o => o.id === id)) setOptions(prev => [...prev, { id, label: labelValue }])
        if (!selected.includes(id)) applySelection([...selected, id])
        setInput("")
    }

    const placeholder = "Escribe para agregar…"

    return (
        <div className="flex flex-col gap-1 w-full">
            <Label>{label}</Label>
            <Tags>
                <TagsTrigger className="!bg-transparent">
                    {selected.map((id) => (
                        <TagsValue key={id} onRemove={() => handleRemove(id)}>
                            {options.find(o => o.id === id)?.label || id}
                        </TagsValue>
                    ))}
                    {selected.length === 0 && (
                        <span className="flex items-center gap-2 px-2 py-px text-muted-foreground">
                            <Tag size={14} />
                            Selecciona opciones…
                        </span>
                    )}
                </TagsTrigger>
                <TagsContent>
                    <TagsInput onValueChange={setInput} placeholder={placeholder} />
                    <TagsList>
                        <TagsEmpty>
                            <button className="mx-auto flex cursor-pointer items-center gap-2" onClick={handleCreate} type="button">
                                <PlusIcon className="text-muted-foreground" size={14} />
                                Crear: {input}
                            </button>
                        </TagsEmpty>
                        <TagsGroup>
                            {options.map((opt) => (
                                <TagsItem key={opt.id} onSelect={() => handleSelect(opt.id)} value={opt.id}>
                                    {opt.label}
                                    {selected.includes(opt.id) && (
                                        <CheckIcon className="text-muted-foreground" size={14} />
                                    )}
                                </TagsItem>
                            ))}
                        </TagsGroup>
                    </TagsList>
                </TagsContent>
            </Tags>
            {error?.message && <p className="text-xs text-red-500">{error.message}</p>}
        </div>
    )
}

function FreeTags({ name, label, preset }: FreeTagsProps) {
    const { getValues, setValue } = useFormContext()
    const [options, setOptions] = useState(preset)
    const [selected, setSelected] = useState<string[]>(() => (getValues(name as never) as string[] | undefined) || [])
    const [input, setInput] = useState("")

    const applySelection = (next: string[]) => {
        setSelected(next)
        setValue(name as never, next as never, { shouldDirty: true, shouldValidate: false })
    }

    const handleRemove = (id: string) => {
        const next = selected.filter(v => v !== id)
        applySelection(next)
    }

    const handleSelect = (id: string) => {
        const next = selected.includes(id) ? selected.filter(v => v !== id) : [...selected, id]
        applySelection(next)
    }

    const handleCreate = () => {
        const labelValue = (input || "").trim()
        if (!labelValue) return
        const id = labelValue
        if (!options.some(o => o.id === id)) setOptions(prev => [...prev, { id, label: labelValue }])
        if (!selected.includes(id)) applySelection([...selected, id])
        setInput("")
    }

    const placeholder = "Escribe para agregar…"

    return (
        <div className="flex flex-col gap-1 w-full">
            <Label>{label}</Label>
            <Tags>
                <TagsTrigger className="!bg-transparent">
                    {selected.map((id) => (
                        <TagsValue key={id} onRemove={() => handleRemove(id)}>
                            {options.find(o => o.id === id)?.label || id}
                        </TagsValue>
                    ))}
                    {selected.length === 0 && (
                        <span className="flex items-center gap-2 px-2 py-px text-muted-foreground">
                            <Tag size={14} />
                            Selecciona opciones…
                        </span>
                    )}
                </TagsTrigger>
                <TagsContent>
                    <TagsInput onValueChange={setInput} placeholder={placeholder} />
                    <TagsList>
                        <TagsEmpty>
                            <button className="mx-auto flex cursor-pointer items-center gap-2" onClick={handleCreate} type="button">
                                <PlusIcon className="text-muted-foreground" size={14} />
                                Crear: {input}
                            </button>
                        </TagsEmpty>
                        <TagsGroup>
                            {options.map((opt) => (
                                <TagsItem key={opt.id} onSelect={() => handleSelect(opt.id)} value={opt.id}>
                                    {opt.label}
                                    {selected.includes(opt.id) && (
                                        <CheckIcon className="text-muted-foreground" size={14} />
                                    )}
                                </TagsItem>
                            ))}
                        </TagsGroup>
                    </TagsList>
                </TagsContent>
            </Tags>
        </div>
    )
}

function ColorsField() {
    const { watch, setValue, setError, clearErrors, formState: { errors } } = useFormContext()
    const baseName = `extra.surface.colors`
    const arr = (watch(baseName) as { value: string; name?: string }[] | undefined) || []
    const colorsError = rhfGet(errors, baseName) as { message?: string } | undefined
    const [editing, setEditing] = useState<{ value: string; name: string } | null>(null)

    const startAdd = () => setEditing({ value: '#000000', name: '' })
    const cancelAdd = () => setEditing(null)
    const confirmAdd = () => {
        if (!editing) return
        const valid = hexColorRegex.test(editing.value) && editing.name.length <= 64
        if (!valid) {
            if (!hexColorRegex.test(editing.value)) setError(baseName as never, { type: 'required', message: 'Color inválido' })
            else setError(baseName as never, { type: 'max', message: 'Máximo 64 caracteres' })
            return
        }
        const next = [...arr, { value: editing.value, name: editing.name }]
        setValue(baseName as never, next as never, { shouldDirty: true, shouldValidate: true })
        clearErrors(baseName as never)
        setEditing(null)
    }
    const removeColor = (index: number) => {
        const next = arr.filter((_v, i) => i !== index)
        setValue(baseName as never, next as never, { shouldDirty: true, shouldValidate: true })
    }

    return (
        <div className="flex flex-col gap-3">
            {arr.length === 0 && !editing && (
                <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                    No hay colores agregados
                </div>
            )}

            {arr.length > 0 && !editing && (
                <div className="flex flex-wrap gap-4">
                    {arr.map((c, i) => (
                        <div key={`${c.value}-${i}`} className="flex flex-col items-center gap-1">
                            <div
                                className="size-10 rounded-full border"
                                style={{ backgroundColor: c.value }}
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-foreground/80">{c.name || c.value}</span>
                                <Button variant="ghost" size="icon" className="size-6" onClick={() => removeColor(i)}>
                                    <Trash className="size-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editing && (
                <div className="flex flex-col gap-3">
                    <InputColor
                        value={editing.value}
                        onChange={(hex) => setEditing(prev => prev ? { ...prev, value: hex } : prev)}
                        onBlur={() => void 0}
                        label={`Nuevo color`}
                        error={undefined}
                        nameValue={editing.name}
                        onNameChange={(val) => setEditing(prev => prev ? { ...prev, name: val } : prev)}
                        onNameBlur={() => void 0}
                        nameLabel="Nombre"
                        namePlaceholder="Ej: Azul acero"
                    />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={confirmAdd}>
                            <Check className="mr-1 size-4" /> Confirmar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelAdd}>Cancelar</Button>
                    </div>
                </div>
            )}

            {!editing && (
                <Button variant="outline" size="sm" onClick={startAdd} className="w-fit">
                    <Plus className="mr-1 size-4" /> Agregar color
                </Button>
            )}

            {colorsError?.message && <p className="text-xs text-red-500">{colorsError.message}</p>}
        </div>
    )
}

function MaterialsField() {
    const { watch, setValue } = useFormContext()
    const baseName = `extra.surface.materials`
    type MaterialItem = { file?: File; url?: string }
    const arr = (watch(baseName) as MaterialItem[] | undefined) || []
    const [editing, setEditing] = useState(false)

    const handleDeleteAt = (index: number) => {
        const next = arr.filter((_v, i) => i !== index)
        setValue(baseName as never, next as never, { shouldDirty: true, shouldValidate: true })
    }

    const handleCamera = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleFilesSelected = (files: File[]) => {
        if (!files || files.length === 0) return
        const file = files[files.length - 1]
        const next = [...arr, { file }]
        setValue(baseName as never, next as never, { shouldDirty: true, shouldValidate: true })
        setEditing(false)
    }

    return (
        <div className="flex flex-col gap-3">
            {arr.length === 0 && !editing && (
                <>
                    <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                        No hay materiales agregados
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="w-fit">
                        <Plus className="mr-1 size-4" /> Agregar material
                    </Button>
                </>
            )}
            <div className="flex flex-wrap items-center gap-4">
                {arr.map((item, index) => (
                    <div key={index} className="relative">
                        {item.file ? (
                            <img
                                alt={`material-${index}`}
                                src={URL.createObjectURL(item.file)}
                                className="size-16 rounded-full object-cover border"
                            />
                        ) : item.url ? (
                            <img alt={`material-${index}`} src={item.url} className="size-16 rounded-full object-cover border" />
                        ) : (
                            <div className="size-16 rounded-full border bg-muted" />
                        )}
                        <button
                            type="button"
                            className="-right-1 -top-1 absolute grid place-items-center rounded-full border bg-background/90 p-1"
                            onClick={() => handleDeleteAt(index)}
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                ))}
                {editing && (
                    <FileUpload value={[]} onValueChange={handleFilesSelected}>
                        <FileUploadDropzone className={cn("rounded-full aspect-square group/dropzone relative max-xs:max-w-[100px] mx-auto size-28")}>
                            <div className="group-hover/dropzone:hidden flex flex-col items-center gap-1 text-center">
                                <ImageIcon className="text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Arrastra la imagen del material aqui</p>
                            </div>
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
                )}
            </div>
            {arr.length > 0 && !editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="w-fit">
                    <Plus className="mr-1 size-4" /> Agregar material
                </Button>
            )}
        </div>
    )
}

function BasicInfoFormPanel({ storeId }: { storeId: number }) {
    const { setStepValid, setValues: setCtxValues, values, setAvailableCategories, availableCategories } = useCreateProductContext()
    const { watch, setValue, getValues, trigger, formState: { isValid } } = useFormContext<BasicInfoFormType>()

    function slugify(input: string): string {
        return (input || "")
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-')
            .slice(0, 63)
    }

    const nameValue = watch('basic_info.name') as string | undefined
    const slugValue = watch('basic_info.slug') as string | undefined
    const imageValue = watch('basic_info.image') as unknown
    const [isSlugTouched, setIsSlugTouched] = useState(false)
    const [image, setImage] = useState<File[]>([])
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    useEffect(() => { setStepValid(1, isValid) }, [isValid, setStepValid])

    // Fallback: ensure step validity when both required fields are non-empty
    useEffect(() => {
        if ((nameValue || "").trim().length > 0 && (slugValue || "").trim().length > 0) {
            setStepValid(1, true)
        }
    }, [nameValue, slugValue, setStepValid])

    // Persist step values into wizard context
    useEffect(() => {
        const sub = watch((v) => setCtxValues({ basic_info: (v as BasicInfoFormType).basic_info }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    // Seed from context if present
    useEffect(() => {
        if (values.basic_info) {
            setValue('basic_info', values.basic_info as never, { shouldValidate: true })
            // ensure validation state reflects seeded values when reopening dialog
            trigger('basic_info')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generate default slug on first mount if empty
    useEffect(() => {
        const current = (getValues('basic_info.slug') as string | undefined) || ""
        if (!current || current.length === 0) {
            const rw = (generate({ exactly: 2, join: '-' }) as unknown as string) || ""
            const defaultSlug = slugify(rw)
            if (defaultSlug) setValue('basic_info.slug', defaultSlug, { shouldValidate: true })
        }
    }, [getValues, setValue])

    // Hydrate image controls from form
    useEffect(() => {
        if (imageValue instanceof File) {
            setImage([imageValue])
            setImageUrl(null)
        } else if (typeof imageValue === 'string' && imageValue.length > 0) {
            setImage([])
            setImageUrl(imageValue)
        } else {
            setImage([])
            setImageUrl(null)
        }
        // Keep media panel in sync: if basic_info.image changes, reflect as primary if different
        const currentMedia = (values.media as unknown as MediaState | undefined)
        const maybeItem: MediaItem | null = imageValue instanceof File ? { file: imageValue } : (typeof imageValue === 'string' && imageValue.length > 0 ? { url: imageValue } : null)
        if (!maybeItem) return
        const items = currentMedia?.items || []
        const existsIndex = items.findIndex(it => (it.url && it.url === maybeItem.url) || ((it.file as File | undefined)?.name && (it.file as File | undefined)?.name === (maybeItem.file as File | undefined)?.name))
        if (existsIndex >= 0) {
            if (currentMedia?.primaryIndex !== existsIndex) setCtxValues({ media: { items, primaryIndex: existsIndex } as unknown as Record<string, unknown> })
        } else {
            const nextItems = [maybeItem, ...items]
            setCtxValues({ media: { items: nextItems, primaryIndex: 0 } as unknown as Record<string, unknown> })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageValue])

    // Auto-generate slug from name until user edits slug directly
    useEffect(() => {
        if (isSlugTouched) return
        const currentSlug = (getValues('basic_info.slug') as string | undefined) || ""
        if (!nameValue || nameValue.trim().length === 0) return
        if (currentSlug && currentSlug.trim().length > 0) return
        const next = slugify(nameValue)
        setValue('basic_info.slug', next, { shouldValidate: true, shouldDirty: true })
    }, [nameValue, isSlugTouched, getValues, setValue])

    const handleUpload = async (_file: File) => {
        try {
            toast.loading('Subiendo imagen...')
            setIsUploading(true)
            setUploadProgress(0)
            void _file

            // const formData = new FormData()
            // formData.append('file', file)
            // formData.append('type', 'product-image')

            await new Promise((resolve) => setTimeout(resolve, 600))
            setUploadProgress(50)

            // TODO: Implementar upload real
            // const response = await fetch('/api/product-images', { method: 'POST', body: formData })
            // if (!response.ok) throw new Error('Error uploading file')
            // const data = await response.json()
            // setValue("basic_info.image", data.url)

            toast.dismiss()
            toast.success('Imagen subida (simulada)')
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
        uploadPath: 'product-images',
        onSuccess: (url) => {
            setValue("basic_info.image", url)
            setImage([])
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
        setImage([file])
        setValue("basic_info.image", file)
        handleUpload(file)
    }

    const handleDeleteImage = () => {
        setImage([])
        setImageUrl(null)
        setValue("basic_info.image", "")
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-10 mb-8">
                <div className="space-y-2">
                    <FileUpload value={image} onValueChange={handleFileSelect}>
                        <FileUploadDropzone className={cn("rounded-full aspect-square group/dropzone relative max-xs:max-w-[150px] mx-auto w-full", isUploading && "animate-pulse")}>
                            {image.length > 0 ? (
                                <FileUploadItem value={image[0]} className="absolute p-0 w-full h-full border-none">
                                    <FileUploadItemPreview className="w-full h-full rounded-full" />
                                </FileUploadItem>
                            ) : imageUrl ? (
                                <img src={imageUrl} alt="Image" className="w-full h-full rounded-full object-cover absolute" />
                            ) : (
                                <div className="group-hover/dropzone:hidden flex flex-col items-center gap-1 text-center">
                                    <ImageIcon className="text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Arrastra la imagen del producto aqui</p>
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
                    {(image.length > 0 || imageUrl) && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                            <p className="truncate">{image.length > 0 ? image[0].name : 'Imagen cargada'}</p>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <IconButton icon={Trash} onClick={handleDeleteImage} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Delete image
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </div>
                <CameraComponent
                    {...camera.cameraProps}
                    title="Tomar foto del producto"
                />
                <div className="space-y-4">
                    <InputField
                        name="basic_info.name"
                        label="Name"
                        placeholder="Ej: My Product"
                        startContent={<Box />}
                        isRequired
                    />
                    <InputField
                        name="basic_info.slug"
                        label="URL"
                        placeholder="ej: my-product"
                        type="url"
                        inputMode="url"
                        startContent={<Globe />}
                        onChange={(e) => {
                            setIsSlugTouched(true)
                            const sanitized = slugify(e.target.value)
                            setValue('basic_info.slug', sanitized, { shouldValidate: true, shouldDirty: true })
                        }}
                        endContent={(<span>/product</span>)}
                        isRequired
                    />
                </div>
            </div>
            <InputField
                name="basic_info.description"
                label="Description"
                placeholder="Ej: Breve descripción del producto"
                isTextArea
            />
            <div className="mt-2">
                <CategoryTagsSelect
                    storeId={storeId}
                    options={availableCategories}
                    onOptionsChange={setAvailableCategories}
                    defaultValue={(values.categories as { label: string; value: string }[] | undefined) || []}
                    onChange={(vals) => setCtxValues({ categories: vals })}
                />
            </div>
        </>
    )
}

function MediaFormPanel() {
    const { setStepValid, setValues: setCtxValues, values } = useCreateProductContext()
    const { formState: { isValid }, watch, setValue } = useFormContext<PricingFormType>()
    const [isActive, setIsActive] = useState<boolean>(() => (values.settings?.is_active ?? true))
    const [isFeatured, setIsFeatured] = useState<boolean>(() => (values.settings?.is_featured ?? false))
    const [isPublished, setIsPublished] = useState<boolean>(() => (values.settings?.is_published ?? true))

    useEffect(() => { setStepValid(2, isValid) }, [isValid, setStepValid])

    useEffect(() => {
        const sub = watch((v) => setCtxValues({ pricing: (v as PricingFormType).pricing }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    useEffect(() => {
        if (values.pricing) setValue('pricing', values.pricing as never, { shouldValidate: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Persist settings (switches) into wizard context
    useEffect(() => {
        const next = { is_active: isActive, is_featured: isFeatured, is_published: isPublished }
        const prev = values.settings || {}
        if (
            prev.is_active === next.is_active &&
            prev.is_featured === next.is_featured &&
            prev.is_published === next.is_published
        ) return
        setCtxValues({ settings: next })
    }, [isActive, isFeatured, isPublished, values.settings, setCtxValues])

    return (
        <>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="pricing.price"
                        label="Precio"
                        placeholder="Ej: 1999"
                        type="number"
                        inputMode="numeric"
                        startContent={<DollarSign />}
                        isRequired
                    />
                    <InputField
                        name="pricing.stock"
                        label="Stock"
                        placeholder="Ej: 10"
                        type="number"
                        inputMode="numeric"
                        startContent={<Package />}
                        isRequired
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="basic_info.sku"
                        label="SKU"
                        placeholder="Ej: SKU-123"
                        startContent={<Tag />}
                    />
                    <InputField
                        name="basic_info.barcode"
                        label="Código de barras"
                        placeholder="Ej: 1234567890123"
                        startContent={<Barcode />}
                    />
                </div>
            </div>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="is-active">Producto activo</Label>
                        <p className="text-sm text-muted-foreground">Hazlo disponible para la venta</p>
                    </div>
                    <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="is-featured">Producto destacado</Label>
                        <p className="text-sm text-muted-foreground">Resáltalo en secciones especiales</p>
                    </div>
                    <Switch id="is-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="is-published">Producto publicado</Label>
                        <p className="text-sm text-muted-foreground">Visible en tu tienda pública</p>
                    </div>
                    <Switch id="is-published" checked={isPublished} onCheckedChange={setIsPublished} />
                </div>
            </div>
        </>
    )
}

function MediaUploadPanel() {
    const { setStepValid, values, setValues: setCtxValues } = useCreateProductContext()
    const { setValue } = useFormContext()
    const [media, setMedia] = useState<MediaState>({ items: [], primaryIndex: null })

    useEffect(() => { setStepValid(3, true) }, [setStepValid])

    // Seed from provider: if there is an image in basic_info, use it as initial and primary
    useEffect(() => {
        const initial: MediaItem[] = []
        const logo = (values.basic_info?.image as unknown) as string | File | undefined
        if (logo instanceof File) initial.push({ file: logo })
        else if (typeof logo === 'string' && logo.length > 0) initial.push({ url: logo })

        const providerMedia = (values.media as unknown as MediaState | undefined)
        if (providerMedia && Array.isArray(providerMedia.items) && providerMedia.items.length > 0) {
            setMedia(providerMedia)
            return
        }

        if (initial.length > 0) {
            setMedia({ items: initial, primaryIndex: 0 })
            setCtxValues({ media: { items: initial, primaryIndex: 0 } as unknown as Record<string, unknown> })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFilesAdded = (newFiles: File[]) => {
        setMedia(prev => {
            // De-duplicate by file name
            const existingNames = new Set(prev.items.map(it => (it.file as File | undefined)?.name || it.url))
            const additions = newFiles.filter(f => !existingNames.has(f.name)).map(f => ({ file: f }))
            const items = [...prev.items, ...additions]
            const nextPrimary = prev.items.length === 0 ? 0 : (prev.primaryIndex ?? 0)
            const next: MediaState = { items, primaryIndex: nextPrimary }
            setCtxValues({ media: next as unknown as Record<string, unknown> })
            return next
        })
    }

    const handleDeleteAt = (index: number) => {
        setMedia(prev => {
            const items = prev.items.filter((_, i) => i !== index)
            let primaryIndex = prev.primaryIndex
            if (primaryIndex !== null) {
                if (index === primaryIndex) primaryIndex = items.length > 0 ? 0 : null
                else if (index < primaryIndex) primaryIndex = primaryIndex - 1
            }
            const next: MediaState = { items, primaryIndex }
            setCtxValues({ media: next as unknown as Record<string, unknown> })
            return next
        })
        // Reflect deletion on basic_info.image if primary removed
        const current = (values.media as unknown as MediaState | undefined)
        if (!current) return
        const wasPrimary = current.primaryIndex === index
        if (wasPrimary) {
            const newPrimary = current.items.filter((_, i) => i !== index)[0]
            const nextLogo = newPrimary?.url || (newPrimary?.file as File | undefined) || ""
            setValue("basic_info.image" as never, nextLogo as never, { shouldValidate: true })
        }
    }

    const handleMakePrimary = (index: number) => {
        setMedia(prev => {
            const next: MediaState = { ...prev, primaryIndex: index }
            setCtxValues({ media: next as unknown as Record<string, unknown> })
            return next
        })
    }

    return (
        <>
            <FileUpload value={media.items.map(i => i.file).filter(Boolean) as File[]} onValueChange={handleFilesAdded}>
                <FileUploadDropzone>
                    <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                            Explorar archivos
                        </Button>
                    </FileUploadTrigger>
                    <FileUploadCameraTrigger />
                </FileUploadDropzone>

                <div className="mt-4 grid grid-cols-1 gap-3">
                    <FileUploadList className="w-full">
                        {media.items.map((item, index) => (
                            <FileUploadItem key={index} value={(item.file as File) || new File([new Blob()], (item.url || `media-${index}`).toString())}>
                                <div className="flex w-full items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <FileUploadItemPreview />
                                        <FileUploadItemMetadata />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {media.primaryIndex === index ? (
                                            <span className="text-xs text-primary">Primaria</span>
                                        ) : (
                                            <Button variant="outline" size="sm" onClick={() => handleMakePrimary(index)}>Hacer primaria</Button>
                                        )}
                                        <FileUploadItemDelete asChild>
                                            <Button variant="ghost" size="icon" className="size-7" onClick={() => handleDeleteAt(index)}>
                                                <X />
                                            </Button>
                                        </FileUploadItemDelete>
                                    </div>
                                </div>
                            </FileUploadItem>
                        ))}
                    </FileUploadList>
                </div>
            </FileUpload>
        </>
    )
}

function ExtraFormPanel() {
    const { setStepValid, setValues: setCtxValues, values: providerValues } = useCreateProductContext()
    const { watch, getValues, setValue, setError, clearErrors, trigger } = useFormContext()
    const [selected, setSelected] = useState<string[]>([])

    useEffect(() => { setStepValid(4, true) }, [setStepValid])

    // Seed from provider OR existing form values when opening
    useEffect(() => {
        const dim = ((providerValues?.extra_meta as unknown as { selectedDimensionTags?: string[] })?.selectedDimensionTags) || (getValues('extra_meta.selectedDimensionTags' as never) as string[] | undefined) || []
        const surf = ((providerValues?.extra_meta as unknown as { selectedSurfaceTags?: string[] })?.selectedSurfaceTags) || (getValues('extra_meta.selectedSurfaceTags' as never) as string[] | undefined) || []
        const sizes = ((providerValues?.extra_meta as unknown as { selectedSizeTags?: string[] })?.selectedSizeTags) || (getValues('extra_meta.selectedSizeTags' as never) as string[] | undefined) || []
        const sens = ((providerValues?.extra_meta as unknown as { selectedSensorialTags?: string[] })?.selectedSensorialTags) || (getValues('extra_meta.selectedSensorialTags' as never) as string[] | undefined) || []
        const combined = Array.from(new Set([...(dim || []), ...(surf || []), ...(sizes || []), ...(sens || [])]))
        if (providerValues?.extra) setValue('extra' as never, providerValues.extra as never, { shouldValidate: false })
        if (providerValues?.extra_meta) setValue('extra_meta' as never, providerValues.extra_meta as never, { shouldValidate: false })
        setSelected(combined)
        trigger('extra')
        trigger('extra_meta')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Persist Extra and meta into provider on any change
    useEffect(() => {
        let last = ''
        const sub = watch((v) => {
            const val = v as unknown as { extra?: unknown; extra_meta?: unknown }
            const snapshot = JSON.stringify({ extra: val.extra || {}, extra_meta: val.extra_meta || {} })
            if (snapshot !== last) {
                last = snapshot
                setCtxValues({ extra: val.extra as never, extra_meta: val.extra_meta as never })
            }
        })
        return () => sub.unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch])

    // use hoisted unitOptionsByKey and tagToKey















    // Dynamic validity across groups (dimensions + sizes)
    const dimensionTagsSelectedRef = useMemo(() => selected.filter(t => ["Peso", "Alto", "Ancho", "Largo", "Profundidad", "Circumferencia"].includes(t)), [selected])
    const sizeTagsSelectedRef = useMemo(() => selected.filter(t => ["Talle", "Tamaño"].includes(t)), [selected])
    const hasExpirationSelected = useMemo(() => selected.includes("Fecha de vencimiento"), [selected])
    const hasColorSelected = useMemo(() => selected.includes("Color"), [selected])

    // Seed/clear dimension errors only when selection changes
    useEffect(() => {
        const dimKeys = dimensionTagsSelectedRef.map(t => tagToKey[t])
        dimKeys.forEach(k => {
            const valuePath = `extra.dimensions.${k}.value`
            const unitPath = `extra.dimensions.${k}.unit`
            const val = getValues(valuePath as never) as unknown
            const unit = getValues(unitPath as never) as unknown
            const hasVal = val !== undefined && val !== null && String(val).trim().length > 0
            const hasUnit = typeof unit === 'string' && unit.length > 0
            if (!hasVal) setError(valuePath as never, { type: 'required', message: 'Campo requerido' }); else clearErrors(valuePath as never)
            if (!hasUnit) setError(unitPath as never, { type: 'required', message: 'Selecciona una unidad' }); else clearErrors(unitPath as never)
        })
        if (hasExpirationSelected) {
            const expPath = `extra.expiration.date`
            const expVal = getValues(expPath as never) as unknown
            const hasVal = expVal !== undefined && expVal !== null && String(expVal).trim().length > 0
            if (!hasVal) setError(expPath as never, { type: 'required', message: 'Selecciona la fecha' }); else clearErrors(expPath as never)
        }
        if (hasColorSelected) {
            const base = `extra.surface.colors`
            const arr = (getValues(base as never) as { value: string; name?: string }[] | undefined) || []
            if (!Array.isArray(arr) || arr.length === 0) {
                setError(base as never, { type: 'required', message: 'Agrega al menos un color' })
            } else {
                clearErrors(base as never)
                arr.forEach((_item, index) => {
                    const colorName = `${base}.${index}.value`
                    const v = (getValues(colorName as never) as string | undefined) || ''
                    const isValid = hexColorRegex.test(v)
                    if (!isValid) setError(colorName as never, { type: 'required', message: 'Color inválido' }); else clearErrors(colorName as never)
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(dimensionTagsSelectedRef), hasExpirationSelected, hasColorSelected])

    // One watcher to compute step validity without mutating errors (prevents loops)
    useEffect(() => {
        const computeValid = () => {
            // dimensions
            const dimKeys = dimensionTagsSelectedRef.map(t => tagToKey[t])
            const dimsOk = dimKeys.every(k => {
                const v = getValues(`extra.dimensions.${k}.value` as never) as unknown
                const u = getValues(`extra.dimensions.${k}.unit` as never) as unknown
                const hv = v !== undefined && v !== null && String(v).trim().length > 0
                const hu = typeof u === 'string' && u.length > 0
                return hv && hu
            })
            // expiration
            const expOk = hasExpirationSelected ? (() => {
                const v = getValues(`extra.expiration.date` as never) as unknown
                return v !== undefined && v !== null && String(v).trim().length > 0
            })() : true
            // sizes
            const sizesOk = sizeTagsSelectedRef.every(tag => {
                const key = tag === 'Talle' ? 'talle' : 'tamano'
                const arr = (getValues(`extra.sizes.${key}` as never) as string[] | undefined) || []
                return Array.isArray(arr) && arr.length > 0
            })
            // colors
            const colorOk = hasColorSelected ? (() => {
                const base = `extra.surface.colors`
                const arr = (getValues(base as never) as { value: string; name?: string }[] | undefined) || []
                if (!Array.isArray(arr) || arr.length === 0) return false
                return arr.every(it => typeof it?.value === 'string' && hexColorRegex.test(it.value))
            })() : true
            setStepValid(4, dimsOk && expOk && sizesOk && colorOk)
        }
        computeValid()
        const sub = watch((_v, info) => {
            if (!info?.name) return
            if (info.name.startsWith('extra.')) computeValid()
        })
        return () => sub.unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(dimensionTagsSelectedRef), JSON.stringify(sizeTagsSelectedRef), hasExpirationSelected, hasColorSelected])

    const groups = useMemo(() => {
        const definitions = {
            contenido: { title: "Contenido y vencimiento", tags: ["Peso", "Fecha de vencimiento"] },
            dimensiones: { title: "Dimensiones", tags: ["Alto", "Ancho", "Largo", "Profundidad", "Circumferencia"] },
            talles: { title: "Talles y tamaños", tags: ["Talle", "Tamaño"] },
            superficie: { title: "Superficie", tags: ["Color", "Material"] },
            sensorial: { title: "Aromas y sabores", tags: ["Sabor", "Fragancia"] },
        } as const
        return (Object.entries(definitions)
            .map(([key, def]) => {
                const groupTags = def.tags.filter(t => selected.includes(t))
                if (groupTags.length === 0) return null
                return { key, title: def.title, tags: groupTags }
            })
            .filter(Boolean) as { key: string; title: string; tags: string[] }[])
    }, [selected])
    return (
        <div className="text-sm text-muted-foreground">
            <AnimatedTags
                title="Atributos"
                emptyMessage="Hace click en algun atributo para agregarselo al producto."
                initialTags={["Peso", "Fecha de vencimiento", "Alto", "Ancho", "Largo", "Profundidad", "Circumferencia", "Talle", "Tamaño", "Color", "Material", "Sabor", "Fragancia"]}
                selectedTags={selected}
                getSelectedTagClass={(tag) => {
                    const contenido = ["Peso", "Fecha de vencimiento"]
                    const dimensiones = ["Alto", "Ancho", "Largo", "Profundidad", "Circumferencia"]
                    const talles = ["Talle", "Tamaño"]
                    const superficie = ["Color", "Material"]
                    const sensorial = ["Sabor", "Fragancia"]

                    if (contenido.includes(tag)) return "bg-rose-100 text-rose-800 border-rose-200"
                    if (dimensiones.includes(tag)) return "bg-sky-100 text-sky-800 border-sky-200"
                    if (talles.includes(tag)) return "bg-emerald-100 text-emerald-800 border-emerald-200"
                    if (superficie.includes(tag)) return "bg-amber-100 text-amber-900 border-amber-200"
                    if (sensorial.includes(tag)) return "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200"
                    return "bg-primary text-primary-foreground"
                }}
                getAvailableTagClass={(tag) => {
                    const contenido = ["Peso", "Fecha de vencimiento"]
                    const dimensiones = ["Alto", "Ancho", "Largo", "Profundidad", "Circumferencia"]
                    const talles = ["Talle", "Tamaño"]
                    const superficie = ["Color", "Material"]
                    const sensorial = ["Sabor", "Fragancia"]

                    if (contenido.includes(tag)) return "bg-rose-50 text-rose-700 border-rose-200"
                    if (dimensiones.includes(tag)) return "bg-sky-50 text-sky-700 border-sky-200"
                    if (talles.includes(tag)) return "bg-emerald-50 text-emerald-700 border-emerald-200"
                    if (superficie.includes(tag)) return "bg-amber-50 text-amber-800 border-amber-200"
                    if (sensorial.includes(tag)) return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
                    return "bg-background text-primary-foreground"
                }}
                onChange={(vals) => {
                    setSelected(vals)
                    // Persist selection immediately so it persists across reopens
                    const dim = vals.filter(v => ["Peso", "Alto", "Ancho", "Largo", "Profundidad", "Circumferencia"].includes(v))
                    const surf = vals.filter(v => ["Color", "Material"].includes(v))
                    const sizes = vals.filter(v => ["Talle", "Tamaño"].includes(v))
                    const sens = vals.filter(v => ["Sabor", "Fragancia"].includes(v))
                    setValue('extra_meta.selectedDimensionTags' as never, dim as never, { shouldDirty: true })
                    setValue('extra_meta.selectedSurfaceTags' as never, surf as never, { shouldDirty: true })
                    setValue('extra_meta.selectedSizeTags' as never, sizes as never, { shouldDirty: true })
                    setValue('extra_meta.selectedSensorialTags' as never, sens as never, { shouldDirty: true })
                    setValue('extra_meta.selectedTags' as never, vals as never, { shouldDirty: true })
                }}
                hasTooltip
                tooltipMessage="Click para agregar o quitar"
            />
            {groups.length > 0 && (
                <Accordion type="single" collapsible>
                    {groups.map(g => (
                        <AccordionItem key={g.key} value={g.key}>
                            <AccordionTrigger>
                                <div className="flex w-full items-center gap-2">
                                    {(() => {
                                        const icons: Record<string, LucideIcon> = {
                                            dimensiones: Ruler,
                                            talles: Shirt,
                                            superficie: Palette,
                                            sensorial: Sparkles,
                                        }
                                        const Icon = icons[g.key] ?? Tag
                                        return <Icon className="size-4 text-muted-foreground" />
                                    })()}
                                    <span>{g.title}</span>
                                    <span className="ml-auto text-muted-foreground">({g.tags.length})</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {g.key === 'dimensiones' ? (
                                    <div className={cn("gap-3", g.tags.length > 1 ? "grid grid-cols-1 md:grid-cols-2" : "grid grid-cols-1")}>
                                        {g.tags.map(tag => (
                                            <DimensionFieldRow key={tag} tag={tag} />
                                        ))}
                                    </div>
                                ) : g.key === 'contenido' ? (
                                    <div className={cn("gap-3", g.tags.length > 1 ? "grid grid-cols-1 md:grid-cols-2" : "grid grid-cols-1")}>
                                        {g.tags.map(tag => (
                                            tag === 'Peso' ? (
                                                <DimensionFieldRow key={tag} tag={tag} />
                                            ) : (
                                                <ExpirationDateFieldRow key={tag} />
                                            )
                                        ))}
                                    </div>
                                ) : g.key === 'talles' ? (
                                    <div className={cn("gap-3", g.tags.length > 1 ? "grid grid-cols-1 md:grid-cols-2" : "grid grid-cols-1")}>
                                        {g.tags.map(tag => (
                                            <SizesTags
                                                key={tag}
                                                name={`extra.sizes.${tag === 'Talle' ? 'talle' : 'tamano'}`}
                                                label={tag}
                                                preset={tag === 'Talle'
                                                    ? [
                                                        { id: 'XS', label: 'XS' },
                                                        { id: 'S', label: 'S' },
                                                        { id: 'M', label: 'M' },
                                                        { id: 'L', label: 'L' },
                                                        { id: 'XL', label: 'XL' },
                                                        { id: 'XXL', label: 'XXL' },
                                                    ]
                                                    : [
                                                        { id: 'Pequeño', label: 'Pequeño' },
                                                        { id: 'Mediano', label: 'Mediano' },
                                                        { id: 'Grande', label: 'Grande' },
                                                    ]}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        {/* Colores y Material siempre apilados */}
                                        {g.tags.includes('Color') && <ColorsField />}
                                        {g.tags.includes('Material') && <MaterialsField />}
                                        {/* Otros tags de superficie (si se agregan en el futuro) */}
                                        {g.tags.filter(t => !['Color', 'Material'].includes(t)).map(tag => (
                                            tag === 'Sabor' ? (
                                                <FreeTags
                                                    key={tag}
                                                    name={`extra.sensorial.flavors`}
                                                    label={tag}
                                                    preset={[
                                                        { id: 'Vainilla', label: 'Vainilla' },
                                                        { id: 'Chocolate', label: 'Chocolate' },
                                                        { id: 'Frutilla', label: 'Frutilla' },
                                                        { id: 'Limón', label: 'Limón' },
                                                        { id: 'Caramelo', label: 'Caramelo' },
                                                        { id: 'Menta', label: 'Menta' },
                                                        { id: 'Café', label: 'Café' },
                                                        { id: 'Nuez', label: 'Nuez' },
                                                    ]}
                                                />
                                            ) : tag === 'Fragancia' ? (
                                                <FreeTags
                                                    key={tag}
                                                    name={`extra.sensorial.fragrances`}
                                                    label={tag}
                                                    preset={[
                                                        { id: 'Lavanda', label: 'Lavanda' },
                                                        { id: 'Cítrico', label: 'Cítrico' },
                                                        { id: 'Vainilla', label: 'Vainilla' },
                                                        { id: 'Sándalo', label: 'Sándalo' },
                                                        { id: 'Rosa', label: 'Rosa' },
                                                        { id: 'Jazmín', label: 'Jazmín' },
                                                        { id: 'Menta', label: 'Menta' },
                                                        { id: 'Cedro', label: 'Cedro' },
                                                    ]}
                                                />
                                            ) : null
                                        ))}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    )
}

function CreateProductForm({ step, setStep, onSubmitAll, storeId }: CreateProductFormProps) {
    const { isStepValid, values } = useCreateProductContext()

    const isValid = !!isStepValid[step]

    const hasVariants = useMemo(() => {
        const meta = (values.extra_meta as unknown as { selectedSurfaceTags?: string[]; selectedSizeTags?: string[]; selectedSensorialTags?: string[] }) || {}
        const surface = Array.isArray(meta.selectedSurfaceTags) && meta.selectedSurfaceTags.some(t => ["Color", "Material"].includes(t))
        const sizes = Array.isArray(meta.selectedSizeTags) && meta.selectedSizeTags.some(t => ["Talle", "Tamaño"].includes(t))
        const sensorial = Array.isArray(meta.selectedSensorialTags) && meta.selectedSensorialTags.some(t => ["Sabor", "Fragancia"].includes(t))
        return surface || sizes || sensorial
    }, [values.extra_meta])

    const allowedMaxStep = useMemo(() => {
        let max = 1
        for (let s = 1; s <= 4; s++) {
            if (isStepValid[s]) max = s + 1; else break
        }
        // Permitir navegar al step 5 solo si existe Variantes
        if (hasVariants && max === 5) return 5
        return Math.min(max, 4)
    }, [isStepValid, hasVariants])

    return (
        <>
        <Stepper
            initialStep={1}
            className="p-0"
            contentClassName="!p-0"
            stepContainerClassName="!p-0"
            stepCircleContainerClassName="!rounded-lg !max-w-full !w-full !border-none"
            footerClassName="!p-0"
            onStepChange={setStep}
            onFinalStepCompleted={async () => {
                console.log('CreateProduct payload', values)
                // Siempre mandamos a loader (6) y luego éxito (7)
                setStep(6)
                await onSubmitAll(values as CreateProductFormValues)
                setTimeout(() => setStep(7), 800)
            }}
            renderStepIndicator={(props) => (
                <StepIndicator
                    step={props.step}
                    currentStep={props.currentStep}
                    onStepClick={props.onStepClick}
                    disabled={props.step > allowedMaxStep}
                />
            )}
            nextButtonProps={{ disabled: !isValid }}
        >
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<BasicInfoFormType> contentButton="" submitButton={false} resolver={yupResolver(basicInfoSchema as never)}>
                    <BasicInfoFormPanel storeId={storeId} />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<PricingFormType> contentButton="" submitButton={false} resolver={yupResolver(pricingSchema as never)}>
                    <MediaFormPanel />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<EmptyFormType> contentButton="" submitButton={false} resolver={yupResolver(emptySchema as never)}>
                    <MediaUploadPanel />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<ExtraFormType> contentButton="" submitButton={false} resolver={yupResolver(extraSchema as never)}>
                    <ExtraFormPanel />
                </Form>
            </Step>
            {hasVariants && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <Form<EmptyFormType> contentButton="" submitButton={false} resolver={yupResolver(emptySchema as never)}>
                        <VariantsTable />
                    </Form>
                </Step>
            )}
        </Stepper>
        {step === 6 && (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                <Loader className="size-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Creando tu producto...</p>
            </div>
        )}
        {step === 7 && (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                <Check className="size-12 text-green-600" />
                <p className="text-sm text-muted-foreground">Producto creado con éxito</p>
            </div>
        )}
        </>
    )
}

function StepIndicator({ step, currentStep, onStepClick, disabled }: StepIndicatorProps) {
    const { isStepValid } = useCreateProductContext()

    const icons = {
        1: Box,
        2: Settings,
        3: ImageIcon,
        4: Tag,
    } as const

    const isComplete = !!isStepValid[step]
    const isInvalid = step <= 4 && !isComplete

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
                {Icon ? (
                    <Icon className={cn("size-4", disabled ? "opacity-50" : "")} />
                ) : (
                    step
                )}
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
            onClick={() => { if (!disabled) onStepClick(step) }}
        >
            {isComplete ? (
                <Check className="size-4" />
            ) : (
                step
            )}
        </div>
    )
}

function CreateProductButtonNew({ storeId }: { storeId: number }) {
    const [step, { setStep }] = useStepShim(7)
    const [open, setOpen] = useState(false)

    const descriptions: Record<number, string> = {
        1: "Ponle nombre, crea su URL única y completa los datos clave.",
        2: "Define precio y stock para empezar a vender al instante.",
        3: "Agrega imágenes y videos que destaquen tu producto.",
        4: "Configura atributos y extras del producto.",
        5: "Variantes: combinatoria de atributos seleccionados.",
        6: "Creando tu producto…",
        7: "¡Listo!",
    }

    const titleSlugs: Record<number, string> = {
        1: "Basic",
        2: "Pricing",
        3: "Media",
        4: "Extra",
        5: "Variantes",
        6: "Creando",
        7: "Success",
    }

    const handleCreateProduct = useCallback(async () => {
        // El flujo de loader/éxito ahora se maneja en CreateProductForm
        return { error: false, message: "ok" }
    }, [])

    useEffect(() => {
        if (step === 6) {
            const t = setTimeout(() => {
                setOpen(false)
                setStep(1)
            }, 1200)
            return () => clearTimeout(t)
        }
    }, [step, setStep])

    return (
        <CreateProductProvider storeId={storeId}>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        <span>Create Product</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto" isScroll>
                    <DialogHeader>
                        <DialogTitle>Create Product - {titleSlugs[step]}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription asChild>
                        <p>{descriptions[step]}</p>
                    </DialogDescription>
                    <CreateProductForm step={step} setStep={setStep} onSubmitAll={handleCreateProduct} storeId={storeId} />
                </DialogContent>
            </Dialog>
        </CreateProductProvider>
    )
}

function useStepShim(max: number): [number, { setStep: (s: number) => void }] {
    const [current, setCurrent] = useState(1)
    const setStep = useCallback((s: number) => {
        const next = Math.min(Math.max(1, s), max)
        setCurrent(next)
    }, [max])
    return [current, { setStep }]
}

export default CreateProductButtonNew

function VariantsTable() {
    const { values } = useCreateProductContext()

    const productName = (values.basic_info as { name?: string } | undefined)?.name || ""

    const extra = (values.extra as unknown as {
        sizes?: { talle?: string[]; tamano?: string[] }
        surface?: { colors?: { value: string; name?: string }[] }
        sensorial?: { flavors?: string[]; fragrances?: string[] }
        dimensions?: Record<string, { value?: string | number; unit?: string }>
    }) || {}

    const meta = (values.extra_meta as unknown as { selectedDimensionTags?: string[] }) || {}

    const axes = useMemo(() => {
        const axesLocal: { key: string; label: string; values: string[] }[] = []
        const sizes = (extra.sizes?.talle || []) as string[]
        const tamanos = (extra.sizes?.tamano || []) as string[]
        const colors = ((extra.surface?.colors || []) as { value: string; name?: string }[]).map(c => c.name || c.value)
        const flavors = (extra.sensorial?.flavors || []) as string[]
        const fragrances = (extra.sensorial?.fragrances || []) as string[]
        if (sizes.length > 0) axesLocal.push({ key: 'Talle', label: 'Talle', values: sizes })
        if (tamanos.length > 0) axesLocal.push({ key: 'Tamaño', label: 'Tamaño', values: tamanos })
        if (colors.length > 0) axesLocal.push({ key: 'Color', label: 'Color', values: colors })
        if (flavors.length > 0) axesLocal.push({ key: 'Sabor', label: 'Sabor', values: flavors })
        if (fragrances.length > 0) axesLocal.push({ key: 'Fragancia', label: 'Fragancia', values: fragrances })
        // Opcional: incluir dimensiones con valor fijo
        const dimSelected = meta.selectedDimensionTags || []
        for (const tag of dimSelected) {
            const key = tagToKey[tag]
            const item = extra.dimensions?.[key]
            if (item && item.value !== undefined && item.unit) {
                axesLocal.push({ key: tag, label: tag, values: [String(item.value) + ' ' + item.unit] })
            }
        }
        return axesLocal
    }, [extra, meta])

    function cartesian<T>(arrays: T[][]): T[][] {
        if (arrays.length === 0) return []
        return arrays.reduce<T[][]>((acc, curr) => {
            if (acc.length === 0) return curr.map(v => [v])
            const next: T[][] = []
            for (const a of acc) for (const c of curr) next.push([...a, c])
            return next
        }, [])
    }

    const combinations = useMemo(() => {
        const valueArrays = axes.map(a => a.values)
        const product = cartesian(valueArrays)
        return product.map(arr => {
            const attrs: Record<string, string> = {}
            arr.forEach((v, i) => { attrs[axes[i].label] = String(v) })
            return { attributes: attrs } as VariantRow
        })
    }, [axes])

    if (axes.length === 0) {
        return (
            <div className="flex flex-col gap-2">
                <h3 className="text-base font-medium">Variantes</h3>
                <p className="text-sm text-muted-foreground">Agrega atributos como Talle y Color para ver las combinaciones.</p>
            </div>
        )
    }

    const headers = ['Nombre', ...axes.map(a => a.label)]

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium">Variantes</h3>
            <p className="text-sm text-muted-foreground">Combinatoria de los atributos seleccionados.</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map(h => <TableHead key={h}>{h}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {combinations.map((row, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{productName || 'Producto'}</TableCell>
                            {axes.map(a => (
                                <TableCell key={a.label}>{row.attributes[a.label]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TableCaption>{combinations.length} variantes generadas</TableCaption>
        </div>
    )
}