"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Form } from "@/features/global/components/form/form"
import { updateStoreOpeningHoursAction } from "@/features/stores/actions/update-store-opening-hours.action"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { OpeningHoursClientWrapper } from "@/features/stores/components/wrappers/opening-hours-client-wrapper"
import { OpeningHoursFormActions } from "@/features/stores/components/wrappers/opening-hours-form-actions"
import { settingsSchema, SettingsFormType } from "@/features/stores/schemas"

type OpeningHoursFormWrapperProps = {
    data: SettingsFormType["settings"] | null
    slug: string
}

export function OpeningHoursFormWrapper({ data, slug }: OpeningHoursFormWrapperProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [transition, startTransition] = useTransition()
    const { values } = useCreateStoreContext()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        if (!slug) {
            toast.error("No se puede guardar la información sin un slug")
            return
        }

        toast.loading("Guardando horarios...")

        startTransition(async () => {
            // We use values.settings here as it's synced with the form
            const { hasError, message } = await updateStoreOpeningHoursAction(slug, values.settings)

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
        <Form<SettingsFormType>
            contentButton="Guardar"
            resolver={yupResolver(settingsSchema as never)}
            submitButtonClassName="self-end w-fit"
            submitButton={false}
            disabled={!isEditing}
            formAction={async () => {
                return {
                    hasError: false,
                    message: "Horarios actualizados con éxito!",
                    payload: null
                }
            }}
        >
            <OpeningHoursClientWrapper data={data} />
            <OpeningHoursFormActions
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

