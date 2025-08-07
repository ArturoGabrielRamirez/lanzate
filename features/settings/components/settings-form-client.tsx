"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { settingsSchema } from "@/features/settings/schemas/settings-schema"
/* import { updateStoreSettingsAction } from "@/features/settings/actions/updateStoreSettingsAction" */
import { FormProvider, useForm, FieldValues } from "react-hook-form"
/* import { toast } from "sonner" */

type SettingsFormClientProps = {
    children: React.ReactNode
}

function SettingsFormClient({ children }: SettingsFormClientProps) {

    const defaultValues = {
        primary_color: "#ef4444"
    }

    const methods = useForm({
        resolver: yupResolver(settingsSchema),
        defaultValues: defaultValues,
        mode: 'onChange'
    })

    const onSubmit = async (data: FieldValues) => {
        console.log("🚀 ~ onSubmit ~ data:", data)
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full grow">
                {children}
            </form>
        </FormProvider>
    )
}

export default SettingsFormClient 