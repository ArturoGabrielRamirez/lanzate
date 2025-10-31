"use client"

//puede borrarse

import { PaymentMethod } from "@prisma/client"
import { CheckIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { updateOperationalSettingsAction } from "@/features/stores/actions"
import { EditOperationalSettingsButtonProps, OperationalSettingsFormPayload } from "@/features/stores/types"
import { cn } from "@/lib/utils"


function EditOperationalSettingsButton({ storeId, store, onSuccess }: EditOperationalSettingsButtonProps) {
    const operationalSettings = store.operational_settings
    const { getValues, formState: { isValid } } = useFormContext()
    const [isLoading, setIsLoading] = useState(false)


    const handleSubmit = async () => {
        const values = getValues() as OperationalSettingsFormPayload
        try {
            const data = {
                offers_delivery: Boolean(values.offers_delivery),
                delivery_price: Boolean(values.offers_delivery) ? (parseFloat(values.delivery_price || "0") || 0) : 0,
                free_delivery_minimum: Boolean(values.offers_delivery) ? (values.free_delivery_minimum ? parseFloat(values.free_delivery_minimum) : null) : null,
                delivery_radius_km: Boolean(values.offers_delivery) ? (parseFloat(values.delivery_radius_km || "5") || 5) : 5,
                payment_methods: (values.payment_methods || operationalSettings?.payment_methods || [PaymentMethod.CASH]) as PaymentMethod[],
                minimum_order_amount: parseFloat(values.minimum_order_amount) || 0
            }

            setIsLoading(true)
            toast.loading("Updating operational settings...")
            const { hasError, message } = await updateOperationalSettingsAction(storeId, data)
            
            if (hasError) {
                throw new Error(message)
            }

            toast.dismiss()
            toast.success("Operational settings updated successfully!")
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error(error)
            toast.dismiss()
            toast.error("Failed to update operational settings")
        } finally {
            setIsLoading(false)
        }
    }

    return (

        <IconButton
            icon={isLoading ? Loader2 : CheckIcon}
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
            className={cn(isLoading && "animate-spin", !isValid && "opacity-50 cursor-not-allowed")}
        />

    )
}

export { EditOperationalSettingsButton }