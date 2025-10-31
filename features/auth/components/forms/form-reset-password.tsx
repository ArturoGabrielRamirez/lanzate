'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { MailIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { handleResetPasswordAction } from '@/features/auth/actions'
import { changeEmailSchema } from '@/features/auth/schemas'
import { ChangeEmailFormData } from '@/features/auth/types'
import { Form } from '@/features/global/components/form/form'
import { InputField } from '@/features/global/components/form/input-field'


function ResetPassword() {
  const t = useTranslations("auth.resetPassword.form");
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

  const handleSubmit = (data: ChangeEmailFormData) => {
    submittedEmailRef.current = data.email;
    return handleResetPasswordAction(data);
  };

  return (
    <>
      {/* <h2 className='text-2xl font-bold text-center'>{t("reset-password.title")}</h2> */}
      <Form
        resolver={yupResolver(changeEmailSchema as never)}
        formAction={handleSubmit}
        contentButton={t("actions.submit")}
        successMessage={t("messages.success")}
        loadingMessage={t("messages.loading")}
        onSuccess={handleSuccess}
        className="flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center"
      >
        <InputField name="email" label={t("fields.email.label")} placeholder={t("fields.email.placeholder")} startIcon={<MailIcon />} tooltip={t("fields.email.tooltip")} type="email" description={t("fields.email.description")} isRequired/>
      </Form>
    </>
  )
}

export { ResetPassword }