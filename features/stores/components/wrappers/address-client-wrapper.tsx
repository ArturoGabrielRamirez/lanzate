"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { AddressFormPanel } from "@/features/stores/components/create-form/address-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

type AddressClientWrapperProps = {
    data: {
        is_physical_store: boolean
        address?: string | null
        city?: string | null
        province?: string | null
        country?: string | null
    }
}

export function AddressClientWrapper({ data }: AddressClientWrapperProps) {

    const { setValues, values } = useCreateStoreContext()
    const { setValue } = useFormContext()

    useEffect(() => {
        if (data) {
            const addressInfo = {
                is_physical_store: data.is_physical_store,
                address: data.address || "",
                city: data.city || "",
                province: data.province || "",
                country: data.country || ""
            }

            setValues({
                ...values,
                address_info: addressInfo
            })

            // Trigger validation or updates if needed by setting individual fields or the whole object
            // The AddressFormPanel useEffect handles syncing to local state but we need to ensure react-hook-form has values
            setValue("address_info.is_physical_store", addressInfo.is_physical_store)
            setValue("address_info.address", addressInfo.address)
            setValue("address_info.city", addressInfo.city)
            setValue("address_info.province", addressInfo.province)
            setValue("address_info.country", addressInfo.country)
        }
    }, [])

    return (
        <AddressFormPanel isEditing />
    )
}

