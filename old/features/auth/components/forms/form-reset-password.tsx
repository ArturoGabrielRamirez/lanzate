'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { Form, InputField } from '@/features/layout/components'
import { handleResetPassword } from '@/features/auth/actions'
import { emailSchema } from '@/features/auth/schemas'

interface SignupFormData {
  email: string;
}

const ResetPassword = () => {
  const t = useTranslations("auth");
  const router = useRouter();
  const submittedEmailRef = useRef<string>('');

  const handleSuccess = () => {
    const email = submittedEmailRef.current;

    if (email) {
      const url = `/check-email?email=${encodeURIComponent(email)}&type=recovery`;
      router.push(url);
    } else {
      router.push('/check-email?type=recovery');
    }
  };

  return (
    <Form<SignupFormData>
      resolver={yupResolver(emailSchema as never)}
      formAction={(data) => {
        submittedEmailRef.current = data.email;
        return handleResetPassword(data.email);
      }}
      contentButton={t("buttons.send-reset-link")}
      successMessage={t("toast-message.success-reset-password")}
      loadingMessage={t("toast-message.reset-password")}
      onSuccess={handleSuccess}
      className="flex flex-col p-8 gap-4 sm:gap-6 w-full max-w-xl"
    >
      <InputField name="email" label={t("email")} type="email" />
    </Form>
  )
}

export default ResetPassword