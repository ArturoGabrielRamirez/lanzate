'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { LockIcon, MailIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { handleLogIn } from '@/features/auth/actions'
import { loginUserSchema } from '@/features/auth/schemas'
import { Form } from '@/features/layout/components'
import { InputField } from '@/features/layout/components/input-field'

function LoginForm() {

    const t = useTranslations("auth");

    return (
        <>
            <h2 className='text-2xl font-bold text-center'>{t("login")}</h2>
            <Form
                resolver={yupResolver(loginUserSchema as never)}
                formAction={handleLogIn}
                contentButton={t("login")}
                successRedirect="/dashboard"
                successMessage={t("toast-message.success-logged-in")}
                loadingMessage={t("toast-message.signing-in")}
                className="flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center"
            >
                <InputField name="email" label={t("email")} placeholder={t("email-placeholder")} startIcon={<MailIcon />} tooltip="Enter the email address associated with your account." />
                <InputField name="password" label={t("password")} placeholder={t("password")} startIcon={<LockIcon />} tooltip="Enter the password associated with your account." type="password" />
            </Form>
        </>
    )
}

export { LoginForm };