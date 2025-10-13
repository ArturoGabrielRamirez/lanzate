'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { LockIcon, MailIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { handleSignup } from '@/features/auth/actions'
import { signUpSchema } from '@/features/auth/schemas'
import { SignupFormPayload } from '@/features/auth/types'
import { Form } from '@/features/layout/components'
import { InputField } from '@/features/layout/components/input-field'


function SignupForm() {
    const t = useTranslations("auth");
    const router = useRouter();
    const submittedEmailRef = useRef<string>('');

    const handleSuccess = () => {
        const email = submittedEmailRef.current;
        if (email) {
            const url = `/check-email?email=${encodeURIComponent(email)}&type=signup`;
            router.push(url);
        } else {
            router.push('/check-email?type=signup');
        }
    };

    const handleSubmit = (data: SignupFormPayload) => {
        submittedEmailRef.current = data.email;
        return handleSignup(data);
    }

    return (
        <>
            <h2 className='text-2xl font-bold'>{t("signup")}</h2>
            <Form
                resolver={yupResolver(signUpSchema as never)}
                formAction={handleSubmit}
                contentButton={<span>{t("signup")}</span>}
                successMessage={t("toast-message.success-registered")}
                loadingMessage={t("toast-message.signing-up")}
                onSuccess={handleSuccess}
                className="flex flex-col gap-4 w-full max-w-xl"
            >
                <InputField name="email" label={t("email")} placeholder={t("email-placeholder")} startIcon={<MailIcon />} tooltip="Enter the email address associated with your account." />
                <InputField name="username" label={t("username")} placeholder={t("username")} startIcon={<UserIcon />} tooltip="Enter the username associated with your account." />
                <InputField name="password" label={t("password")} placeholder={t("password")} startIcon={<LockIcon />} tooltip="Enter the password associated with your account." type="password" />
                <InputField name="confirm-password" label={t("confirm-password")} placeholder={t("confirm-password")} startIcon={<LockIcon />} tooltip="Enter the password associated with your account." type="password" />
            </Form>
        </>
    )
}

export { SignupForm };