"use client"

import { Store } from "@prisma/client"
import { CheckIcon, Loader2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

type BasicInfoFormActionsProps = {
    isEditing: boolean
    onEdit: () => void
    onCancel: () => void
    onSave: () => void
    isSaving: boolean
    initialValues: Pick<Store, "logo" | "slug" | "subdomain" | "name" | "description"> & { _count: { products: number } } | null
}

export function BasicInfoFormActions({ isEditing, onEdit, onCancel, onSave, isSaving, initialValues }: BasicInfoFormActionsProps) {

    const { formState: { isValid }, setValue } = useFormContext()
    const { values, setValues } = useCreateStoreContext()

    const handleCancel = () => {

        if (!initialValues) {
            return
        }

        setValues({
            ...values,
            basic_info: {
                name: initialValues.name,
                subdomain: initialValues.subdomain,
                description: initialValues.description || "",
                logo: initialValues.logo
            }
        })

        setValue("basic_info.name", initialValues.name)
        setValue("basic_info.subdomain", initialValues.subdomain)
        setValue("basic_info.description", initialValues.description || "")
        setValue("basic_info.logo", initialValues.logo)

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
                <Button onClick={onSave} type="button" disabled={isSaving || !isValid}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                    {isSaving ? "Guardando..." : "Guardar"}
                </Button>
            )}
        </div>
    )
}

