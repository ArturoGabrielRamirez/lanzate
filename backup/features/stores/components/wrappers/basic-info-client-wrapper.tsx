"use client"

import { Store } from "@prisma/client"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { BasicInfoFormPanel } from "@/features/stores/components/create-form/basic-info-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

type BasicInfoClientWrapperProps = {
    data: Pick<Store, "logo" | "slug" | "subdomain" | "name" | "description"> & { _count: { products: number } } | null
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

