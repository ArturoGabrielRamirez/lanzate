"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { updateStoreContactAction } from "@/features/stores/actions/update-store-contact.action"
import { EditContactButtonProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"

function EditContactButton({ store, onSuccess }: EditContactButtonProps) {
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
            toast.loading("Actualizando información de contacto...")
            const { hasError, message } = await updateStoreContactAction(store.id, payload)

            if (hasError) {
                throw new Error(message)
            }
            toast.dismiss()
            toast.success("Información de contacto actualizada con éxito!")
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error(error)
            toast.dismiss()
            toast.error("Error al actualizar la información de contacto")
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

export { EditContactButton }
