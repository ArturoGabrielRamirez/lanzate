"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Stepper, { Step } from "@/components/Stepper"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useCallback, useContext, useEffect, useMemo, useState, createContext } from "react"
import { useFormContext } from "react-hook-form"
import { Form, InputField } from "@/features/layout/components"
import { Check, Loader, Box, Image as ImageIcon, Plus, Globe, Upload, Camera, Trash, Tag, Barcode } from "lucide-react"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemPreview } from "@/components/ui/file-upload"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Progress } from "@/components/ui/progress"
import { useCamera } from "@/features/auth/hooks/use-camera"
import CameraComponent from "@/features/auth/components/avatar/camera-component"
import { toast } from "sonner"
import { generate } from "random-words"
import { cn } from "@/lib/utils"

type CreateProductFormValues = {
    basic_info?: Record<string, unknown>
    media?: Record<string, unknown>
}

type CreateProductContextType = {
    values: Partial<CreateProductFormValues>
    setValues: (partial: Partial<CreateProductFormValues>) => void
    isStepValid: Record<number, boolean>
    setStepValid: (step: number, valid: boolean) => void
}

const CreateProductContext = createContext<CreateProductContextType | null>(null)

function useCreateProductContext() {
    const ctx = useContext(CreateProductContext)
    if (!ctx) throw new Error("CreateProductContext not found")
    return ctx
}

function CreateProductProvider({ children }: { children: React.ReactNode }) {
    const [values, setValuesState] = useState<Partial<CreateProductFormValues>>({})
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({})

    const setValues = useCallback((partial: Partial<CreateProductFormValues>) => {
        setValuesState(prev => ({ ...prev, ...partial }))
    }, [])

    const setStepValid = useCallback((step: number, valid: boolean) => {
        setIsStepValid(prev => ({ ...prev, [step]: valid }))
    }, [])

    return (
        <CreateProductContext.Provider value={{ values, setValues, isStepValid, setStepValid }}>
            {children}
        </CreateProductContext.Provider>
    )
}

// Empty per-step schemas (steps vacíos, siempre válidos)
const emptySchema = yup.object({})
type EmptyFormType = yup.InferType<typeof emptySchema>

// Step 1 schema: mimic store basic form (name + slug labeled as URL)
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
type BasicInfoFormType = yup.InferType<typeof basicInfoSchema>

function BasicInfoFormPanel() {
    const { setStepValid, setValues: setCtxValues, values } = useCreateProductContext()
    const { watch, setValue, formState: { isValid } } = useFormContext<BasicInfoFormType>()

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
    const imageValue = watch('basic_info.image') as unknown
    const [isSlugTouched, setIsSlugTouched] = useState(false)
    const [image, setImage] = useState<File[]>([])
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    useEffect(() => { setStepValid(1, isValid) }, [isValid, setStepValid])

    // Persist step values into wizard context
    useEffect(() => {
        const sub = watch((v) => setCtxValues({ basic_info: (v as BasicInfoFormType).basic_info }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    // Seed from context if present
    useEffect(() => {
        if (values.basic_info) setValue('basic_info', values.basic_info as never, { shouldValidate: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generate default slug on first mount if empty
    useEffect(() => {
        const current = (watch('basic_info.slug') as string | undefined) || ""
        if (!current || current.length === 0) {
            const rw = (generate({ exactly: 2, join: '-' }) as unknown as string) || ""
            const defaultSlug = slugify(rw)
            console.log("🚀 ~ BasicInfoFormPanel ~ current:", defaultSlug)
            if (defaultSlug) setValue('basic_info.slug', defaultSlug, { shouldValidate: true })
        }
    }, [])

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
    }, [imageValue])

    // Auto-generate slug from name until user edits slug directly
    useEffect(() => {
        if (!isSlugTouched) {
            const next = slugify(nameValue || '')
            setValue('basic_info.slug', next, { shouldValidate: true, shouldDirty: true })
        }
    }, [nameValue, isSlugTouched, setValue])

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
            <InputField
                name="basic_info.description"
                label="Description"
                placeholder="Ej: Breve descripción del producto"
                isTextArea
            />
        </>
    )
}

function MediaFormPanel() {
    const { setStepValid } = useCreateProductContext()
    useEffect(() => { setStepValid(2, true) }, [setStepValid])
    return (
        <div className="min-h-40 flex items-center justify-center text-muted-foreground border rounded-md p-8 border-dashed">
            <p>Step 2 vacío (Medios/Imágenes)</p>
        </div>
    )
}

type CreateProductFormProps = {
    step: number
    setStep: (s: number) => void
    onSubmitAll: (data: CreateProductFormValues) => Promise<{ error: boolean; message: string; payload?: unknown } | undefined>
}

function CreateProductForm({ step, setStep, onSubmitAll }: CreateProductFormProps) {
    const { isStepValid, values } = useCreateProductContext()

    const isValid = !!isStepValid[step]

    const allowedMaxStep = useMemo(() => {
        let max = 1
        for (let s = 1; s <= 2; s++) {
            if (isStepValid[s]) max = s + 1; else break
        }
        return Math.min(max, 2)
    }, [isStepValid])

    return (
        <Stepper
            initialStep={1}
            className="p-0"
            contentClassName="!p-0"
            stepContainerClassName="!p-0"
            stepCircleContainerClassName="!rounded-lg !max-w-full !w-full !border-none"
            footerClassName="!p-0"
            onStepChange={setStep}
            onFinalStepCompleted={async () => {
                await onSubmitAll(values as CreateProductFormValues)
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
                    <BasicInfoFormPanel />
                </Form>
            </Step>
            <Step className="!p-0 !pt-10 !pb-2">
                <Form<EmptyFormType> contentButton="" submitButton={false} resolver={yupResolver(emptySchema as never)}>
                    <MediaFormPanel />
                </Form>
            </Step>
            {step === 3 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Loader className="size-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Creando tu producto...</p>
                    </div>
                </Step>
            )}
            {step === 4 && (
                <Step className="!p-0 !pt-10 !pb-2">
                    <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                        <Check className="size-12 text-green-600" />
                        <p className="text-sm text-muted-foreground">Producto creado con éxito</p>
                    </div>
                </Step>
            )}
        </Stepper>
    )
}

type StepIndicatorProps = {
    step: number
    currentStep: number
    onStepClick: (s: number) => void
    disabled: boolean
}

function StepIndicator({ step, currentStep, onStepClick, disabled }: StepIndicatorProps) {
    const { isStepValid } = useCreateProductContext()

    const icons = {
        1: Box,
        2: ImageIcon,
        3: Check,
    } as const

    const isComplete = !!isStepValid[step]
    const isInvalid = step <= 2 && !isComplete

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
                <Icon className={cn("size-4", disabled ? "opacity-50" : "")} />
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

function CreateProductButtonNew() {
    const [step, { setStep }] = useStepShim(4)
    const [open, setOpen] = useState(false)

    const descriptions = {
        1: "Agrega datos básicos; podrás editarlos luego.",
        2: "Sube imágenes o medios del producto.",
        3: "Creando tu producto…",
        4: "Listo!",
    } as const

    const titleSlugs = {
        1: "Basic",
        2: "Media",
        3: "Success",
    } as const

    const handleCreateProduct = useCallback(async () => {
        setStep(3)
        // Esqueleto: no llamamos al backend aún; mantenemos el flujo y éxito
        await new Promise((r) => setTimeout(r, 800))
        setStep(4)
        return { error: false, message: "ok" }
    }, [setStep])

    useEffect(() => {
        if (step === 4) {
            const t = setTimeout(() => {
                setOpen(false)
                setStep(1)
            }, 1200)
            return () => clearTimeout(t)
        }
    }, [step, setStep])

    return (
        <CreateProductProvider>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        <span>Create Product</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Product - {titleSlugs[step as keyof typeof titleSlugs]}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription asChild>
                        <p>{descriptions[step as keyof typeof descriptions]}</p>
                    </DialogDescription>
                    <CreateProductForm step={step} setStep={setStep} onSubmitAll={handleCreateProduct} />
                </DialogContent>
            </Dialog>
        </CreateProductProvider>
    )
}

// Small shim to reuse the same signature as useStep from hooks, without importing if not needed here
function useStepShim(max: number): [number, { setStep: (s: number) => void }] {
    const [current, setCurrent] = useState(1)
    const setStep = useCallback((s: number) => {
        const next = Math.min(Math.max(1, s), max)
        setCurrent(next)
    }, [max])
    return [current, { setStep }]
}

export default CreateProductButtonNew