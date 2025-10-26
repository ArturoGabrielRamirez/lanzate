"use client"

import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { AccordionTriggerWithValidation } from "@/features/branches/components/accordion-trigger-with-validation"
import CheckboxField from "@/features/global/components/form/checkbox-field"
import { InputField } from "@/features/global/components/form/input-field"
import { AccordionContent, AccordionItem } from "@/features/shadcn/components/ui/accordion"
import { AddressSectionProps } from "@/features/stores/types"

function AddressSection({ store, mode }: AddressSectionProps) {
    
    const t = useTranslations(mode === 'create' ? "store.create-store" : "store.edit-store")
    const [isPhysicalStore, setIsPhysicalStore] = useState(store?.is_physical_store || false)
    const mainBranch = store?.branches?.find((branch) => branch.is_main)

    return (
        <AccordionItem value="item-4">
            <AccordionTriggerWithValidation keys={["is_physical_store", "address", "city", "province", "country"]}>
                <span className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {t("address-section")}
                </span>
            </AccordionTriggerWithValidation>
            <AccordionContent className="space-y-4">
                <CheckboxField
                    name="is_physical_store"
                    label={t("is-physical-store")}
                    defaultValue={isPhysicalStore}
                    onChange={(checked) => {
                        setIsPhysicalStore(checked)
                    }}
                />
                <InputField
                    name="address"
                    label={t("address")}
                    placeholder={t("address")}
                    type="text"
                    defaultValue={mainBranch?.address || ""}
                    disabled={!isPhysicalStore}
                />
                <InputField
                    name="city"
                    label={t("city")}
                    placeholder={t("city")}
                    type="text"
                    defaultValue={mainBranch?.city || ""}
                    disabled={!isPhysicalStore}
                />
                <InputField
                    name="province"
                    label={t("province")}
                    placeholder={t("province")}
                    type="text"
                    defaultValue={mainBranch?.province || ""}
                    disabled={!isPhysicalStore}
                />
                <InputField
                    name="country"
                    label={t("country")}
                    placeholder={t("country")}
                    type="text"
                    defaultValue={mainBranch?.country || ""}
                    disabled={!isPhysicalStore}
                />
            </AccordionContent>
        </AccordionItem>
    )
}

export { AddressSection }
