'use client'

import Form from '@/features/layout/components/form'
import InputField from '@/features/layout/components/input'
import { useState } from 'react'

export default function ResetPage() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string
    const res = await fetch('/auth/reset-password', {
      method: 'POST',
      body: new URLSearchParams({ email }),
    })

    if (res.ok) setDone(true)
  }

  return done ? (
    <p>Check your email for a password reset link.</p>
  ) : (
    <Form
      formAction={handleSubmit}
      contentButton="Send Reset Link"
      successMessage='Reset link sent!'
      loadingMessage='Sending reset link...'
      className="flex flex-col gap-4"
      >
      <InputField name='email' label='Email:' type='email' />
    </Form>
  )
}
