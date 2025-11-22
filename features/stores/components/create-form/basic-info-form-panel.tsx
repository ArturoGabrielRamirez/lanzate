import { Globe, Store, StoreIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslations } from "next-intl"

import { InputField } from "@/features/global/components/form/input-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { Empty, EmptyMedia } from "@/features/shadcn/components/empty"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"
import { slugify } from "@/features/stores/utils"

export function BasicInfoFormPanel() {
    const t = useTranslations("store.create-form.basic-info")

    const { setValue, watch, formState: { isValid }, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const [isSubdomainTouched, setIsSubdomainTouched] = useState(() => {
        if (values.basic_info?.subdomain && values.basic_info?.name) {
            return values.basic_info.subdomain !== slugify(values.basic_info.name)
        }
        return false
    })

    const nameValue = watch('basic_info.name')

    const seededRefBasic = useRef(false)

    useEffect(() => {
        if (seededRefBasic.current) return
        seededRefBasic.current = true
        if (values.basic_info) {
            setValue('basic_info', values.basic_info as never, { shouldValidate: true })
        } else {
            trigger("basic_info.name")
        }
    }, [values.basic_info, setValue, trigger])

    useEffect(() => {
        const sub = watch((v) => setCtxValues({ basic_info: (v as CreateStoreFormValues).basic_info }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    const subdomainChange = useCallback((value: string) => {
        const sanitized = slugify(value)
        setValue('basic_info.subdomain', sanitized, { shouldValidate: true, shouldDirty: true })
    }, [setValue])

    const handleSubdomainChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSubdomainTouched(true)
        subdomainChange(e.target.value)
    }, [subdomainChange])

    useEffect(() => {
        if (!isSubdomainTouched) {
            subdomainChange(nameValue || '')
        }
    }, [nameValue, isSubdomainTouched, subdomainChange])

    useEffect(() => {
        setStepValid(1, isValid)
    }, [isValid, setStepValid])

    return (
        <>
            <>
                <div className="space-y-2">
                    {/* Logo upload commented out in original code */}
                    <Empty className="border border-dashed">
                        <EmptyMedia>
                            <Store />
                        </EmptyMedia>
                    </Empty>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="basic_info.name"
                        label={t("name")}
                        placeholder={t("name-placeholder")}
                        startIcon={<StoreIcon />}
                        isRequired
                        tooltip={t("name-tooltip")}
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
            />
        </>
    )
}
