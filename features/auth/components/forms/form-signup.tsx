'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { yupResolver } from '@hookform/resolvers/yup'
import { handleSignup } from '@/features/auth/actions'
import { loginUserSchema } from '@/features/auth/schemas'
import { Form, InputField } from '@/features/layout/components'

interface SignupFormData {
    email: string;
    password: string;
}

const SignupForm = () => {
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

    return (
        <>
            <h2 className='text-2xl font-bold'>{t("signup")}</h2>
            <Form<SignupFormData>
                resolver={yupResolver(loginUserSchema)}
                formAction={(data) => {
                    submittedEmailRef.current = data.email;
                    return handleSignup(data);
                }}
                contentButton={<span>{t("signup")}</span>}
                successMessage={t("toast-message.success-registered")}
                loadingMessage={t("toast-message.signing-up")}
                onSuccess={handleSuccess}
                className="flex flex-col gap-4 w-full max-w-xl"
            >
                <InputField name="email" label={t("email")} type="email" />
                <InputField name="password" label={t("password")} type="password" />
            </Form>
        </>
    )
}

export default SignupForm;