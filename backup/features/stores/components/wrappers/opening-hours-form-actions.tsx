"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { SettingsFormType } from "@/features/stores/schemas"

type OpeningHoursFormActionsProps = {
    isEditing: boolean
    onEdit: () => void
    onCancel: () => void
    onSave: () => void
    isSaving: boolean
    initialValues: SettingsFormType["settings"] | null
}

export function OpeningHoursFormActions({ isEditing, onEdit, onCancel, onSave, isSaving, initialValues }: OpeningHoursFormActionsProps) {

    const { formState: { isValid }, setValue } = useFormContext()
    const { values, setValues } = useCreateStoreContext()

    const handleCancel = () => {

        if (!initialValues) {
            return
        }

        setValues({
            ...values,
            settings: initialValues
        })

        setValue("settings", initialValues)

        onCancel()
    }

    return (
        <div className="flex justify-end gap-2 mt-4">
            {!isEditing && (
                <Button variant={"outline"} onClick={onEdit} type="button">Editar</Button>
            )}
            {isEditing && (
                <Button onClick={handleCancel} variant="destructive" type="button">Cancelar</Button>
            )}
            {isEditing && (
                <Button onClick={onSave} type="button" disabled={isSaving || !isValid}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                    {isSaving ? "Guardando..." : "Guardar"}
                </Button>
            )}
        </div>
    )
}

