"use client"

import { InputField, CheckboxField } from "@/features/layout/components"
import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import { AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { Store, Branch } from "@prisma/client"

interface AddressSectionProps {
    store?: Store & { branches: Branch[] }
    mode: 'create' | 'edit'
}

const AddressSection = ({ store, mode }: AddressSectionProps) => {
    
    const t = useTranslations(mode === 'create' ? "store.create-store" : "store.edit-store")

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
                    defaultValue={store?.is_physical_store || false}
                />
                <InputField
                    name="address"
                    label={t("address")}
                    type="text"
                    defaultValue={store?.branches?.[0]?.address || ""}
                />
                <InputField
                    name="city"
                    label={t("city")}
                    type="text"
                    defaultValue={store?.branches?.[0]?.city || ""}
                />
                <InputField
                    name="province"
                    label={t("province")}
                    type="text"
                    defaultValue={store?.branches?.[0]?.province || ""}
                />
                <InputField
                    name="country"
                    label={t("country")}
                    type="text"
                    defaultValue={store?.branches?.[0]?.country || ""}
                />
            </AccordionContent>
        </AccordionItem>
    )
}

export default AddressSection
