"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { Store, Branch } from "@prisma/client"
import { updateStoreAddressAction } from "@/features/stores/actions/update-store-address.action"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EditAddressButtonProps {
    store: Store & { branches: Branch[] }
    userId: number
    className?: string
    onSuccess?: () => void
}

const EditAddressButton = ({ store, userId, onSuccess }: EditAddressButtonProps) => {
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
            const { error, message } = await updateStoreAddress(store.slug, payload, userId)

            if (error) {
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

export default EditAddressButton
