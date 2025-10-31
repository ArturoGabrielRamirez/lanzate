"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { MailIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { joinWaitlistAction } from "@/features/auth/actions"
import { joinWaitlistSchema } from "@/features/auth/schemas"
import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field"

function JoinWaitlist() {

    const t = useTranslations("auth")

    return (
        <Form
            resolver={yupResolver(joinWaitlistSchema as never)}
            formAction={joinWaitlistAction}
            contentButton={t("join-waitlist")}
            successRedirect="/waitlist-success"
            successMessage={t("toast-message.success-joined-waitlist")}
            loadingMessage={t("toast-message.joining-waitlist")}
            resetOnSuccess
            className="flex md:flex-row flex-col  items-end w-full col-start-2 mt-4"
        >
            <InputField name="email" label={t("email")} placeholder={t("email-placeholder")} startIcon={<MailIcon />} tooltip="Enter the email address to join the waitlist" type="email" isRequired hideLabel />
        </Form>
    )
}

export { JoinWaitlist }