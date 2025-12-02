"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Separator } from "react-aria-components"
import { toast } from "sonner"

/* import { createUnifiedProductAction } from "@/features/products/actions/create-unified-product.action"
 */import { CreateProductForm } from "@/features/products/components/create-form/create-product-form"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { SourcePlaceholderPanel } from "@/features/products/components/create-form/source-placeholder-panel"
import { SourceProductPanel } from "@/features/products/components/create-form/source-product-panel"
/* import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
 *//* import { CreateUnifiedProductArgs } from "@/features/products/types"
 */import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/features/shadcn/components/ui/dialog"

export function CreateProductContent({ /* userId, */ storeId }: { userId: number; storeId?: number }) {

    const { step, setStep, closeDialog } = useCreateProductContext()
    const t = useTranslations("store.create-product")
    const [selectedSource, setSelectedSource] = useState<"AI" | "FILE" | "MANUAL" | null>(null)

    const handleCreateProduct = async (/* data: CreateProductFormType */) => {

        if (!storeId) {
            toast.error("Store ID is missing")
            return { hasError: true, message: "Store ID is missing", payload: null }
        }

        setStep(5) // Loading step (was 6)

        // Map form data to action args
        // This is a simplified mapping. You will need to refine this based on your exact form structure and action requirements.
        /* const args: CreateUnifiedProductArgs = {
            form: {
                name: data.basic_info.name,
                description: data.basic_info.description,
                slug: data.basic_info.slug,
                sku: data.basic_info.sku,
                barcode: data.basic_info.barcode,
                price: data.price_stock_info.price,
                stock: data.price_stock_info.stock,
                categories: [], // Categories need to be handled in the form
                images: [], // Images need to be handled (often passed as separate media arg or inside form depending on implementation)
            },
            media: {
                files: data.media_info.images as File[] || [],
                primaryIndex: 0
            },
            settings: {
                isActive: data.settings_info.is_active,
                isFeatured: data.settings_info.is_featured,
                isPublished: data.settings_info.is_published
            },
            targetStoreId: storeId,
            userId: userId
        }

        const { hasError, message, payload } = await createUnifiedProductAction(args) */

        /* if (hasError) {
            toast.error(message)
            setStep(4) // Go back to previous interactive step (Settings)
            return {
                message,
                payload: null,
                hasError: true
            }
        } */

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
            /* payload: payload, */
            payload: null,
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
                <SourceProductPanel
                    selectedSource={selectedSource}
                    onSelect={setSelectedSource}
                />
            ) : (
                <>
                    {selectedSource === "MANUAL" && (
                        <CreateProductForm
                            onSubmitAll={handleCreateProduct}
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

