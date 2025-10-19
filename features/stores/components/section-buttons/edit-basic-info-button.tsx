"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { updateStoreBasicInfoAction } from "@/features/stores/actions/update-store-basics.action"
import { EditBasicInfoButtonProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

function EditBasicInfoButton({ store, userId, onSuccess }: EditBasicInfoButtonProps) {
    const { getValues, formState: { isValid } } = useFormContext()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {

        const values = getValues()
        const payload = {
            name: values.name,
            description: values.description,
            subdomain: values.subdomain
        }

        try {
            setIsLoading(true)
            toast.loading("Updating basic information...")
            const { hasError, message } = await updateStoreBasicInfoAction(store.slug, payload, userId)

            if (hasError) {
                throw new Error(message)
            }
            toast.dismiss()
            toast.success("Basic information updated successfully!")
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error(error)
            toast.dismiss()
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Failed to update basic information")
            }
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

export { EditBasicInfoButton }
