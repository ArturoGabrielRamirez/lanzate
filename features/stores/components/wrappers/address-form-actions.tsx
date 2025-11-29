"use client"

import { CheckIcon, Loader2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { AddressInfoFormType } from "@/features/stores/schemas"

type AddressFormActionsProps = {
    isEditing: boolean
    onEdit: () => void
    onCancel: () => void
    onSave: (data: AddressInfoFormType) => void
    isSaving: boolean
    initialValues: {
        is_physical_store: boolean
        address?: string | null
        city?: string | null
        province?: string | null
        country?: string | null
    }
}

export function AddressFormActions({ isEditing, onEdit, onCancel, onSave, isSaving, initialValues }: AddressFormActionsProps) {

    const { formState: { isValid }, setValue, handleSubmit } = useFormContext<AddressInfoFormType>()
    const { values, setValues } = useCreateStoreContext()

    const handleCancel = () => {

        if (!initialValues) {
            return
        }

        const addressInfo = {
            is_physical_store: initialValues.is_physical_store,
            address: initialValues.address || "",
            city: initialValues.city || "",
            province: initialValues.province || "",
            country: initialValues.country || ""
        }

        setValues({
            ...values,
            address_info: addressInfo
        })

        setValue("address_info", addressInfo)
        setValue("address_info.is_physical_store", addressInfo.is_physical_store)
        setValue("address_info.address", addressInfo.address)
        setValue("address_info.city", addressInfo.city)
        setValue("address_info.province", addressInfo.province)
        setValue("address_info.country", addressInfo.country)

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
                <Button onClick={handleSubmit(onSave)} type="button" disabled={isSaving || !isValid}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                    {isSaving ? "Guardando..." : "Guardar"}
                </Button>
            )}
        </div>
    )
}
