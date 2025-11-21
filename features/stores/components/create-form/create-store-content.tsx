"use client"

import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/features/shadcn/components/ui/dialog"
import { createStoreAction } from "@/features/stores/actions"
import { CreateStoreForm } from "@/features/stores/components/create-form/create-store-form"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"
import { processOpeningHours, processPaymentMethods, processShippingMethods } from "@/features/stores/utils"

export function CreateStoreContent({ userId }: { userId: number }) {

    const { step, setStep } = useCreateStoreContext()
    const t = useTranslations("store.create-form")

    const handleCreateStore = async (data: CreateStoreFormValues) => {
        const isPhysical = !!data.address_info?.is_physical_store
        const processedData = {
            ...data,
            // If online store, clear address fields to avoid backend validations
            address_info: isPhysical ? data.address_info : { is_physical_store: false },
            processedOpeningHours: processOpeningHours(data.settings?.attention_dates as { days?: string[]; startTime?: string; endTime?: string }[] | undefined),
            processedShippingMethods: processShippingMethods(data.shipping_info?.methods as { providers?: string[]; minPurchase?: string; freeShippingMin?: string; estimatedTime?: string; deliveryPrice?: string }[] | undefined),
            processedPaymentMethods: processPaymentMethods(data.payment_info?.payment_methods as string[] | undefined),
        }

        setStep(6)

        const { hasError, message, payload } = await createStoreAction(processedData, userId)

        if (hasError) {
            toast.error(message)
            setStep(5)
            return {
                success: false,
                error: true,
                message: message,
                data: null
            }
        }

        setStep(7)

        return {
            success: true,
            error: false,
            message: t("messages.store-created-success"),
            data: payload
        }
    }

    const descriptions = {
        1: t("descriptions.step1"),
        2: t("descriptions.step2"),
        3: t("descriptions.step3"),
        4: t("descriptions.step4"),
        5: t("descriptions.step5"),
        6: t("descriptions.step6"),
        7: t("descriptions.step7"),
    }

    const titleSlugs = {
        1: t("steps.basic"),
        2: t("steps.address"),
        3: t("steps.contact"),
        4: t("steps.hours"),
        5: t("steps.delivery"),
        6: t("steps.success"),
    }

    return (
        <DialogContent className="w-full !max-w-full md:!max-w-2xl h-full rounded-none md:h-auto md:!rounded-lg max-h-dvh !grid-rows-[auto_1fr] gap-4">
            <div className="flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle>{t("titles.create-store")} - {titleSlugs[step as keyof typeof titleSlugs]}</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                    <p>{descriptions[step as keyof typeof descriptions]}</p>
                </DialogDescription>
            </div>
            <CreateStoreForm onSubmitAll={handleCreateStore} />
        </DialogContent>
    )
}
