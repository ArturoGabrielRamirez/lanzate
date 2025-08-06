'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslations } from 'next-intl'

import { Form, InputField } from '@/features/layout/components'
import { handleSignup } from '@/features/auth/actions'
import { loginUserSchema } from '@/features/auth/schemas'

const SignupForm = () => {
    const t = useTranslations("auth");
    return (
        <>
            <h2 className='text-2xl font-bold'>{t("signup")}</h2>
            <Form
                resolver={yupResolver(loginUserSchema)}
                formAction={handleSignup}
                contentButton={<span>{t("signup")}</span>}
                successRedirect="/check-email"
                successMessage={t("toast-message.success-registered")}
                loadingMessage={t("toast-message.signing-up")}
                className="flex flex-col gap-4 w-full max-w-xl"
            >
                <InputField name="email" label={t("email")} type="email" />
                <InputField name="password" label={t("password")} type="password" />
            </Form>
        </>
    )
}

export default SignupForm;