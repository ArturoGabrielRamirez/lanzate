"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { updateStoreSocialMediaAction } from "@/features/stores/actions"
import { EditSocialMediaButtonProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"

function EditSocialMediaButton({ store, onSuccess }: EditSocialMediaButtonProps) {
    const { getValues, formState: { isValid } } = useFormContext()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        const values = getValues()
        const payload = {
            facebook_url: values.facebook_url || undefined,
            instagram_url: values.instagram_url || undefined,
            x_url: values.x_url || undefined
        }

        try {
            setIsLoading(true)
            toast.loading("Updating social media...")
            const { hasError, message } = await updateStoreSocialMediaAction(store.id, payload)

            if (hasError) {
                throw new Error(message)
            }
            toast.dismiss()
            toast.success("Social media updated successfully!")
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error(error)
            toast.dismiss()
            toast.error("Failed to update social media")
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

export { EditSocialMediaButton }
