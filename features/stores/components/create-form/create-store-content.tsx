"use client"

import { toast } from "sonner"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/features/shadcn/components/ui/dialog"
import { createStoreAction } from "@/features/stores/actions"
import { CreateStoreForm } from "@/features/stores/components/create-form/create-store-form"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"
import { processOpeningHours, processPaymentMethods, processShippingMethods } from "@/features/stores/utils"

export function CreateStoreContent({ userId }: { userId: number }) {

    const { step, setStep } = useCreateStoreContext()

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
            message: "Store created successfully",
            data: payload
        }
    }

    const descriptions = {
        1: "Choose a name, logo and shipping methods to get started; you can edit your store details later.",
        2: "Choose whether this is a physical store or an online store and add your address information.",
        3: "Add your contact information and social media links so customers can contact you.",
        4: "Choose attention dates and hours so customers know when you are open.",
        5: "Choose your shipping methods and add your payment methods so customers can buy your products.",
        6: "Creating your store…",
        7: "All set! Redirecting…",
    }

    const titleSlugs = {
        1: "Basic",
        2: "Address",
        3: "Contact",
        4: "Hours",
        5: "Delivery",
        6: "Success",
    }

    return (
        <DialogContent className="w-full !max-w-full md:!max-w-2xl h-full rounded-none md:h-auto md:!rounded-lg max-h-dvh !grid-rows-[auto_1fr]">
            <div className="space-y-4">
                <DialogHeader>
                    <DialogTitle>Create Store - {titleSlugs[step as keyof typeof titleSlugs]}</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                    <p>{descriptions[step as keyof typeof descriptions]}</p>
                </DialogDescription>
            </div>
            <CreateStoreForm onSubmitAll={handleCreateStore} />
        </DialogContent>
    )
}
