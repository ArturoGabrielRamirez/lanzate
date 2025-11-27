"use client"

import { BranchEmail, BranchPhone, BranchSocialMedia } from "@prisma/client"
import { CheckIcon, Loader2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { ContactInfoFormType } from "@/features/stores/schemas"

type ContactFormActionsProps = {
    isEditing: boolean
    onEdit: () => void
    onCancel: () => void
    onSave: (data: ContactInfoFormType) => void
    isSaving: boolean
    initialValues: {
        phones: BranchPhone[]
        emails: BranchEmail[]
        social_media: BranchSocialMedia[]
    }
}

export function ContactFormActions({ isEditing, onEdit, onCancel, onSave, isSaving, initialValues }: ContactFormActionsProps) {

    const { formState: { isValid }, setValue, handleSubmit } = useFormContext<ContactInfoFormType>()
    const { values, setValues } = useCreateStoreContext()

    const handleCancel = () => {

        const mappedPhones = initialValues.phones.map(p => ({
            phone: p.number,
            is_primary: p.is_primary
        }))
        const mappedEmails = initialValues.emails.map(e => ({
            email: e.email,
            is_primary: e.is_primary
        }))
        const mappedSocial = initialValues.social_media.map(s => ({
            url: s.url,
            is_primary: s.is_primary
        }))

        setValues({
            ...values,
            contact_info: {
                phones: mappedPhones,
                emails: mappedEmails,
                social_media: mappedSocial
            }
        })

        setValue("contact_info.phones", mappedPhones)
        setValue("contact_info.emails", mappedEmails)
        setValue("contact_info.social_media", mappedSocial)

        onCancel()
    }

    return (
        <div className="flex justify-end gap-2">
            {!isEditing && (
                <Button variant={"outline"} onClick={onEdit} type="button">Editar</Button>
            )}
            {isEditing && (
                <Button onClick={handleCancel} variant="destructive" type="button">Cancelar</Button>
            )}
            {isEditing && (
                <Button onClick={handleSubmit(onSave)} type="button" disabled={isSaving || !isValid}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                    {isSaving ? "Guardando..." : "Guardar"}
                </Button>
            )}
        </div>
    )
}
