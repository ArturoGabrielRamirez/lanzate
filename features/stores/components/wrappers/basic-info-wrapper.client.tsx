"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Store } from "@prisma/client"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Form } from "@/features/global/components/form/form"
import { updateStoreBasicInfoAction } from "@/features/stores/actions/update-store-basics.action"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { BasicInfoClientWrapper } from "@/features/stores/components/wrappers/basic-info-client-wrapper"
import { BasicInfoFormActions } from "@/features/stores/components/wrappers/basic-info-form-actions"
import { basicInfoSchemaNew, BasicInfoFormType } from "@/features/stores/schemas"

type BasicInfoClientWrapperProps = {
    data: Pick<Store, "logo" | "slug" | "subdomain" | "name" | "description"> & { _count: { products: number } } | null
    slug?: string | null
}

export function BasicInfoFormWrapper({ data, slug }: BasicInfoClientWrapperProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [transition, startTransition] = useTransition()
    const { values } = useCreateStoreContext()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {

        if (!slug) {
            toast.error("No se puede guardar la información básica sin un slug")
            return
        }

        toast.loading("Guardando información básica...")

        startTransition(async () => {

            const { hasError, message } = await updateStoreBasicInfoAction(slug, values)

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
        <Form<BasicInfoFormType>
            contentButton="Guardar"
            resolver={yupResolver(basicInfoSchemaNew as never)}
            submitButtonClassName="self-end w-fit"
            submitButton={false}
            disabled={!isEditing}
            formAction={async () => {
                return {
                    hasError: false,
                    message: "Información básica actualizada con éxito!",
                    payload: null
                }
            }}
        >
            <BasicInfoClientWrapper data={data} />
            <BasicInfoFormActions
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
