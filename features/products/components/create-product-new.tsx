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
import { Box, DollarSign, Globe, Package, Plus, Hash, Barcode, Camera, File, Upload, Trash, Weight } from "lucide-react"
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
})

const formSchema = z.object({
    ...basicInfoSchema.shape,
    ...pricingAndStockSchema.shape,
    ...mediaSchema.shape,
    ...attributesSchema.shape,
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
            attributes: ["Alto", "Ancho", "Largo", "Profundidad", "Circumferencia"],
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
                                                            <FormControl>
                                                                <Input
                                                                    type="date"
                                                                    {...field}
                                                                    placeholder="Enter your expiration date"
                                                                    startContent={<Weight />}
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
                                <div>
                                    <h3>Dimensiones</h3>
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