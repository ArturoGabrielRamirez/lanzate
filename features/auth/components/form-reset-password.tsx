'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslations } from 'next-intl'

import { Form, InputField } from '@/features/layout/components'
import { handleResetPassword } from '@/features/auth/actions'
import { emailSchema } from '@/features/auth/schemas'

const ResetPassword = () => {

  const t = useTranslations("auth");

  return (
    <Form
      resolver={yupResolver(emailSchema)}
      formAction={handleResetPassword}
      successRedirect="/check-email"
      contentButton={t("buttons.send-reset-link")}
      successMessage={t("toast-message.success-reset-password")}
      loadingMessage={t("toast-message.reset-password")}
      className="flex flex-col p-8 gap-4 sm:gap-6 w-full max-w-xl"
    >
      <InputField name="email" label={t("email")} type="email" />
    </Form>
  )
}

export default ResetPassword;