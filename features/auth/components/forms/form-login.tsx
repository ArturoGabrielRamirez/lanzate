'use client'

/* import { yupResolver } from '@hookform/resolvers/yup' */
import { LockIcon, MailIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { handleLogInAction } from '@/features/auth/actions'
/* import { loginFormSchema } from '@/features/auth/schemas' */
import { Form } from '@/features/global/components/form/form'
import { InputField } from '@/features/global/components/form/input-field'

function LoginForm() {

    const t = useTranslations("auth.login.form");

    return (
        <>
            {/* <h2 className='text-2xl font-bold text-center'>{t("login")}</h2> */}
            <Form
               /*  resolver={yupResolver(loginFormSchema as never)} */
                formAction={handleLogInAction}
                contentButton={t("actions.submit")}
                successRedirect="/dashboard"
                successMessage={t("messages.success")}
                loadingMessage={t("messages.loading")}
                className="flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center"
                disabled
            >
                <InputField name="email" label={t("fields.email.label")} placeholder={t("fields.email.placeholder")} startIcon={<MailIcon />} tooltip={t("fields.email.tooltip")} type="email" isRequired disabled/>
                <InputField name="password" label={t("fields.password.label")} placeholder={t("fields.password.placeholder")} startIcon={<LockIcon />} tooltip={t("fields.password.tooltip")} type="password" isRequired disabled/>
            </Form>
        </>
    )
}

export { LoginForm }