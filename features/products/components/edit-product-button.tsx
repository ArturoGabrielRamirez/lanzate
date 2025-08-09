"use client"
import { InputField } from "@/features/layout/components"
import { editProduct } from "../actions/editProduct"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil, Upload, X, Box, Package } from "lucide-react"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { EditProductButtonProps } from "@/features/products/type"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from "next-intl"
import { getStoreIdBySlug } from "@/features/categories/data/getStoreIdBySlug"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"

type CategoryValue = { value: string; label: string }

type EditProductPayload = {
    name: string
    price: number
    stock: number
    description?: string
    categories: CategoryValue[]
    image?: File
    is_active?: boolean
    is_featured?: boolean
    is_published?: boolean
}

function EditProductButton({ product, slug, onComplete, userId }: EditProductButtonProps) {

    const [categories, setCategories] = useState<CategoryValue[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [storeId, setStoreId] = useState<number | null>(null)
    const [isActive, setIsActive] = useState(product.is_active)
    const [isFeatured, setIsFeatured] = useState(product.is_featured)
    const [isPublished, setIsPublished] = useState(product.is_published)
    const [open, setOpen] = useState(false)
    const t = useTranslations("store.edit-product")

    // Obtener el storeId a partir del slug
    useEffect(() => {
        const fetchStoreId = async () => {
            const { payload, error } = await getStoreIdBySlug(slug)
            if (!error && payload) {
                setStoreId(payload)
            }
        }
        fetchStoreId()
    }, [slug])

    // Inicializar categorías con las categorías existentes del producto
    useEffect(() => {
        if (product.categories && product.categories.length > 0) {
            const initialCategories = product.categories.map((category: { name: string; id: number }) => ({
                label: category.name,
                value: category.id.toString()
            }))
            setCategories(initialCategories)
        }
    }, [product.categories])

    useEffect(() => {
        if (!open) {
            setIsActive(product.is_active)
            setIsFeatured(product.is_featured)
            setIsPublished(product.is_published)
        }
    }, [open, product.is_active, product.is_featured, product.is_published])

    const handleAddCategory = (value: CategoryValue[]) => {
        setCategories(value)
    }

    const onFileReject = useCallback((file: File, message: string) => {
        const filename = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        toast(message, {
            description: t("file-rejected", { filename }),
        });
    }, [t]);

    const handleEditProduct = async (payload: EditProductPayload) => {
        const data = {
            ...payload,
            categories,
            image: files[0],
            is_active: isActive,
            is_featured: isFeatured,
            is_published: isPublished
        }

        if (!payload.name) return formatErrorResponse(t("validation.name-required"), null, null)
        if (payload.price == null) return formatErrorResponse(t("validation.price-required"), null, null)
        if (payload.stock == null) return formatErrorResponse(t("validation.stock-required"), null, null)
        return editProduct(product.id, data, slug, userId)
    }

    const handleSuccess = async () => {
        setOpen(false)
        if (onComplete) onComplete()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-transparent w-full justify-start">
                    <Pencil className="text-muted-foreground size-4" />
                    {t("button")}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>
                <Form
                    formAction={handleEditProduct}
                    contentButton={t("button")}
                    successMessage={t("messages.success")}
                    loadingMessage={t("messages.loading")}
                    onSuccess={handleSuccess}
                    disabled={false}
                >
                    <div className="space-y-4">
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
                                            maxFiles={1}
                                            maxSize={2 * 1024 * 1024}
                                            className="w-full"
                                            value={files}
                                            onValueChange={setFiles}
                                            onFileReject={onFileReject}
                                            multiple={false}
                                            disabled={files.length > 0}
                                            accept="image/jpg, image/png, image/jpeg"
                                        >
                                            {files.length === 0 && (
                                                <FileUploadDropzone>
                                                    <div className="flex flex-col items-center gap-1 text-center">
                                                        <div className="flex items-center justify-center rounded-full border p-2.5">
                                                            <Upload className="size-6 text-muted-foreground" />
                                                        </div>
                                                        <p className="font-medium text-sm">{t("drag-drop")}</p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {t("click-browse")}
                                                        </p>
                                                    </div>
                                                    <FileUploadTrigger asChild>
                                                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                                                            {t("browse-files")}
                                                        </Button>
                                                    </FileUploadTrigger>
                                                </FileUploadDropzone>
                                            )}
                                            <FileUploadList className="w-full">
                                                {files.map((file, index) => (
                                                    <FileUploadItem key={index} value={file}>
                                                        <FileUploadItemPreview />
                                                        <FileUploadItemMetadata />
                                                        <FileUploadItemDelete asChild>
                                                            <Button variant="ghost" size="icon" className="size-7">
                                                                <X />
                                                            </Button>
                                                        </FileUploadItemDelete>
                                                    </FileUploadItem>
                                                ))}
                                            </FileUploadList>
                                        </FileUpload>
                                    </div>
                                    <InputField 
                                        name="name" 
                                        label={t("name")} 
                                        type="text" 
                                        defaultValue={product.name} 
                                    />
                                    <InputField 
                                        name="price" 
                                        label={t("price")} 
                                        type="number" 
                                        defaultValue={String(product.price)} 
                                    />
                                    <CategorySelect 
                                        onChange={handleAddCategory} 
                                        storeId={storeId || undefined}
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
                                        defaultValue={String(product.stock)} 
                                    />
                                    <InputField 
                                        name="description" 
                                        label={t("description")} 
                                        type="text" 
                                        defaultValue={product.description || ""} 
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

export default EditProductButton 