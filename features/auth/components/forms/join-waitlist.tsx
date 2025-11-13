"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { MailIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { joinWaitlistAction } from "@/features/auth/actions"
import { joinWaitlistSchema } from "@/features/auth/schemas"
import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field"

function JoinWaitlist() {

    const t = useTranslations("auth.waitlist.form")

    return (
        <Form
            resolver={yupResolver(joinWaitlistSchema as never)}
            formAction={joinWaitlistAction}
            contentButton={t("actions.submit")}
            successRedirect="/waitlist-success"
            successMessage={t("messages.success")}
            loadingMessage={t("messages.loading")}
            resetOnSuccess
            className="flex md:flex-row flex-col  items-end w-full col-start-2 mt-4"
        >
            <InputField name="email" label={t("fields.email.label")} placeholder={t("fields.email.placeholder")} startIcon={<MailIcon />} tooltip={t("fields.email.tooltip")} type="email" isRequired hideLabel />
        </Form>
    )
}

export { JoinWaitlist }