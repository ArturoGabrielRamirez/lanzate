"use client"

import { Globe, StoreIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { slugify } from "@/features/stores/utils"

export function BasicInfoFormPanel() {
    const t = useTranslations("store.create-form.basic-info")

    const { setValue, formState: { isValid }, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const { basic_info } = values

    useEffect(() => {
        trigger(["basic_info.name", "basic_info.subdomain"])
        setValue("basic_info.name", basic_info?.name || "")
        setValue("basic_info.subdomain", basic_info?.subdomain || "")
    }, [])

    useEffect(() => {
        setStepValid(1, isValid)
    }, [isValid, setStepValid])

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setCtxValues({ ...values, basic_info: { name, subdomain: slugify(name) } })
        setValue("basic_info.subdomain", slugify(name), { shouldValidate: true, shouldDirty: true })
    }, [setCtxValues, setValue, values])

    const handleSubdomainChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const subdomain = e.target.value
        setCtxValues({ ...values, basic_info: { name: basic_info?.name || "", subdomain } })
    }, [setCtxValues, basic_info, values])

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const description = e.target.value
        setCtxValues({ ...values, basic_info: { name: basic_info?.name || "", subdomain: basic_info?.subdomain || "", description } })
    }, [setCtxValues, basic_info, values])

    return (
        <>
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="basic_info.name"
                        label={t("name")}
                        placeholder={t("name-placeholder")}
                        startIcon={<StoreIcon />}
                        isRequired
                        tooltip={t("name-tooltip")}
                        onChange={handleNameChange}
                    />
                    <InputField
                        name="basic_info.subdomain"
                        label={t("url")}
                        placeholder={t("url-placeholder")}
                        type="url"
                        inputMode="url"
                        startIcon={<Globe />}
                        tooltip={t("url-tooltip")}
                        endText={(
                            <span>
                                .lanzate.com
                            </span>
                        )}
                        isRequired
                        onChange={handleSubdomainChange}
                    />
                </div>
            </>
            <TextareaField
                name="basic_info.description"
                label={t("description")}
                placeholder={t("description-placeholder")}
                onChange={handleDescriptionChange}
            />
        </>
    )
}
