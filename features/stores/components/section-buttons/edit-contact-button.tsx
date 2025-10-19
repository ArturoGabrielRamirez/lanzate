"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { updateStoreContactAction } from "@/features/stores/actions/update-store-contact.action"
import { Store, Branch } from "@prisma/client"
import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EditContactButtonProps {
    store: Store & { branches: Branch[] }
    className?: string
    onSuccess?: () => void
}

const EditContactButton = ({ store, onSuccess }: EditContactButtonProps) => {
    const { getValues, formState: { isValid } } = useFormContext()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        const values = getValues()
        const payload = {
            contact_phone: values.contact_phone ?? "",
            contact_email: values.contact_email ?? ""
        }

        try {
            setIsLoading(true)
            toast.loading("Updating contact information...")
            const { error, message } = await updateStoreContact(store.id, payload)

            if (error) {
                throw new Error(message)
            }
            toast.dismiss()
            toast.success("Contact information updated successfully!")
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error(error)
            toast.dismiss()
            toast.error("Failed to update contact information")
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

export default EditContactButton
