'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { LockIcon, MailIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { handleLogInAction } from '@/features/auth/actions'
import { loginFormSchema } from '@/features/auth/schemas'
import { Form } from '@/features/global/components/form/form'
import { InputField } from '@/features/global/components/form/input-field'

function LoginForm() {

    const t = useTranslations("auth.login.form");

    return (
        <>
            <Form
                resolver={yupResolver(loginFormSchema)}
                formAction={handleLogInAction}
                contentButton={t("actions.submit")}
                successRedirect="/dashboard"
                successMessage={t("messages.success")}
                loadingMessage={t("messages.loading")}
                className="flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center"
            >
                <InputField name="email" label={t("fields.email.label")} placeholder={t("fields.email.placeholder")} startIcon={<MailIcon />} tooltip={t("fields.email.tooltip")} type="email" isRequired />
                <InputField name="password" label={t("fields.password.label")} placeholder={t("fields.password.placeholder")} startIcon={<LockIcon />} tooltip={t("fields.password.tooltip")} type="password" isRequired />
            </Form>
        </>
    )
}

export { LoginForm }