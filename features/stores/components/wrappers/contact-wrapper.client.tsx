"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { BranchEmail, BranchPhone, BranchSocialMedia } from "@prisma/client"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Form } from "@/features/global/components/form/form"
import { updateStoreContactAction } from "@/features/stores/actions/update-store-contact.action"
import { ContactClientWrapper } from "@/features/stores/components/wrappers/contact-client-wrapper"
import { ContactFormActions } from "@/features/stores/components/wrappers/contact-form-actions"
import { contactInfoSchema, ContactInfoFormType } from "@/features/stores/schemas"

type ContactClientWrapperProps = {
    data: {
        phones: BranchPhone[]
        emails: BranchEmail[]
        social_media: BranchSocialMedia[]
    }
    slug?: string | null
}

export function ContactFormWrapper({ data, slug }: ContactClientWrapperProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [transition, startTransition] = useTransition()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = (formData: ContactInfoFormType) => {

        if (!slug) {
            toast.error("No se puede guardar la información de contacto sin un slug")
            return
        }

        toast.loading("Guardando información de contacto...")

        startTransition(async () => {

            const { hasError, message } = await updateStoreContactAction(slug, formData)

            toast.dismiss()

            if (hasError) {
                toast.error(message)
            } else {
                toast.success(message)
                setIsEditing(false)
            }

        })
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    return (
        <Form<ContactInfoFormType>
            contentButton="Guardar"
            resolver={yupResolver(contactInfoSchema as never)}
            submitButtonClassName="self-end w-fit"
            submitButton={false}
            disabled={!isEditing}
            formAction={async () => {
                return {
                    hasError: false,
                    message: "Información de contacto actualizada con éxito!",
                    payload: null
                }
            }}
        >
            <ContactClientWrapper data={data} />
            <ContactFormActions
                isEditing={isEditing}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onSave={handleSave}
                isSaving={transition}
                initialValues={data}
            />
        </Form>
    )
}
