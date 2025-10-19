"use client"

import { Phone } from "lucide-react"
import { useTranslations } from "next-intl"

import { AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { InputField } from "@/features/layout/components"
import { ContactSectionProps } from "@/features/stores/types"

function ContactSection({ store, mode }: ContactSectionProps) {
    const t = useTranslations(mode === 'create' ? "store.create-store" : "store.edit-store")

    return (
        <AccordionItem value="item-2">
            <AccordionTriggerWithValidation keys={["contact_phone", "contact_email"]}>
                <span className="flex items-center gap-2">
                    <Phone className="size-4" />
                    {t("contact-section")}
                </span>
            </AccordionTriggerWithValidation>
            <AccordionContent className="space-y-4">
                <InputField
                    name="contact_phone"
                    label={t("contact-phone")}
                    type="tel"
                    defaultValue={store?.branches?.[0]?.phone || ""}
                />
                <InputField
                    name="contact_email"
                    label="Email"
                    type="email"
                    defaultValue={store?.branches?.[0]?.email || ""}
                />
            </AccordionContent>
        </AccordionItem>
    )
}

export { ContactSection }
