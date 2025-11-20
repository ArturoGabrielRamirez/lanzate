import { Globe, StoreIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"
import { slugify } from "@/features/stores/utils"

export function BasicInfoFormPanel() {

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
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-10">
                <div className="space-y-2">
                    {/* Logo upload commented out in original code */}
                </div>
                <div className="space-y-4">
                    <InputField
                        name="basic_info.name"
                        label="Name"
                        placeholder="Ej: My Store"
                        startIcon={<StoreIcon />}
                        isRequired
                        tooltip="This is the name of your store. It will be used to identify your store in the system."
                    />
                    <InputField
                        name="basic_info.subdomain"
                        label="URL"
                        placeholder="Ej: my-store"
                        type="url"
                        inputMode="url"
                        startIcon={<Globe />}
                        tooltip="This is the URL of your store. People will use it to access your store."
                        endText={(
                            <span>
                                .lanzate.com
                            </span>
                        )}
                        isRequired
                        onChange={handleSubdomainChange}
                    />
                </div>
            </div>
            <TextareaField
                name="basic_info.description"
                label="Description"
                placeholder="Ej: My Store Description"
            />
        </>
    )
}
