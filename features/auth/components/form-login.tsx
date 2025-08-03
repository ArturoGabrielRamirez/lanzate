'use client'

import { schema } from '@/features/auth/schemas/log-user-schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, InputField } from '@/features/layout/components'
import { handleLogIn } from '../actions/handle-logIn'
import { useTranslations } from 'next-intl'

export default function LoginForm() {

    const t = useTranslations("auth");
    
    return (
        <Form
            resolver={yupResolver(schema)}
            formAction={handleLogIn}
            contentButton={t("login")}
            successRedirect="/dashboard"
            successMessage={t("toast-message.success-logged-in")}
            loadingMessage={t("toast-message.signing-in")}
            className={`flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center`}
        >
            <InputField name="email" label={t("email")} type="email" />
            <InputField name="password" label={t("password")} type="password" />
        </Form>
    )
}