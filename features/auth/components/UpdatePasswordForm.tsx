'use client'

import Form from '@/components/Form/Form'
import { useState } from 'react'

export default function UpdatePasswordPage() {
    const [done, setDone] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        const password = formData.get('password') as string
        const res = await fetch('/auth/update-password', {
            method: 'POST',
            body: new URLSearchParams({ password }),
        })
        if (res.ok) setDone(true)
    }

    return done ? (
        <p>Password updated! You can now log in.</p>
    ) : (
        <Form formAction={handleSubmit} className="flex flex-col gap-4" contentButton={'Update Password'}>
            <input
                type="password"
                name="password"
                required
                placeholder="New password"
            />
        </Form>
    )
}