'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import Form from '../../layout/components/form'
import InputField from '../../layout/components/input'
import { schema } from '@/features/auth/schemas/email-schema'
import { handleResetPassword } from '@/features/auth/actions/handleResetPassword'

export default function ResetPassword() {
  return (
    <Form
      resolver={yupResolver(schema)}
      formAction={handleResetPassword}
      successRedirect="/check-email"
      contentButton="Send Reset Link"
      successMessage="Reset link sent!"
      loadingMessage="Sending reset link..."
      className="flex flex-col p-8 gap-4 sm:gap-6"
    >
      <InputField name="email" label="Email:" type="email" />
    </Form>
  )
}
