"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { Form } from "@/features/global/components/form/form"
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
    return (
        <Form<BasicInfoFormType>
            contentButton="Guardar"
            resolver={yupResolver(basicInfoSchemaNew as never)}
            submitButtonClassName="self-end w-fit"
            formAction={async () => {
                return {
                    hasError: false,
                    message: "Información básica actualizada con éxito!",
                    payload: null
                }
            }}
        >
            <BasicInfoClientWrapper data={data} />
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

