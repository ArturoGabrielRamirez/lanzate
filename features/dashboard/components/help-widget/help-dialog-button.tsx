'use client'

import { useTranslations } from "next-intl"

import { ButtonWithPopup } from "@/features/global/components/button-with-popup";
import InputField from "@/features/global/components/form/input";
import { TextareaField } from "@/features/global/components/form/textarea-field";

function HelpDialogButton() {
    const t = useTranslations("dashboard.help")

    const handleContactUs = async () => {
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