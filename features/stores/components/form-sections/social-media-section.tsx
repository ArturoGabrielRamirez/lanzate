"use client"

import { InputField } from "@/features/layout/components"
import { MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { Store, StoreOperationalSettings } from "@prisma/client"

interface SocialMediaSectionProps {
    store?: Store & { operational_settings: StoreOperationalSettings | null }
    mode: 'create' | 'edit'
}

const SocialMediaSection = ({ store, mode }: SocialMediaSectionProps) => {
    const t = useTranslations(mode === 'create' ? "store.create-store" : "store.edit-store")

    return (
        <AccordionItem value="item-3">
            <AccordionTriggerWithValidation keys={["facebook_url", "instagram_url", "x_url"]}>
                <span className="flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    {t("social-media-section")}
                </span>
            </AccordionTriggerWithValidation>
            <AccordionContent className="space-y-4">
                <InputField
                    name="facebook_url"
                    label={t("facebook-url")}
                    type="url"
                    defaultValue={/* store?.facebook_url || */ ""}
                />
                <InputField
                    name="instagram_url"
                    label={t("instagram-url")}
                    type="url"
                    defaultValue={/* store?.instagram_url || */ ""}
                />
                <InputField
                    name="x_url"
                    label={t("x-url")}
                    type="url"
                    defaultValue={/* store?.x_url || */ ""}
                />
            </AccordionContent>
        </AccordionItem>
    )
}

export default SocialMediaSection
