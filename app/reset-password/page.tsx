'use client'

import Form from '@/components/Form/Form'
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
    <Form formAction={handleSubmit} className="flex flex-col gap-4" contentButton={'Send Reset Link'}>
      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
      />
    </Form>
  )
}
