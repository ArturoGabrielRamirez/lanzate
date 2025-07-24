'use client'

import { handleSignup } from '@/features/auth/actions/handleSignUp'
import { schema } from '@/features/auth/schemas/log-user-schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, InputField } from '@/features/layout/components'
import { useTranslations } from 'next-intl'

export default function SignupForm() {
    const t = useTranslations("auth");
    return (
        <Form
            resolver={yupResolver(schema)}
            formAction={handleSignup}
            contentButton={<span>{t("signup")}</span>}
            successRedirect="/check-email"
            successMessage={t("toast-message.success-registered")}
            loadingMessage={t("toast-message.signing-up")}
            className="flex flex-col p-8 gap-4 w-full max-w-xl"
        >
            <InputField name="email" label={t("email")} type="email" />
            <InputField name="password" label={t("password")} type="password" />
        </Form>
    )
}