"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

import { Form } from "@/features/global/components/form/form"
import { Button } from "@/features/shadcn/components/button"
import { BasicInfoFormPanel } from "@/features/stores/components/create-form/basic-info-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { basicInfoSchemaNew, BasicInfoFormType } from "@/features/stores/schemas"

type BasicInfoData = {
    name: string
    subdomain: string
    description?: string | null
    logo?: string | null
}

type BasicInfoClientWrapperProps = {
    data: BasicInfoData | null
}

export function BasicInfoFormWrapper({ data }: BasicInfoClientWrapperProps) {

    const [isEditing, setIsEditing] = useState(false)

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        setIsEditing(false)
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
            <div className="flex justify-end gap-2">
                {!isEditing && (
                    <Button onClick={handleEdit} type="button">Editar</Button>
                )}
                {isEditing && (
                    <Button onClick={handleCancel} variant="destructive" type="button">Cancelar</Button>
                )}
                {isEditing && (
                    <Button onClick={handleSave} type="button">Guardar</Button>
                )}
            </div>
        </Form>
    )
}

export function BasicInfoClientWrapper({ data }: BasicInfoClientWrapperProps) {

    const { setValues, values } = useCreateStoreContext()
    const { setValue } = useFormContext()

    useEffect(() => {
        if (data) {
            setValues({
                ...values,
                basic_info: {
                    name: data.name,
                    subdomain: data.subdomain,
                    description: data.description || "",
                    logo: data.logo || null
                }
            })

            setValue("basic_info.name", data.name)
            setValue("basic_info.subdomain", data.subdomain)
            setValue("basic_info.description", data.description || "")
            setValue("basic_info.logo", data.logo || null)
        }
    }, [])

    return (
        <BasicInfoFormPanel />
    )
}

