"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { SettingsFormPanel } from "@/features/stores/components/create-form/settings-form-panel"
import { SettingsFormType } from "@/features/stores/schemas"

type OpeningHoursClientWrapperProps = {
    data: SettingsFormType["settings"] | null
}

export function OpeningHoursClientWrapper({ data }: OpeningHoursClientWrapperProps) {

    const { setValues, values } = useCreateStoreContext()
    const { setValue } = useFormContext()

    useEffect(() => {
        if (data) {
            setValues({
                ...values,
                settings: data
            })

            setValue("settings", data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <SettingsFormPanel />
    )
}

