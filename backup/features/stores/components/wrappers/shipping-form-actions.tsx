"use client"

import { BranchShippingMethod } from "@prisma/client"
import { CheckIcon, Loader2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { ShippingFormType } from "@/features/stores/schemas"
import { reverseMapShippingMethods } from "@/features/stores/utils/shipping-helpers"

type ShippingFormActionsProps = {
    isEditing: boolean
    onEdit: () => void
    onCancel: () => void
    onSave: (data: ShippingFormType) => void
    isSaving: boolean
    initialValues: BranchShippingMethod[]
}

export function ShippingFormActions({ isEditing, onEdit, onCancel, onSave, isSaving, initialValues }: ShippingFormActionsProps) {

    const { formState: { isValid }, setValue, handleSubmit } = useFormContext<ShippingFormType>()
    const { values, setValues } = useCreateStoreContext()

    const handleCancel = () => {
        const mappedMethods = reverseMapShippingMethods(initialValues)
        if (!mappedMethods) return
        const offersDelivery = mappedMethods.length > 0

        setValues({
            ...values,
            shipping_info: {
                offers_delivery: offersDelivery,
                methods: mappedMethods
            }
        })

        setValue("shipping_info.offers_delivery", offersDelivery)
        setValue("shipping_info.methods", mappedMethods)

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

