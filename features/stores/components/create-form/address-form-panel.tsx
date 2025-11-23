import { Globe, MapPin, Store } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"


import { InputField } from "@/features/global/components/form/input-field"
import { ChoiceBox, ChoiceBoxItem, ChoiceBoxLabel, ChoiceBoxDescription } from "@/features/shadcn/components/ui/choice-box"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

import type { Selection } from "react-aria-components"

export function AddressFormPanel() {
    const t = useTranslations("store.create-form.address")

    const { setValue, formState: { isValid }, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const { address_info } = values

    const [isPhysicalStore, setIsPhysicalStore] = useState(address_info?.is_physical_store || false)

    useEffect(() => {
        if (address_info) {
            setValue("address_info", address_info)
            setIsPhysicalStore(address_info.is_physical_store)
            if (address_info.is_physical_store) {
                trigger("address_info")
            }
        }
    }, [])

    useEffect(() => {
        setStepValid(3, isValid)
    }, [isValid, setStepValid])

    const handleSelectionChange = (selection: Selection) => {
        if (selection === "all") return
        const selected = Array.from(selection)[0]
        const isPhysical = selected === "physical"

        setIsPhysicalStore(isPhysical)
        setValue("address_info.is_physical_store", isPhysical, { shouldValidate: true, shouldDirty: true })

        if (!isPhysical) {
            setValue("address_info.address", "", { shouldValidate: true, shouldDirty: true })
            setValue("address_info.city", "", { shouldValidate: true, shouldDirty: true })
            setValue("address_info.province", "", { shouldValidate: true, shouldDirty: true })
            setValue("address_info.country", "", { shouldValidate: true, shouldDirty: true })

            setCtxValues({
                address_info: {
                    ...(address_info || { is_physical_store: false, address: "", city: "", province: "", country: "" }),
                    is_physical_store: false,
                    address: "",
                    city: "",
                    province: "",
                    country: ""
                }
            })
        } else {
            setCtxValues({
                address_info: {
                    ...(address_info || { is_physical_store: false, address: "", city: "", province: "", country: "" }),
                    is_physical_store: true
                }
            })
        }
    }

    const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCtxValues({
            address_info: {
                ...(address_info || { is_physical_store: true, address: "", city: "", province: "", country: "" }),
                address: e.target.value
            }
        })
    }, [setCtxValues, address_info])

    const handleCityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCtxValues({
            address_info: {
                ...(address_info || { is_physical_store: true, address: "", city: "", province: "", country: "" }),
                city: e.target.value
            }
        })
    }, [setCtxValues, address_info])

    const handleProvinceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCtxValues({
            address_info: {
                ...(address_info || { is_physical_store: true, address: "", city: "", province: "", country: "" }),
                province: e.target.value
            }
        })
    }, [setCtxValues, address_info])

    const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCtxValues({
            address_info: {
                ...(address_info || { is_physical_store: true, address: "", city: "", province: "", country: "" }),
                country: e.target.value
            }
        })
    }, [setCtxValues, address_info])

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
                            onChange={handleAddressChange}
                        />
                        <InputField
                            name="address_info.city"
                            label={t("city")}
                            placeholder={t("city-placeholder")}
                            startIcon={<MapPin />}
                            isRequired
                            tooltip={t("city-tooltip")}
                            onChange={handleCityChange}
                        />
                        <InputField
                            name="address_info.province"
                            label={t("province")}
                            placeholder={t("province-placeholder")}
                            startIcon={<MapPin />}
                            isRequired
                            tooltip={t("province-tooltip")}
                            onChange={handleProvinceChange}
                        />
                        <InputField
                            name="address_info.country"
                            label={t("country")}
                            placeholder={t("country-placeholder")}
                            startIcon={<MapPin />}
                            isRequired
                            tooltip={t("country-tooltip")}
                            onChange={handleCountryChange}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
