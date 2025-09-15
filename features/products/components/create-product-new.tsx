"use client"

import React, { useEffect, useState } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Textarea } from "@/components/ui/textarea"
import { MultiStepFormWrapper, Step, useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Box, DollarSign, Globe, Package, Plus, Hash, Barcode, Camera, File, Upload, Trash, Weight, RotateCw, Calendar } from "lucide-react"
import CategoryTagsSelect from "@/features/store-landing/components/category-tags-select"
import { Switch } from "@/components/ui/switch"
import * as motion from "motion/react-client"
import { FileUpload, FileUploadClear, FileUploadDropzone, /* FileUploadTrigger, */ useFileUpload } from "@/components/ui/file-upload"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { useCamera } from "@/features/auth/hooks/use-camera"
import AnimatedTags from "@/src/components/smoothui/ui/AnimatedTags"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "motion/react"
/* import CameraComponent from "@/features/auth/components/avatar/camera-component" */

const basicInfoSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    url: z.string().regex(/^[a-zA-Z0-9-_.]+$/, { message: "URL must contain only letters and numbers" }),
    description: z.string().max(255, { message: "Description must be less than 255 characters long" }),
    categories: z.array(z.object({ label: z.string(), value: z.string() })),
})

const pricingAndStockSchema = z.object({
    price: z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Price must be a positive number greater than zero" }),
    stock: z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Stock must be a positive number greater than zero" }),
    sku: z.string().optional().nullable(),
    barcode: z.string().optional().nullable(),
    is_published: z.boolean().optional().nullable(),
    is_active: z.boolean().optional().nullable(),
    is_featured: z.boolean().optional().nullable(),
})

const mediaSchema = z.object({
    images: z.array(z.file()).optional().nullable(),
    primary_image: z.file().optional().nullable(),
})

const attributesSchema = z.object({
    selected_attributes: z.array(z.string()).optional().nullable(),
    weight: z.string().optional().nullable(),
    weight_unit: z.string().optional().nullable(),
    expiration_date: z.string().optional().nullable(),
    height: z.string().optional().nullable(),
    height_unit: z.string().optional().nullable(),
    width: z.string().optional().nullable(),
    width_unit: z.string().optional().nullable(),
    depth: z.string().optional().nullable(),
    depth_unit: z.string().optional().nullable(),
    circumference: z.string().optional().nullable(),
    circumference_unit: z.string().optional().nullable(),
}).superRefine((ref, ctx) => {
    console.log("🚀 ~ ctx:", ctx)
    console.log("🚀 ~ ref:", ref)
    if (ref.selected_attributes?.includes("Circumferencia")) {
        if (!ref.circumference) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Circumference is required",
            })
        }
    }
})

const formSchema = z.object({
    ...basicInfoSchema.shape,
    ...pricingAndStockSchema.shape,
    ...mediaSchema.shape,
    ...attributesSchema.shape,
}).superRefine((ref, ctx) => {
    if (ref.selected_attributes?.includes("Circumferencia")) {
        if (!ref.circumference) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Circumference is required",
            })
        }

        const circumference_schema = z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Circumference must be a positive number greater than zero" })
        if (!circumference_schema.safeParse(ref.circumference).success) {
            ctx.addIssue({
                code: "custom",
                message: "Circumference must be a positive number greater than zero",
                path: ["circumference"],
            })
        }
    }
})

type FormValues = z.infer<typeof formSchema>

export default function CreateProductNew({ storeId }: { storeId: number }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    <span>Create Product</span>
                </Button>
            </DialogTrigger>
            <DialogContent isScroll>
                <DialogTitle>Create Product</DialogTitle>
                <DialogDescription>Create a new product</DialogDescription>
                <MultiStepForm storeId={storeId} />
            </DialogContent>
        </Dialog>
    )
}

function MultiStepForm({ storeId }: { storeId: number }) {
    const [, setResult] = useState<FormValues | null>(null)

    const initialValues: Partial<FormValues> = {
        name: '',
        url: '',
        price: '',
        stock: '',
        sku: '',
        barcode: '',
        description: '',
        is_published: true,
        is_active: true,
        is_featured: false,
        categories: [],
        images: [],
        primary_image: null,
        selected_attributes: [],
        weight: '0',
        weight_unit: 'kg',
        expiration_date: new Date().toISOString().split('T')[0],
        height: '',
        height_unit: 'cm',
        width: '',
        width_unit: 'cm',
        depth: '',
        depth_unit: 'cm',
        circumference: '',
        circumference_unit: 'cm',
    };

    const handleComplete = (data: FormValues) => {
        setResult(data)
        toast.success("Form submitted!")
    }

    return (
        <MultiStepFormWrapper
            onComplete={handleComplete}
            completeButtonText="Submit"
            className="w-full"
            schema={formSchema}
            initialData={initialValues}
            allowStepReset
            autoSave
            persistKey="create-product-new"
        >
            <Step
                title="Basic Info"
                schema={basicInfoSchema}
            >
                <BasicInfoStep storeId={storeId} />
            </Step>
            <Step
                title="Pricing & stock"
                schema={pricingAndStockSchema}
            >
                <PricingAndStockStep />
            </Step>
            <Step
                title="Media"
                schema={mediaSchema}
            >
                <MediaStep />
            </Step>
            <Step
                title="Attributes"
                schema={attributesSchema}
            >
                <AttributesStep />
            </Step>
        </MultiStepFormWrapper >
    );
}

function BasicInfoStep({ storeId }: { storeId: number }) {
    const { form } = useMultiStepForm<FormValues>()
    const [categories, setCategories] = useState<{ label: string, value: string }[]>([])


    useEffect(() => {
        const localData = localStorage.getItem('create-product-new')
        if (localData) {
            const data = JSON.parse(localData)
            setCategories(data.categories)
        }
    }, [])

    const handleSaveCategories = (vals: { label: string, value: string }[]) => {
        form.setValue('categories', vals)
    }

    const handleFileSelect = (files: File[]) => {
        form.setValue('primary_image', files[0])
        form.setValue('images', files)
    }


    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Form {...form}>
                <div className="flex items-center gap-8 flex-col md:flex-row">
                    <FormField
                        control={form.control}
                        name="primary_image"
                        render={({ field }) => (
                            <FileUpload
                                className="shrink-0 max-w-[150px] w-full"
                                onValueChange={handleFileSelect}
                                maxFiles={1}
                                maxSize={2 * 1024 * 1024}
                                accept="image/jpg, image/png, image/jpeg"
                                value={field.value ? [field.value] : []}
                            >
                                <FileUploadDropzoneWrapper />
                            </FileUpload>
                        )}
                    />
                    <div className="space-y-3 w-full">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your name"
                                            startContent={<Box />}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="url"
                                            placeholder="Enter your URL"
                                            inputMode="url"
                                            startContent={<Globe />}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="space-y-3 mt-4">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Enter your description"
                                        className="w-full p-2 text-sm border rounded min-h-[80px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <CategoryTagsSelect
                        storeId={storeId}
                        defaultValue={categories}
                        onChange={handleSaveCategories} />
                </div>
            </Form>
        </motion.div>
    )
}

function PricingAndStockStep() {
    const { form } = useMultiStepForm<FormValues>()

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Form {...form}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        placeholder="Enter your price"
                                        inputMode="numeric"
                                        startContent={<DollarSign />}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder="Enter your stock"
                                            inputMode="numeric"
                                            startContent={<Package />}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="Enter SKU"
                                        startContent={<Hash />}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="barcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Barcode</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="Enter barcode (optional)"
                                        startContent={<Barcode />}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="mt-4 space-y-4">
                    <FormField
                        control={form.control}
                        name="is_published"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex items-center justify-between">
                                    <div>
                                        <FormLabel>Producto publicado</FormLabel>
                                        <FormDescription>
                                            Visible en tu tienda pública
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            id="is-published"
                                            name="is_published"
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex items-center justify-between">
                                    <div>
                                        <FormLabel>Producto activo</FormLabel>
                                        <FormDescription>
                                            Hazlo disponible para la venta
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            id="is-active"
                                            name="is_active"
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex items-center justify-between">
                                    <div>
                                        <FormLabel>Producto destacado</FormLabel>
                                        <FormDescription>
                                            Resáltalo en secciones especiales
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            id="is-featured"
                                            name="is_featured"
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                </div>
            </Form>
        </motion.div>
    )
}

function MediaStep() {
    const { form } = useMultiStepForm<FormValues>()

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Form {...form}>
                Media
            </Form>
        </motion.div>
    )
}

function AttributesStep() {

    const { form } = useMultiStepForm<FormValues>()
    const [selected, setSelected] = useState<string[]>([])
    const [accordions, setAccordions] = useState({
        content: false,
        dimensions: false,
        sizes: false,
        surface: false,
        sensorial: false,
    })

    const categories = {
        "content": {
            attributes: ["Peso", "Fecha de vencimiento"],
            title: "Contenido y vencimiento",
        },
        "dimensions": {
            attributes: ["Alto", "Ancho", "Profundidad", "Circumferencia"],
            title: "Dimensiones",
        },
        "sizes": {
            attributes: ["Talle", "Tamaño"],
            title: "Talles y tamaños",
        },
        "surface": {
            attributes: ["Color", "Material"],
            title: "Superficie",
        },
        "sensorial": {
            attributes: ["Sabor", "Fragancia"],
            title: "Aromas y sabores",
        },
    }

    const categoriesArray = Object.values(categories)
    const initialTags = categoriesArray.flatMap(category => category.attributes)

    useEffect(() => {
        const localData = localStorage.getItem('create-product-new')
        if (localData) {
            const data = JSON.parse(localData)
            setSelected(data.selected_attributes)
            setAccordions({
                content: data.selected_attributes.includes("Peso") || data.selected_attributes.includes("Fecha de vencimiento"),
                dimensions: data.selected_attributes.includes("Alto") || data.selected_attributes.includes("Ancho") || data.selected_attributes.includes("Largo") || data.selected_attributes.includes("Profundidad") || data.selected_attributes.includes("Circumferencia"),
                sizes: data.selected_attributes.includes("Talle") || data.selected_attributes.includes("Tamaño"),
                surface: data.selected_attributes.includes("Color") || data.selected_attributes.includes("Material"),
                sensorial: data.selected_attributes.includes("Sabor") || data.selected_attributes.includes("Fragancia"),
            })
        }
    }, [])

    const handleAttributeChange = (vals: string[]) => {
        setSelected(vals)
        setAccordions({
            content: vals.includes("Peso") || vals.includes("Fecha de vencimiento"),
            dimensions: vals.includes("Alto") || vals.includes("Ancho") || vals.includes("Largo") || vals.includes("Profundidad") || vals.includes("Circumferencia"),
            sizes: vals.includes("Talle") || vals.includes("Tamaño"),
            surface: vals.includes("Color") || vals.includes("Material"),
            sensorial: vals.includes("Sabor") || vals.includes("Fragancia"),
        })
        form.setValue('selected_attributes', vals)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Form {...form}>
                <AnimatedTags
                    title={""}
                    emptyMessage="Tu producto no tiene atributos aun. Haz click en alguno para agregarlo."
                    initialTags={initialTags}
                    onChange={handleAttributeChange}
                    selectedTags={selected}
                />
                <Accordion type="single" collapsible>
                    {accordions.content && (
                        <AccordionItem value="content">
                            <AccordionTrigger>
                                <span>Contenido y vencimiento</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={cn(
                                    "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    selected.includes("Peso") && selected.includes("Fecha de vencimiento") ? "md:grid-cols-2" : "md:grid-cols-1"
                                )}>
                                    <AnimatePresence>
                                        {selected.includes("Peso") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                className="flex items-end w-full"
                                                key="weight"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="weight"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">Peso</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Enter your weight"
                                                                    inputMode="numeric"
                                                                    startContent={<Weight />}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="weight_unit"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="KG" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="kg">KG</SelectItem>
                                                                            <SelectItem value="g">G</SelectItem>
                                                                            <SelectItem value="mg">MG</SelectItem>
                                                                            <SelectItem value="oz">OZ</SelectItem>
                                                                            <SelectItem value="lb">LB</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                        {selected.includes("Fecha de vencimiento") && (
                                            <motion.div
                                                className="flex items-end w-full"
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="expiration_date"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="expiration_date"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">Fecha de vencimiento</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="date"
                                                                    {...field}
                                                                    placeholder="Enter your expiration date"
                                                                    startContent={<Calendar />}
                                                                    className="w-full"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {accordions.dimensions && (
                        <AccordionItem value="dimensions">
                            <AccordionTrigger>
                                <span>Dimensiones</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={cn(
                                    "grid grid-cols-1 md:grid-cols-2 gap-4",
                                )}>
                                    <AnimatePresence>
                                        {selected.includes("Alto") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="height"
                                                className="flex items-end w-full"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="height"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">Alto</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej. 2Mts"
                                                                    inputMode="numeric"
                                                                    startContent={(
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                            <path fill="currentColor" d="M17.207 3.293a1 1 0 0 0-1.414 0l-2.5 2.5a1 1 0 0 0 1.414 1.414L16.5 5.414l1.793 1.793a1 1 0 1 0 1.414-1.414zm-10.707.7a2.5 2.5 0 0 0-2.5 2.5v11a2.5 2.5 0 0 0 2.5 2.5h4a1 1 0 1 0 0-2h-4a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h4a1 1 0 1 0 0-2zm10.707 16.714l2.5-2.5a1 1 0 0 0-1.414-1.414L16.5 18.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0M17.5 12a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-1 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1m0-7a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1" />
                                                                        </svg>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="height_unit"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="CM" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">CM</SelectItem>
                                                                        <SelectItem value="m">M</SelectItem>
                                                                        <SelectItem value="in">IN</SelectItem>
                                                                        <SelectItem value="ft">FT</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                        {selected.includes("Ancho") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="width"
                                                className="flex items-end w-full"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="width"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">Ancho</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej. 2Mts"
                                                                    inputMode="numeric"
                                                                    startContent={(
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                                                            <path fill="currentColor" d="M20.008 6.5a2.5 2.5 0 0 0-2.5-2.5h-11a2.5 2.5 0 0 0-2.5 2.5v4a1 1 0 1 0 2 0v-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v4a1 1 0 1 0 2 0zm-1.8 13.207l2.5-2.5a1 1 0 0 0 0-1.414l-2.5-2.5a1 1 0 0 0-1.415 1.414l1.793 1.793l-1.793 1.793a1 1 0 0 0 1.414 1.414M3.292 15.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414L5.414 16.5l1.793-1.793a1 1 0 1 0-1.414-1.414zM13 16.5a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-4-1a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm8 1a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1" />
                                                                        </svg>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="width_unit"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="CM" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">CM</SelectItem>
                                                                        <SelectItem value="m">M</SelectItem>
                                                                        <SelectItem value="in">IN</SelectItem>
                                                                        <SelectItem value="ft">FT</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                        {selected.includes("Profundidad") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="depth"
                                                className="flex items-end w-full"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="depth"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">Profundidad</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej. 2Mts"
                                                                    inputMode="numeric"
                                                                    startContent={(
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                                                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 20h20M5 4h14M3 16.01l.01-.011m18 .011l-.01-.011M4 12.01l.01-.011m16 .011l-.01-.011M5 8.01l.01-.011m14 .011L19 7.999M12 7v10m0-10l-1.5 1.5M12 7l1.5 1.5M12 17l-3-3m3 3l3-3" />
                                                                        </svg>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="depth_unit"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="CM" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">CM</SelectItem>
                                                                        <SelectItem value="m">M</SelectItem>
                                                                        <SelectItem value="in">IN</SelectItem>
                                                                        <SelectItem value="ft">FT</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                        {selected.includes("Circumferencia") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="circumference"
                                                className="flex items-end w-full"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="circumference"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">Circumferencia</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej. 2Mts"
                                                                    inputMode="numeric"
                                                                    startContent={<RotateCw />}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="circumference_unit"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="CM" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">CM</SelectItem>
                                                                        <SelectItem value="m">M</SelectItem>
                                                                        <SelectItem value="in">IN</SelectItem>
                                                                        <SelectItem value="ft">FT</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {accordions.sizes && (
                        <AccordionItem value="sizes">
                            <AccordionTrigger>
                                <span>Talles y tamaños</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    <h3>Talles y tamaños</h3>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {accordions.surface && (
                        <AccordionItem value="surface">
                            <AccordionTrigger>
                                <span>Superficie</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    <h3>Superficie</h3>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {accordions.sensorial && (
                        <AccordionItem value="sensorial">
                            <AccordionTrigger>
                                <span>Aromas y sabores</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    <h3>Aromas y sabores</h3>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </Form>
        </motion.div>
    )
}

function FileUploadDropzoneWrapper() {
    const { form } = useMultiStepForm<FormValues>()
    const { files } = useFileUpload((state) => {
        return { files: state.files }
    })

    const camera = useCamera({
        uploadPath: 'product-images',
        onSuccess: (url) => {
            console.log("🚀 ~ BasicInfoStep ~ url:", url)
            /* setValue("basic_info.image", url)
            setImage([]) */
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

    const handleDeleteImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        form.setValue('primary_image', null)
        form.setValue('images', [])
    }

    return (
        <FileUploadDropzone className="rounded-full aspect-square w-full">
            {Array.from(files.entries()).length === 0 && (
                <>
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
                </>
            )}
            {Array.from(files.entries()).length > 0 && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <FileUploadClear asChild onClick={handleDeleteImage}>
                            <IconButton icon={Trash} />
                        </FileUploadClear>
                    </TooltipTrigger>
                    <TooltipContent>
                        Click para eliminar la imagen
                    </TooltipContent>
                </Tooltip>
            )}
        </FileUploadDropzone>
    )
}