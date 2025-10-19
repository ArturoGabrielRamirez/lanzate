"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { updateStoreSocialMediaAction } from "@/features/stores/actions/update-store-social-media.action"
import { Store, StoreOperationalSettings } from "@prisma/client"
import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EditSocialMediaButtonProps {
    store: Store & { operational_settings: StoreOperationalSettings | null }
    className?: string
    onSuccess?: () => void
}

const EditSocialMediaButton = ({ store, onSuccess }: EditSocialMediaButtonProps) => {
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
            const { error, message } = await updateStoreSocialMedia(store.id, payload)

            if (error) {
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

export default EditSocialMediaButton
