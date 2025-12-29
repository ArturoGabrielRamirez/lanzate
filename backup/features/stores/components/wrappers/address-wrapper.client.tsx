"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Form } from "@/features/global/components/form/form"
import { updateStoreAddressAction } from "@/features/stores/actions/update-store-address.action"
import { AddressClientWrapper } from "@/features/stores/components/wrappers/address-client-wrapper"
import { AddressFormActions } from "@/features/stores/components/wrappers/address-form-actions"
import { addressInfoSchema, AddressInfoFormType } from "@/features/stores/schemas"
import { UpdateAddressPayload } from "@/features/stores/types"

type AddressFormWrapperProps = {
    data: {
        is_physical_store: boolean
        address?: string | null
        city?: string | null
        province?: string | null
        country?: string | null
    }
    slug?: string | null
}

export function AddressFormWrapper({ data, slug }: AddressFormWrapperProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [transition, startTransition] = useTransition()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = (formData: AddressInfoFormType) => {

        if (!slug) {
            toast.error("No se puede guardar la información sin un slug")
            return
        }

        toast.loading("Guardando dirección...")

        startTransition(async () => {
            const payload: UpdateAddressPayload = {
                is_physical_store: formData.address_info.is_physical_store,
                address: formData.address_info.address,
                city: formData.address_info.city,
                province: formData.address_info.province,
                country: formData.address_info.country
            }

            const { hasError, message } = await updateStoreAddressAction(slug, payload)

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
        <Form<AddressInfoFormType>
            contentButton="Guardar"
            resolver={yupResolver(addressInfoSchema as never)}
            submitButtonClassName="self-end w-fit"
            submitButton={false}
            disabled={!isEditing}
            formAction={async () => {
                return {
                    hasError: false,
                    message: "Dirección actualizada con éxito!",
                    payload: null
                }
            }}
        >
            <AddressClientWrapper data={data} />
            <AddressFormActions
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

