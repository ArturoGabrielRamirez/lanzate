"use client"

import { Pencil, Box, Settings } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"

import { AccordionTriggerWithValidation } from "@/features/branches/components/accordion-trigger-with-validation"
import { getStoreIdBySlugData } from "@/features/categories/data/get-store-id-by-slug.data"
import { Form } from "@/features/global/components/form/form"
import { formatErrorResponse } from "@/features/global/utils"
import { editProductAction } from "@/features/products/actions/edit-producto.action"
import { getProductDetailsAction } from "@/features/products/actions/get-product-details.action"
import { BasicInfoSection } from "@/features/products/components/sections/basic-info-section"
import { CategoriesSection } from "@/features/products/components/sections/categories-section"
import { MediaSection } from "@/features/products/components/sections/media-section"
import { PriceStockSection } from "@/features/products/components/sections/price-stock-section"
import { SettingsSection } from "@/features/products/components/sections/settings-section"
import { ProductFormProvider, useProductForm } from "@/features/products/contexts/product-form-context"
import { EditProductButtonProps, EditProductPayload } from "@/features/products/types"
import { uploadProductImages } from "@/features/products/utils"
import { Accordion, AccordionContent, AccordionItem } from "@/features/shadcn/components/ui/accordion"
import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/features/shadcn/components/ui/dialog"

function EditProductButtonInner({ product, slug, onComplete, userId }: EditProductButtonProps) {
    const [storeId, setStoreId] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const [productDetails, setProductDetails] = useState<{ media?: { id: number; url: string }[]; primary_media?: { id: number; url: string } | null } | null>(null)
    const [isUploadingImages, setIsUploadingImages] = useState(false)

    const t = useTranslations("store.edit-product")

    // Usar contexto en lugar de useState localess
    const { state, updateCategories, updateSettings, updateMedia, resetForm } = useProductForm()

    // Obtener el storeId a partir del slug
    useEffect(() => {
        const fetchStoreId = async () => {
            const { payload, hasError } = await getStoreIdBySlugData({ slug })
            if (!hasError && payload) {
                setStoreId(payload)
            }
        }
        fetchStoreId()
    }, [slug])

    // Inicializar contexto con categorías y settings del producto
    useEffect(() => {
        if (open && product.categories && product.categories.length > 0) {
            const initialCategories = product.categories.map((category: { name: string; id: number }) => ({
                label: category.name,
                value: category.id.toString()
            }))
            updateCategories({ categories: initialCategories })
        }

        if (open) {
            updateSettings({
                isActive: product.is_active,
                isFeatured: product.is_featured,
                isPublished: product.is_published
            })
        }
    }, [open, product.categories, product.is_active, product.is_featured, product.is_published, updateCategories, updateSettings])

    useEffect(() => {
        if (!open) {
            resetForm()
            setIsUploadingImages(false)
        }
    }, [open, resetForm])

    // Load product media when dialog opens
    useEffect(() => {
        const load = async () => {
            if (!open) return
            const { payload } = await getProductDetailsAction(String(product.id))
            if (payload) {
                setProductDetails({
                    media: payload.media as { id: number; url: string }[] | undefined,
                    primary_media: payload.primary_media as { id: number; url: string } | null
                })

                // ✅ Cargar imágenes existentes al contexto si existen
                if (payload.media && Array.isArray(payload.media) && payload.media.length > 0) {
                    const existingFiles = (payload.media as { id: number; url: string }[]).map((m, _index) => ({
                        id: `existing-${m.id}`,
                        file: new File([], `image-${m.id}`),
                        preview: m.url,
                        isPrimary: payload.primary_media?.id === m.id
                    }))
                    updateMedia({
                        deferredFiles: existingFiles,
                        urls: existingFiles.map(f => f.preview),
                        primaryIndex: existingFiles.findIndex(f => f.isPrimary)
                    })
                }
            }
        }
        load()
    }, [open, product.id, updateMedia])

    const onFileReject = useCallback((file: File, message: string) => {
        const filename = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        toast(message, {
            description: t("file-rejected", { filename }),
        });
    }, [t]);

    const handleEditProduct = async (payload: EditProductPayload) => {
        try {
            const data = {
                ...payload,
                categories: state.categories.categories,
                image: undefined,
                is_active: state.settings.isActive,
                is_featured: state.settings.isFeatured,
                is_published: state.settings.isPublished
            }

            if (!payload.name) return formatErrorResponse(t("validation.name-required"))
            if (payload.price == null) return formatErrorResponse(t("validation.price-required"))
            if (payload.stock == null) return formatErrorResponse(t("validation.stock-required"))

            // Actualizar producto sin imágenes
            const result = await editProductAction(product.id, data, slug, userId)

            // Subir nuevas imágenes si hay
            const mediaFiles = state.media.files || []
            if (mediaFiles.length > 0) {
                setIsUploadingImages(true)
                toast.info('Subiendo nuevas imágenes...')

                try {
                    await uploadProductImages(
                        mediaFiles,
                        product.id,
                        state.media.primaryIndex ?? 0
                    )
                    toast.success('Imágenes actualizadas correctamente')
                } catch (uploadError) {
                    console.error('Error uploading images:', uploadError)
                    toast.warning('Producto actualizado pero hubo un error al subir las imágenes')
                } finally {
                    setIsUploadingImages(false)
                }
            }

            return result
        } catch (error) {
            setIsUploadingImages(false)
            console.error('Error editing product:', error)
            return formatErrorResponse(t("messages.error"))
        }
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
                    contentButton={isUploadingImages ? "Subiendo imágenes..." : t("button")}
                    successMessage={t("messages.success")}
                    loadingMessage={t("messages.loading")}
                    onSuccess={handleSuccess}
                    disabled={isUploadingImages}
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
                                                        <Image src={productDetails.primary_media.url} alt="Primary image" className="object-cover h-full w-full" fill />
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
                                                                <Image src={m.url} alt="Product media" className="object-cover h-full w-full" fill />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <MediaSection
                                        value={state.media}
                                        onChange={() => { }}
                                        onFileReject={onFileReject}
                                    />
                                    <BasicInfoSection defaults={{ name: product.name, slug: product.slug, description: product.description ?? undefined, sku: product.sku ?? undefined, barcode: product.barcode ?? undefined }} />
                                    <PriceStockSection defaults={{ price: product.price, stock: product.stock }} />
                                    <CategoriesSection
                                        storeId={storeId || undefined}
                                        value={{ categories: state.categories.categories }}
                                        onChange={updateCategories}
                                    />
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
                                    <SettingsSection
                                        value={{
                                            isActive: state.settings.isActive,
                                            isFeatured: state.settings.isFeatured,
                                            isPublished: state.settings.isPublished
                                        }}
                                        onChange={updateSettings}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function EditProductButton(props: EditProductButtonProps) {
    return (
        <ProductFormProvider>
            <EditProductButtonInner {...props} />
        </ProductFormProvider>
    )
}

export { EditProductButton }