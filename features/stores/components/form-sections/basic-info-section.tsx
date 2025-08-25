"use client"

import { InputField } from "@/features/layout/components"
import { StoreIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { Store } from "@prisma/client"

interface BasicInfoSectionProps {
    store?: Store
    subdomain: string
    onSubdomainChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    mode: 'create' | 'edit'
}

const BasicInfoSection = ({ store, subdomain, onSubdomainChange, mode }: BasicInfoSectionProps) => {
    const t = useTranslations(mode === 'create' ? "store.create-store" : "store.edit-store")

    return (
        <AccordionItem value="item-1">
            <AccordionTriggerWithValidation keys={["name", "description", "subdomain"]}>
                <span className="flex items-center gap-2">
                    <StoreIcon className="size-4" />
                    Basic info
                </span>
            </AccordionTriggerWithValidation>
            <AccordionContent className="space-y-4">
                <InputField
                    name="name"
                    label={t("name")}
                    type="text"
                    defaultValue={store?.name}
                />
                <InputField
                    name="description"
                    label={t("description-field")}
                    type="text"
                    defaultValue={store?.description || ""}
                />
                <div className="relative grid grid-cols-[1fr_auto] gap-2 items-end">
                    <InputField
                        name="subdomain"
                        label={t("subdomain")}
                        type="text"
                        onChange={onSubdomainChange}
                        value={subdomain}
                    />
                    <span className="text-muted-foreground pointer-events-none select-none">
                        .lanzate.com
                    </span>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default BasicInfoSection
