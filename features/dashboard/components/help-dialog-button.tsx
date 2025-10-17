'use client'

import { useTranslations } from "next-intl"

import { ButtonWithPopup, InputField, TextareaField } from "@/features/layout/components"

function HelpDialogButton() {
    const t = useTranslations("dashboard.help")

    const handleContactUs = async () => {
        console.log("Contact us")
        return {
            error: true,
            message: "Contact us",
            payload: null
        }
    }

    return (
        <ButtonWithPopup
            title={t("dialog.title")}
            action={handleContactUs}
            description={t("dialog.description")}
            text={t("send-message")}
            messages={{
                success: t("dialog.messages.success"),
                error: t("dialog.messages.error"),
                loading: t("dialog.messages.loading")
            }}
            className="w-full"
        >
            <InputField type="email" name="email" label={t("dialog.email")} placeholder={t("dialog.email")} />
            <TextareaField name="message" label={t("dialog.message")} placeholder={t("dialog.message")} />
        </ButtonWithPopup>
    )
}

export { HelpDialogButton }