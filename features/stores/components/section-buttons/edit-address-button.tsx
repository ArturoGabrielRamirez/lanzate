"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { updateStoreAddressAction } from "@/features/stores/actions/update-store-address.action"
import { EditAddressButtonProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

function EditAddressButton({ store, userId, onSuccess }: EditAddressButtonProps) {
    const { getValues, formState: { isValid } } = useFormContext()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        const values = getValues()
        const payload = {
            is_physical_store: Boolean(values.is_physical_store),
            address: values.address || undefined,
            city: values.city || undefined,
            province: values.province || undefined,
            country: values.country || undefined
        }

        try {
            setIsLoading(true)
            toast.loading("Updating address information...")
            const { hasError, message } = await updateStoreAddressAction(store.slug, payload, userId)

            if (hasError) {
                throw new Error(message)
            }
            toast.dismiss()
            toast.success("Address information updated successfully!")
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error(error)
            toast.dismiss()
            toast.error("Failed to update address information")
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

export { EditAddressButton }
