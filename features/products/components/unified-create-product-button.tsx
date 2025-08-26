"use client"

import { InputField } from "@/features/layout/components"
import { createProduct } from "../actions/createProduct"
import { productCreateSchema } from "../schemas/product-schema"
import { formatErrorResponse } from "@/utils/lib"
import { DollarSign, FileText, Package, Plus, Tag, Upload, X, ShoppingCart, Box } from "lucide-react"
import { useCallback, useState, useEffect, useRef } from "react"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { FileUpload, FileUploadCameraTrigger, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from "next-intl"
import { UnifiedCreateProductButtonProps } from "../type"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { cn } from "@/lib/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
// Uploads and media attachment are performed via API routes to allow pre-product uploads from the client

type CategoryValue = { value: string; label: string }

type CreateProductPayload = {
    name: string
    price: number
    stock: number
    description?: string | undefined
    categories: CategoryValue[] | undefined
    image?: File | undefined
    is_active: boolean | undefined
    is_featured: boolean | undefined
    is_published: boolean | undefined
}

function UnifiedCreateProductButton(props: UnifiedCreateProductButtonProps) {
    const [categories, setCategories] = useState<CategoryValue[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [primaryIndex, setPrimaryIndex] = useState<number | null>(null)
    const uploadedUrlsRef = useRef<Map<File, string>>(new Map())
    const prevFilesRef = useRef<File[]>([])
    const isUploadingRef = useRef(false)
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")
    const [fileUploadError, setFileUploadError] = useState<string>("")
    const [open, setOpen] = useState(false)
    const [isActive, setIsActive] = useState(true)
    const [isFeatured, setIsFeatured] = useState(false)
    const [isPublished, setIsPublished] = useState(true)

    const hasStoreId = 'storeId' in props
    const translationNamespace = hasStoreId ? "store.create-product" : "dashboard.create-product"
    const t = useTranslations(translationNamespace)

    useEffect(() => {
        if (!open) {
            setCategories([])
            setFiles([])
            setPrimaryIndex(null)
            setFileUploadError("")
            setIsActive(true)
            setIsFeatured(false)
            setIsPublished(true)
            uploadedUrlsRef.current = new Map()
            prevFilesRef.current = []
            if (!hasStoreId) {
                setSelectedStoreId("")
            }
        }
    }, [open, hasStoreId])

    const handleAddCategory = (value: CategoryValue[]) => {
        setCategories(value)
    }

    const onFileReject = useCallback((file: File, message: string) => {
        const filename = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name

        setFileUploadError(message)

        if (hasStoreId) {
            toast(message, {
                description: t("file-rejected", { filename }),
            })
        } else {
            toast(message, {
                description: `"${filename}" has been rejected`,
            })
        }
    }, [t, hasStoreId])

    async function uploadNewFilesSequential(newFiles: File[], targetStoreId: number) {
        if (isUploadingRef.current) return
        isUploadingRef.current = true
        try {
            for (const file of newFiles) {
                try {
                    const form = new FormData()
                    form.append("file", file)
                    form.append("storeId", String(targetStoreId))
                    const res = await fetch("/api/product-images", { method: "POST", body: form })
                    if (!res.ok) throw new Error((await res.json()).error || "Upload failed")
                    const data = await res.json()
                    uploadedUrlsRef.current.set(file, data.url as string)
                } catch (err) {
                    const msg = err instanceof Error ? err.message : "Error subiendo imagen"
                    toast.error(msg)
                }
            }
        } finally {
            isUploadingRef.current = false
        }
    }

    useEffect(() => {
        // Maintain primary index
        if (files.length === 1) setPrimaryIndex(0)
        if (files.length === 0) setPrimaryIndex(null)
        if (primaryIndex !== null && primaryIndex >= files.length) setPrimaryIndex(files.length ? 0 : null)

        // Upload files when we know the storeId
        const targetStoreId = hasStoreId ? props.storeId! : (selectedStoreId ? parseInt(selectedStoreId) : null)
        if (targetStoreId) {
            const prev = prevFilesRef.current
            const added = files.filter(f => !prev.includes(f))

            // Upload newly added files
            if (added.length > 0) void uploadNewFilesSequential(added, targetStoreId)

            // Upload any pending files that were selected before store selection
            const pending = files.filter(f => !uploadedUrlsRef.current.has(f))
            if (pending.length > 0 && added.length !== pending.length) void uploadNewFilesSequential(pending, targetStoreId)
        }

        // Cleanup uploaded urls for removed files
        for (const key of Array.from(uploadedUrlsRef.current.keys())) {
            if (!files.includes(key)) uploadedUrlsRef.current.delete(key)
        }

        prevFilesRef.current = files
    }, [files, primaryIndex, selectedStoreId, hasStoreId])

    const handleCreateProduct = async (payload: CreateProductPayload) => {
        try {
            let targetStoreId: number

            if (hasStoreId) {
                targetStoreId = props.storeId!
            } else {
                if (!selectedStoreId) {
                    throw new Error(t("messages.select-store-first"))
                }
                targetStoreId = parseInt(selectedStoreId)
            }

            const data = {
                ...payload,
                categories,
                image: files[0],
                is_active: isActive,
                is_featured: isFeatured,
                is_published: isPublished
            }

            const { error, message, payload: product } = await createProduct(data, targetStoreId, props.userId)

            if (error) throw new Error(message)

            // Ensure any pending uploads are finished and attach media
            const missing = files.filter(f => !uploadedUrlsRef.current.has(f))
            if (missing.length > 0) {
                await uploadNewFilesSequential(missing, targetStoreId)
            }

            const media = files
                .map((file, idx) => ({ file, idx }))
                .filter(({ file }) => uploadedUrlsRef.current.has(file))
                .map(({ file, idx }) => ({
                    url: uploadedUrlsRef.current.get(file)!,
                    type: "IMAGE" as const,
                    sortOrder: idx,
                }))

            const primary = primaryIndex === null ? (files.length ? 0 : null) : primaryIndex
            if (media.length > 0) {
                await fetch(`/api/products/${product.id}/media`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ media, primaryIndex: primary })
                })
            }

            return {
                error: false,
                message: t("messages.success"),
                payload: product
            }
        } catch (error) {
            return formatErrorResponse(t("messages.error"), error, null)
        }
    }

    const handleSuccess = async () => {
        setOpen(false)
    }

    const selectedStore = !hasStoreId && 'stores' in props
        ? props.stores.find(store => store.id.toString() === selectedStoreId)
        : null

    const buttonIcon = hasStoreId ? <Plus /> : <ShoppingCart className="size-4" />
    const buttonClassName = hasStoreId ? undefined : "w-full"
    const resolverConfig = productCreateSchema ? { resolver: yupResolver(productCreateSchema) as import('react-hook-form').Resolver<CreateProductPayload> } : {}

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={false} variant="default" type="button" className={cn("w-full", buttonClassName)}>
                    {buttonIcon}
                    <span className="hidden md:block">{t("button")}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("popup-description")}
                    </DialogDescription>
                </DialogHeader>
                <Form
                    resolver={resolverConfig.resolver}
                    formAction={handleCreateProduct}
                    contentButton={t("button")}
                    successMessage={t("messages.success")}
                    loadingMessage={t("messages.loading")}
                    onSuccess={handleSuccess}
                    disabled={false}
                >
                    <div className="space-y-4">
                        {!hasStoreId && 'stores' in props && (
                            <div className="space-y-2">
                                <Label htmlFor="store-select">{t("select-store")}</Label>
                                <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("choose-store")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.stores.map((store) => (
                                            <SelectItem key={store.id} value={store.id.toString()}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{store.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {store.subdomain}.lanzate.co
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedStore && (
                                    <p className="text-xs text-muted-foreground">
                                        {t("product-will-be-created", { storeName: selectedStore.name })}
                                    </p>
                                )}
                            </div>
                        )}
                        <Accordion type="single" collapsible defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTriggerWithValidation keys={["name", "price", "categories"]}>
                                    <span className="flex items-center gap-2">
                                        <Box className="size-4" />
                                        Informacion básica
                                    </span>
                                </AccordionTriggerWithValidation>
                                <AccordionContent className="space-y-4">
                                    <div className="space-y-2">
                                        <FileUpload
                                            maxFiles={5}
                                            maxSize={2 * 1024 * 1024}
                                            className={hasStoreId ? "w-full" : "w-full"}
                                            value={files}
                                            onValueChange={(newFiles) => {
                                                setFiles(newFiles)
                                                if (newFiles.length > 0) {
                                                    setFileUploadError("")
                                                }
                                            }}
                                            onFileReject={onFileReject}
                                            multiple={false}
                                            disabled={files.length >= 5}
                                            accept="image/jpg, image/png, image/jpeg"
                                        >
                                            {/* {files.length === 0 && ( */}
                                                <FileUploadDropzone>
                                                    <div className="flex flex-col items-center gap-1 text-center">
                                                        <div className="flex items-center justify-center rounded-full border p-2.5">
                                                            <Upload className="size-6 text-muted-foreground" />
                                                        </div>
                                                        <p className="font-medium text-sm">
                                                            {hasStoreId ? t("drag-drop") : t("drag-drop-image")}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {t("click-browse")}
                                                        </p>
                                                    </div>
                                                    <FileUploadTrigger asChild>
                                                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                                                            {t("browse-files")}
                                                        </Button>
                                                    </FileUploadTrigger>
                                                    <FileUploadCameraTrigger />
                                                </FileUploadDropzone>
                                            {/* )} */}
                                            <FileUploadList className="w-full">
                                                {files.map((file, index) => (
                                                    <FileUploadItem key={index} value={file}>
                                                        <FileUploadItemPreview />
                                                        <FileUploadItemMetadata />
                                                        <div className="ml-auto flex items-center gap-2">
                                                            <Label htmlFor={`primary-${index}`} className="text-xs">Primaria</Label>
                                                            <Switch
                                                                id={`primary-${index}`}
                                                                checked={primaryIndex === index || (files.length === 1 && index === 0)}
                                                                disabled={files.length === 1}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) setPrimaryIndex(index)
                                                                    else if (primaryIndex === index && files.length > 1) setPrimaryIndex(null)
                                                                }}
                                                            />
                                                        </div>
                                                        <FileUploadItemDelete asChild>
                                                            <Button variant="ghost" size="icon" className="size-7">
                                                                <X />
                                                            </Button>
                                                        </FileUploadItemDelete>
                                                    </FileUploadItem>
                                                ))}
                                            </FileUploadList>
                                        </FileUpload>

                                        {fileUploadError && (
                                            <p className="text-destructive text-sm">
                                                {fileUploadError}
                                            </p>
                                        )}
                                    </div>
                                    <InputField
                                        name="name"
                                        label={hasStoreId ? t("name") : t("product-name")}
                                        type="text"
                                        startContent={hasStoreId ? <Tag /> : undefined}
                                    />
                                    <InputField
                                        name="price"
                                        label={t("price")}
                                        type="number"
                                        defaultValue="0"
                                        startContent={hasStoreId ? <DollarSign /> : undefined}
                                    />
                                    <CategorySelect
                                        onChange={handleAddCategory}
                                        storeId={hasStoreId ? props.storeId : (selectedStoreId ? parseInt(selectedStoreId) : undefined)}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTriggerWithValidation keys={["stock", "description"]}>
                                    <span className="flex items-center gap-2">
                                        <Package className="size-4" />
                                        Informacion adicional
                                    </span>
                                </AccordionTriggerWithValidation>
                                <AccordionContent className="space-y-4">
                                    <InputField
                                        name="stock"
                                        label={t("stock")}
                                        type="number"
                                        defaultValue="0"
                                        startContent={hasStoreId ? <Package /> : undefined}
                                    />
                                    <InputField
                                        name="description"
                                        label={t("description")}
                                        type="text"
                                        startContent={hasStoreId ? <FileText /> : undefined}
                                    />
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="is-active">Producto activo</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    El producto estará disponible para la venta
                                                </p>
                                            </div>
                                            <Switch
                                                id="is-active"
                                                checked={isActive}
                                                onCheckedChange={setIsActive}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="is-featured">Producto destacado</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Aparecerá en la sección de productos destacados
                                                </p>
                                            </div>
                                            <Switch
                                                id="is-featured"
                                                checked={isFeatured}
                                                onCheckedChange={setIsFeatured}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="is-published">Producto publicado</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Será visible en la tienda pública
                                                </p>
                                            </div>
                                            <Switch
                                                id="is-published"
                                                checked={isPublished}
                                                onCheckedChange={setIsPublished}
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UnifiedCreateProductButton 