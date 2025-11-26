"use client"

import { useTranslations } from "next-intl"
/* import { useEffect } from "react" */
import { toast } from "sonner"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/features/shadcn/components/ui/dialog"
import { createStoreAction } from "@/features/stores/actions"
import { CreateStoreForm } from "@/features/stores/components/create-form/create-store-form"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormType } from "@/features/stores/schemas"
/* 
import { processOpeningHours, processPaymentMethods, processShippingMethods } from "@/features/stores/utils" */

export function CreateStoreContent({ userId }: { userId: number }) {

    const { step, setStep/* , closeDialog  */ } = useCreateStoreContext()
    const t = useTranslations("store.create-form")

    /*     useEffect(() => {
            if (step === 7) {
                const timeout = setTimeout(() => {
                    setStep(1)
                    closeDialog()
                }, 2000) // 2 seconds timeout
    
                return () => clearTimeout(timeout)
            }
        }, [step, setStep, closeDialog]) */

    const handleCreateStore = async (data: CreateStoreFormType) => {
        
        const { hasError, message, payload } = await createStoreAction(data, userId)

        if (hasError) {
            toast.error(message)
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
        2: t("descriptions.step3"),
        3: t("descriptions.step5"),
        4: t("descriptions.step2"),
        5: t("descriptions.step4"),
        6: "Elige si tu tienda ofrece delivery o solo retiro en persona",
        7: t("descriptions.step6"),
        8: t("descriptions.step7"),
    }

    const titleSlugs = {
        1: t("steps.basic"),
        2: t("steps.contact"),
        3: t("steps.delivery"),
        4: t("steps.address"),
        5: t("steps.hours"),
        6: "Delivery",
        7: t("steps.success"),
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
