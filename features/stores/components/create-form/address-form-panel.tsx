import { Globe, MapPin, Store } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"


import { InputField } from "@/features/global/components/form/input-field"
import { ChoiceBox, ChoiceBoxItem, ChoiceBoxLabel, ChoiceBoxDescription } from "@/features/shadcn/components/ui/choice-box"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { AddressFormValues, CreateStoreFormValues } from "@/features/stores/types"

import type { Selection } from "react-aria-components"

export function AddressFormPanel() {
    const t = useTranslations("store.create-form.address")

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
        setCtxValues({ address_info: values.address_info || { is_physical_store: false } as AddressFormValues })
        if (values.address_info) setValue("address_info", values.address_info, { shouldValidate: true })
    }, [values.address_info, setValue, setCtxValues])

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
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{t("store-type")}</p>
                <ChoiceBox
                    columns={2}
                    gap={4}
                    selectionMode="single"
                    selectedKeys={[isPhysicalStore ? "physical" : "online"]}
                    onSelectionChange={handleSelectionChange}
                >
                    <ChoiceBoxItem id="online" textValue={t("online-store")}>
                        <Globe />
                        <ChoiceBoxLabel>{t("online-store")}</ChoiceBoxLabel>
                        <ChoiceBoxDescription>{t("online-store-description")}</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                    <ChoiceBoxItem id="physical" textValue={t("physical-store")}>
                        <Store />
                        <ChoiceBoxLabel>{t("physical-store")}</ChoiceBoxLabel>
                        <ChoiceBoxDescription>{t("physical-store-description")}</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                </ChoiceBox>
            </div>
            <AnimatePresence>
                {isPhysicalStore && (
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <InputField
                            name="address_info.address"
                            label={t("address")}
                            placeholder={t("address-placeholder")}
                            startIcon={<MapPin />}
                            isRequired
                            tooltip={t("address-tooltip")}
                        />
                        <InputField
                            name="address_info.city"
                            label={t("city")}
                            placeholder={t("city-placeholder")}
                            startIcon={<MapPin />}
                            isRequired
                            tooltip={t("city-tooltip")}
                        />
                        <InputField
                            name="address_info.province"
                            label={t("province")}
                            placeholder={t("province-placeholder")}
                            startIcon={<MapPin />}
                            isRequired
                            tooltip={t("province-tooltip")}
                        />
                        <InputField
                            name="address_info.country"
                            label={t("country")}
                            placeholder={t("country-placeholder")}
                            startIcon={<MapPin />}
                            isRequired
                            tooltip={t("country-tooltip")}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
