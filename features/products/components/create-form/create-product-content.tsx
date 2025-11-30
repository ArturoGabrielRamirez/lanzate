"use client"

import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { createUnifiedProductAction } from "@/features/products/actions/create-unified-product.action"
import { CreateProductForm } from "@/features/products/components/create-form/create-product-form"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { CreateUnifiedProductArgs } from "@/features/products/types"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/features/shadcn/components/ui/dialog"

export function CreateProductContent({ userId, storeId }: { userId: number; storeId?: number }) {

    const { step, setStep, closeDialog } = useCreateProductContext()
    const t = useTranslations("store.create-product")

    const handleCreateProduct = async (data: CreateProductFormType) => {

        if (!storeId) {
            toast.error("Store ID is missing")
            return { hasError: true, message: "Store ID is missing", payload: null }
        }

        setStep(4) // Loading step (adjust index based on steps)

        // Map form data to action args
        // This is a simplified mapping. You will need to refine this based on your exact form structure and action requirements.
        const args: CreateUnifiedProductArgs = {
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

        const { hasError, message, payload } = await createUnifiedProductAction(args)

        if (hasError) {
            toast.error(message)
            setStep(3) // Go back to previous step or stay
            return {
                message,
                payload: null,
                hasError: true
            }
        }

        setStep(5) // Success step
        toast.success(t("messages.success"))

        setTimeout(() => {
            setStep(1)
            closeDialog()
        }, 2000)

        return {
            hasError: false,
            message: t("messages.success"),
            payload: payload,
        }
    }

    const descriptions = {
        1: t("descriptions.step1"),
        2: t("descriptions.step2"),
        3: t("descriptions.step3"),
        4: t("titles.creating"),
        5: t("titles.created"),
    }

    const titleSlugs = {
        1: t("steps.basic"),
        2: t("steps.media"),
        3: t("steps.price_stock"),
        4: t("titles.creating"),
        5: t("titles.created"),
    }

    return (
        <DialogContent className="w-full !max-w-full md:!max-w-2xl h-dvh rounded-none md:h-auto md:!rounded-lg max-h-dvh !grid-rows-[auto_1fr] gap-4 z-[100]">
            <div className="flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle>{t("title")} - {titleSlugs[step as keyof typeof titleSlugs]}</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                    <p>{descriptions[step as keyof typeof descriptions]}</p>
                </DialogDescription>
            </div>
            <CreateProductForm onSubmitAll={handleCreateProduct} />
        </DialogContent>
    )
}

