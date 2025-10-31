"use client"

import { MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { AccordionTriggerWithValidation } from "@/features/branches/components/accordion-trigger-with-validation"
import { InputField } from "@/features/global/components/form/input-field"
import { AccordionContent, AccordionItem } from "@/features/shadcn/components/ui/accordion"
import { SocialMediaSectionProps } from "@/features/stores/types"

function SocialMediaSection({ mode }: SocialMediaSectionProps) {
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
                    placeholder={t("facebook-url")}
                    type="url"
                    defaultValue={/* store?.facebook_url || */ ""}
                />
                <InputField
                    name="instagram_url"
                    label={t("instagram-url")}
                    placeholder={t("instagram-url")}
                    type="url"
                    defaultValue={/* store?.instagram_url || */ ""}
                />
                <InputField
                    name="x_url"
                    label={t("x-url")}
                    placeholder={t("x-url")}
                    type="url"
                    defaultValue={/* store?.x_url || */ ""}
                />
            </AccordionContent>
        </AccordionItem>
    )
}

export { SocialMediaSection }
