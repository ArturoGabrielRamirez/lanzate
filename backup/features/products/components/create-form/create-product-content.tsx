"use client"

import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Separator } from "react-aria-components"
import { toast } from "sonner"

import { createUnifiedProductAction } from "@/features/products/actions/create-unified-product.action"
import { CreateProductForm } from "@/features/products/components/create-form/create-product-form"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { SourcePlaceholderPanel } from "@/features/products/components/create-form/source-placeholder-panel"
import { SourceProductPanel } from "@/features/products/components/create-form/source-product-panel"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { CreateUnifiedProductArgs } from "@/features/products/types"
import { Button } from "@/features/shadcn/components/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/features/shadcn/components/ui/dialog"

export function CreateProductContent({ userId, storeId }: { userId: number; storeId?: number }) {

    const { step, setStep, closeDialog, values } = useCreateProductContext()
    const t = useTranslations("store.create-product")
    const [selectedSource, setSelectedSource] = useState<"AI" | "FILE" | "MANUAL" | null>(null)

    const mapFormToUnifiedArgs = (data: CreateProductFormType, storeId: number, userId: number): CreateUnifiedProductArgs => {
        // Extract images from media_info - handle both File[] and potential other formats
        const images = data.media_info?.images ?? []
        const imageFiles = images.filter((img): img is File => img instanceof File)
        
        // Find primary index if available
        let primaryIndex: number | null = null
        // You might need to track primary index separately in your form state
        // For now, defaulting to first image
        if (imageFiles.length > 0) {
            primaryIndex = 0
        }

        // Map categories from category_ids to label/value format
        const categories = (data.basic_info?.category_ids ?? []).map((id) => ({
            label: String(id),
            value: String(id)
        }))

        // Map dimensions from type_specific_info.physical or shipping_info
        const physicalDims = data.type_specific_info?.physical
        const shippingDims = data.shipping_info?.dimensions
        const dimensions = {
            height: physicalDims?.height ?? shippingDims?.height ?? undefined,
            heightUnit: physicalDims?.height_unit ?? shippingDims?.unit ?? undefined,
            width: physicalDims?.width ?? shippingDims?.width ?? undefined,
            widthUnit: physicalDims?.width_unit ?? shippingDims?.unit ?? undefined,
            depth: physicalDims?.depth ?? shippingDims?.depth ?? undefined,
            depthUnit: physicalDims?.depth_unit ?? shippingDims?.unit ?? undefined,
            diameter: physicalDims?.diameter ?? undefined,
            diameterUnit: physicalDims?.diameter_unit ?? undefined,
            weight: physicalDims?.weight ?? data.shipping_info?.weight ?? undefined,
            weightUnit: physicalDims?.weight_unit ?? data.shipping_info?.weight_unit ?? undefined,
        }

        // Map variants if they exist
        const variants = data.options_variants_info?.variants?.map((v) => ({
            id: v.id ?? `variant-${Math.random()}`,
            sizeOrMeasure: undefined,
            color: undefined,
            stock: v.stock,
            price: v.price,
        })) ?? []

        return {
            form: {
                name: data.basic_info.name,
                slug: data.basic_info.slug,
                description: data.basic_info.description,
                price: data.price_stock_info?.price ?? 0,
                stock: data.price_stock_info?.stock ?? 0,
                categories: categories,
                images: imageFiles,
                // Include additional fields that might be needed
                type: data.basic_info.type,
                brand: data.basic_info.brand,
                tags: data.basic_info.tags,
            },
            media: {
                files: imageFiles,
                primaryIndex: primaryIndex
            },
            categories: {
                categories: categories
            },
            dimensions: dimensions,
            settings: {
                isActive: data.settings_info?.status !== "ARCHIVED",
                isFeatured: data.settings_info?.is_featured ?? false,
                isPublished: data.settings_info?.status === "ACTIVE",
            },
            variants: variants.length > 0 ? variants : undefined,
            targetStoreId: storeId,
            userId: userId
        }
    }

    const handleCreateProduct = async (data: CreateProductFormType) => {
        if (!storeId) {
            toast.error("Store ID is missing")
            return { hasError: true, message: "Store ID is missing", payload: null }
        }

        setStep(5) // Loading step

        try {
            // Map form data to action args
            const args = mapFormToUnifiedArgs(data, storeId, userId)
            
            const { hasError, message, payload } = await createUnifiedProductAction(args)

            if (hasError) {
                toast.error(message)
                setStep(4) // Go back to previous interactive step (Settings)
                return {
                    message,
                    payload: null,
                    hasError: true
                }
            }

            setStep(6) // Success step
            toast.success(t("messages.success"))

            setTimeout(() => {
                setStep(1)
                closeDialog()
                setSelectedSource(null)
            }, 2000)

            return {
                hasError: false,
                message: t("messages.success"),
                payload: payload,
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido"
            toast.error(errorMessage)
            setStep(4)
            return {
                hasError: true,
                message: errorMessage,
                payload: null
            }
        }
    }

    const descriptions = {
        1: t("descriptions.step2"), // Basic Info
        2: t("descriptions.step3"), // Media
        3: t("descriptions.step4"), // Price & Stock
        4: t("descriptions.step5"), // Settings
        5: t("descriptions.step6"), // Creating
        6: t("descriptions.creating"), // Creating
        7: t("descriptions.created"), // Created
    }

    const titleSlugs = {
        1: t("steps.basic"), // Basic Info
        2: t("steps.media"), // Media
        3: t("steps.price_stock"), // Price & Stock
        4: t("steps.settings"), // Settings
        5: t("steps.step6"), // Creating
        6: t("titles.creating"), // Creating
        7: t("titles.created"), // Created
    }

    return (
        <DialogContent className="w-full !max-w-full md:!max-w-2xl h-dvh rounded-none md:h-auto md:!rounded-lg max-h-dvh !grid-rows-[auto_1fr] gap-4">
            <div className="flex flex-col gap-2">
                <DialogHeader>
                    <DialogTitle>
                        {selectedSource ? `${t("title")} - ${titleSlugs[step as keyof typeof titleSlugs]}` : t("title")}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                    <p>
                        {selectedSource
                            ? descriptions[step as keyof typeof descriptions]
                            : t("descriptions.step1")}
                    </p>
                </DialogDescription>
            </div>
            <Separator />
            {!selectedSource ? (
                <>
                    <SourceProductPanel
                        selectedSource={selectedSource}
                        onSelect={setSelectedSource}
                    />
                    <Separator />
                    <div className="flex justify-end">
                        <Button
                            variant="destructive"
                            onClick={() => closeDialog()}
                        >
                            <X />
                            Cancelar
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    {selectedSource === "MANUAL" && (
                        <CreateProductForm
                            onSubmitAll={() => handleCreateProduct(values)}
                            onExitFlow={() => setSelectedSource(null)}
                            storeId={storeId}
                        />
                    )}
                    {(selectedSource === "AI" || selectedSource === "FILE") && (
                        <SourcePlaceholderPanel
                            source={selectedSource}
                            onBack={() => setSelectedSource(null)}
                        />
                    )}
                </>
            )}
        </DialogContent>
    )
}

