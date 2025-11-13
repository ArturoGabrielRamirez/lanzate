'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { handleSignup } from '@/features/auth/actions'
import { signUpSchema } from '@/features/auth/schemas'
import { SignupFormPayload } from '@/features/auth/types'
import { Form } from '@/features/global/components/form/form'
import { InputField } from '@/features/global/components/form/input-field'


function SignupForm() {
    const t = useTranslations("auth.signup.form");
    const router = useRouter();
    const submittedEmailRef = useRef<{ email: string }>({
        email: ''
    });

    const handleSuccess = () => {
        const { email } = submittedEmailRef.current;
        if (email) {
            const url = `/check-email?email=${encodeURIComponent(email)}&type=signup`;
            router.push(url);
        } else {
            router.push('/check-email?type=signup');
        }
    };

    const handleSubmit = (data: SignupFormPayload) => {
        submittedEmailRef.current = { email: data.email };
        return handleSignup(data);
    }

    return (
        <>
            {/* <h2 className='text-2xl font-bold'>{t("signup")}</h2> */}
            <Form
                resolver={yupResolver(signUpSchema as never)}
                formAction={handleSubmit}
                contentButton={<span>{t("actions.submit")}</span>}
                successMessage={t("messages.success")}
                loadingMessage={t("messages.loading")}
                onSuccess={handleSuccess}
                className="flex flex-col gap-4 w-full max-w-xl"
                disabled
            >
                <InputField name="email" label={t("fields.email.label")} placeholder={t("fields.email.placeholder")} startIcon={<MailIcon />} tooltip={t("fields.email.tooltip")} type="email" isRequired disabled/>
                <InputField name="username" label={t("fields.username.label")} placeholder={t("fields.username.placeholder")} startIcon={<UserIcon />} tooltip={t("fields.username.tooltip")} isRequired disabled/>
                <InputField name="password" label={t("fields.password.label")} placeholder={t("fields.password.placeholder")} startIcon={<LockIcon />} tooltip={t("fields.password.tooltip")} type="password" isRequired disabled/>
                <InputField name="confirm-password" label={t("fields.confirmPassword.label")} placeholder={t("fields.confirmPassword.placeholder")} startIcon={<LockIcon />} tooltip={t("fields.confirmPassword.tooltip")} type="password" isRequired disabled/>
            </Form>
        </>
    )
}

export { SignupForm };