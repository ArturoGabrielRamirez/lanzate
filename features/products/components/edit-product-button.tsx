"use client"
import { editProduct } from "../actions/editProduct"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil, Box, Settings } from "lucide-react"
import { EditProductButtonProps } from "@/features/products/type"
import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/features/shadcn/components/ui/button"
import { useTranslations } from "next-intl"
import { getStoreIdBySlug } from "@/features/categories/data/getStoreIdBySlug"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/features/shadcn/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { Accordion, AccordionContent, AccordionItem } from "@/features/shadcn/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import BasicInfoSection from "./sections/basic-info-section"
import MediaSection from "./sections/media-section"
import PriceStockSection from "./sections/price-stock-section"
import CategoriesSection from "./sections/categories-section"
import SettingsSection from "./sections/settings-section"
import { getProductDetails } from "@/features/products/actions/getProductDetails"


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
    const [productDetails, setProductDetails] = useState<{ media?: { id: number; url: string }[]; primary_media?: { id: number; url: string } | null } | null>(null)
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

    // Load product media when dialog opens
    useEffect(() => {
        const load = async () => {
            if (!open) return
            const { payload } = await getProductDetails(String(product.id))
            if (payload) setProductDetails({ media: payload.media as { id: number; url: string }[] | undefined, primary_media: payload.primary_media as { id: number; url: string } | null })
        }
        load()
    }, [open, product.id])

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
            <DialogContent className="max-h-[80vh] overflow-y-auto">
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
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTriggerWithValidation keys={["name", "slug", "description", "sku", "barcode"]}>
                                    <span className="flex items-center gap-2">
                                        <Box className="size-4" />
                                        Informacion básica
                                    </span>
                                </AccordionTriggerWithValidation>
                                <AccordionContent className="space-y-4">
                                    {productDetails && (
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2 md:col-span-1">
                                                <label className="text-sm font-medium">Imagen principal</label>
                                                <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-lg border bg-secondary">
                                                    {productDetails.primary_media?.url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={productDetails.primary_media.url} alt="Primary image" className="object-cover h-full w-full" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full p-4 text-sm text-muted-foreground">Sin imagen principal</div>
                                                    )}
                                                </div>
                                            </div>
                                            {productDetails.media && productDetails.media.length > 0 && (
                                                <div className="space-y-3 md:col-span-1">
                                                    <label className="text-sm font-medium">Imágenes del producto</label>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                        {productDetails.media.map((m) => (
                                                            <div key={m.id} className={`relative aspect-square overflow-hidden rounded-md bg-secondary border ${productDetails.primary_media?.id === m.id ? 'border-primary ring-2 ring-primary' : 'border-border'}`}>
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={m.url} alt="Product media" className="object-cover h-full w-full" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <MediaSection value={{ files, primaryIndex: null }} onChange={(d) => setFiles(d.files)} onFileReject={onFileReject} />
                                    <BasicInfoSection defaults={{ name: product.name, slug: product.slug, description: product.description ?? undefined, sku: product.sku ?? undefined, barcode: product.barcode ?? undefined }} />
                                    <PriceStockSection defaults={{ price: product.price, stock: product.stock }} />
                                    <CategoriesSection storeId={storeId || undefined} value={{ categories: categories }} onChange={({ categories }) => handleAddCategory(categories)} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTriggerWithValidation keys={["is-active", "is-featured", "is-published"]}>
                                    <span className="flex items-center gap-2">
                                        <Settings className="size-4" />
                                        Configuracion
                                    </span>
                                </AccordionTriggerWithValidation>
                                <AccordionContent className="space-y-4">
                                    <SettingsSection value={{ isActive, isFeatured, isPublished }} onChange={(v) => { setIsActive(v.isActive); setIsFeatured(v.isFeatured); setIsPublished(v.isPublished) }} />
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