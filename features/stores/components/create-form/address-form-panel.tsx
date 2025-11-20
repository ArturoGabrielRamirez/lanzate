import { Globe, MapPin, Store } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import type { Selection } from "react-aria-components"

import { InputField } from "@/features/global/components/form/input-field"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"
import { ChoiceBox, ChoiceBoxItem, ChoiceBoxLabel, ChoiceBoxDescription } from "@/features/shadcn/components/ui/choice-box"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/features/shadcn/components/empty"

export function AddressFormPanel() {

    const { setValue, getValues, formState: { isValid }, watch, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const [isPhysicalStore, setIsPhysicalStore] = useState(getValues("address_info.is_physical_store") || false)

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

    const handleSelectionChange = (selection: Selection) => {
        if (selection === "all") return
        const selected = Array.from(selection)[0]
        if (selected === "physical") {
            handlePhysicalStore()
        } else if (selected === "online") {
            handleOnlineStore()
        }
    }

    return (
        <>
            <ChoiceBox
                columns={2}
                gap={2}
                selectionMode="single"
                selectedKeys={[isPhysicalStore ? "physical" : "online"]}
                onSelectionChange={handleSelectionChange}
            >
                <ChoiceBoxItem id="online" textValue="Online Store">
                    <Globe />
                    <ChoiceBoxLabel>Online Store</ChoiceBoxLabel>
                    <ChoiceBoxDescription>This is an online store.</ChoiceBoxDescription>
                </ChoiceBoxItem>
                <ChoiceBoxItem id="physical" textValue="Physical Store">
                    <Store />
                    <ChoiceBoxLabel>Physical Store</ChoiceBoxLabel>
                    <ChoiceBoxDescription>This is a physical store.</ChoiceBoxDescription>
                </ChoiceBoxItem>
            </ChoiceBox>
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
