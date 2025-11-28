"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { BranchShippingMethod } from "@prisma/client"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Form } from "@/features/global/components/form/form"
import { updateStoreShippingAction } from "@/features/stores/actions/update-store-shipping.action"
import { ShippingClientWrapper } from "@/features/stores/components/wrappers/shipping-client-wrapper"
import { ShippingFormActions } from "@/features/stores/components/wrappers/shipping-form-actions"
import { shippingSchema, ShippingFormType } from "@/features/stores/schemas"

type ShippingFormWrapperProps = {
    data: BranchShippingMethod[]
    slug?: string | null
}

export function ShippingFormWrapper({ data, slug }: ShippingFormWrapperProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [transition, startTransition] = useTransition()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = (formData: ShippingFormType) => {

        if (!slug) {
            toast.error("No se puede guardar la información sin un slug")
            return
        }

        toast.loading("Guardando información de envíos...")

        startTransition(async () => {

            const { hasError, message } = await updateStoreShippingAction(slug, formData)

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
        <Form<ShippingFormType>
            contentButton="Guardar"
            resolver={yupResolver(shippingSchema as never)}
            submitButtonClassName="self-end w-fit"
            submitButton={false}
            disabled={!isEditing}
            formAction={async () => {
                return {
                    hasError: false,
                    message: "Información de envíos actualizada con éxito!",
                    payload: null
                }
            }}
        >
            <ShippingClientWrapper data={data} />
            <ShippingFormActions
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

