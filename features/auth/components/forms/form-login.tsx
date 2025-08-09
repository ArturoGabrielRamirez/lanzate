'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslations } from 'next-intl'
import { Form, InputField } from '@/features/layout/components'
import { handleLogIn } from '@/features/auth/actions'
import { loginUserSchema } from '@/features/auth/schemas'

const LoginForm = () => {

    const t = useTranslations("auth");

    return (
        <>
            <h2 className='text-2xl font-bold text-center'>{t("login")}</h2>
            <Form
                resolver={yupResolver(loginUserSchema)}
                formAction={handleLogIn}
                contentButton={t("login")}
                successRedirect="/dashboard"
                successMessage={t("toast-message.success-logged-in")}
                loadingMessage={t("toast-message.signing-in")}
                className="flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center"
            >
                <InputField name="email" label={t("email")} type="email" />
                <InputField name="password" label={t("password")} type="password" />
            </Form>
        </>
    )
}

export default LoginForm;