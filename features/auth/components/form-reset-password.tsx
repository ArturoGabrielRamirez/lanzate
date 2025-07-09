'use client'

import { handleResetPassword } from '@/features/auth/actions/handleResetPassword'
import { schema } from '@/features/auth/schemas/email-schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, InputField } from '@/features/layout/components'

export default function ResetPassword() {
  return (
    <Form
      resolver={yupResolver(schema)}
      formAction={handleResetPassword}
      successRedirect="/check-email"
      contentButton="Send Reset Link"
      successMessage="Reset link sent!"
      loadingMessage="Sending reset link..."
      className="flex flex-col p-8 gap-4 sm:gap-6 w-full max-w-xl"
    >
      <InputField name="email" label="Email:" type="email" />
    </Form>
  )
}
