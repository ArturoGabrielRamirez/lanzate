import { Globe, MapPin, Store } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"
import { cn } from "@/lib/utils"

export function AddressFormPanel() {

    const { setValue, getValues, formState: { isValid }, watch, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const [isPhysicalStore, setIsPhysicalStore] = useState(getValues("address_info.is_physical_store") || false)

    // keep local UI state in sync with form value (rehydration or external updates)
    const isPhysicalStoreValue = watch("address_info.is_physical_store") as boolean | undefined
    useEffect(() => {
        setIsPhysicalStore(!!isPhysicalStoreValue)
    }, [isPhysicalStoreValue])

    const seededRefAddress = useRef(false)
    useEffect(() => {
        if (seededRefAddress.current) return
        seededRefAddress.current = true
        if (values.address_info) setValue("address_info", values.address_info, { shouldValidate: true })
    }, [values.address_info, setValue])

    useEffect(() => {
        const sub = watch((v) => setCtxValues({ address_info: (v as CreateStoreFormValues).address_info }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    useEffect(() => { setStepValid(2, isValid) }, [isValid, setStepValid])

    const handlePhysicalStore = () => {
        setIsPhysicalStore(true)
        setValue("address_info.is_physical_store", true, { shouldValidate: true, shouldDirty: true })
        trigger("address_info")
    }

    const handleOnlineStore = () => {
        setIsPhysicalStore(false)
        setValue("address_info.is_physical_store", false, { shouldValidate: true, shouldDirty: true })
        setValue("address_info.address", "", { shouldValidate: true, shouldDirty: true })
        setValue("address_info.city", "", { shouldValidate: true, shouldDirty: true })
        setValue("address_info.province", "", { shouldValidate: true, shouldDirty: true })
        setValue("address_info.country", "", { shouldValidate: true, shouldDirty: true })
        trigger("address_info")
    }

    return (
        <>
            <div className="grid grid-cols-2 items-center gap-6 text-center justify-center mb-8">
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow", !isPhysicalStore ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handleOnlineStore}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <Globe className="size-8" />
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This is an online store.</p>
                </div>
                <div className={cn("flex flex-col gap-2 opacity-50 border border-primary rounded-md px-4 py-8 grow", isPhysicalStore ? "cursor-pointer opacity-100" : "cursor-pointer")} onClick={handlePhysicalStore}>
                    <h3 className="text-lg font-medium text-primary flex justify-center">
                        <Store className="size-8" />
                    </h3>
                    <p className="text-sm text-muted-foreground text-balance">This is a physical store.</p>
                </div>
            </div>
            {isPhysicalStore && (
                <div className="space-y-4">
                    <InputField
                        name="address_info.address"
                        label="Address"
                        placeholder="Ej: 123 Main St"
                        startIcon={<MapPin />}
                        isRequired
                        tooltip="This is the address of your store. It will be used to display your store on the map."
                    />
                    <InputField
                        name="address_info.city"
                        label="City"
                        placeholder="Ej: New York"
                        startIcon={<MapPin />}
                        isRequired
                        tooltip="This is the city of your store. It will be used to display your store on the map."
                    />
                    <InputField
                        name="address_info.province"
                        label="Province"
                        placeholder="Ej: New York"
                        startIcon={<MapPin />}
                        isRequired
                        tooltip="This is the province of your store. It will be used to display your store on the map."
                    />
                    <InputField
                        name="address_info.country"
                        label="Country"
                        placeholder="Ej: United States"
                        startIcon={<MapPin />}
                        isRequired
                        tooltip="This is the country of your store. It will be used to display your store on the map."
                    />
                </div>
            )}
        </>
    )
}
