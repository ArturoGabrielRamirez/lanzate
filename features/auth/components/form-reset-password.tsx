'use client'

import { handleResetPassword } from '@/features/auth/actions/handleResetPassword'
import { schema } from '@/features/auth/schemas/email-schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, InputField } from '@/features/layout/components'
import { useTranslations } from 'next-intl'

export default function ResetPassword() {

  const t = useTranslations("auth");

  return (
    <Form
      resolver={yupResolver(schema)}
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
