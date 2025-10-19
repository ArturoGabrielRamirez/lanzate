"use client"

//puede borrarse

import { updateOperationalSettingsAction } from "@/features/stores/actions/update-operational-settings.action"
import { PaymentMethod, Store, StoreOperationalSettings } from "@prisma/client"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { CheckIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type EditOperationalSettingsButtonProps = {
    storeId: number
    store: Store & {
        operational_settings?: StoreOperationalSettings | null
    }
    onSuccess?: () => void
}

type OperationalSettingsFormPayload = {
    offers_delivery: boolean
    delivery_price?: string
    free_delivery_minimum?: string
    delivery_radius_km?: string
    minimum_order_amount: string
    payment_methods: PaymentMethod[]
}


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
            const { error, message } = await updateOperationalSettingsAction(storeId, data)
            if (error) {
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

export default EditOperationalSettingsButton 