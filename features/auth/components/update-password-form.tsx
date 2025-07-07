'use client'


import Form from '@/features/layout/components/form'
import InputField from '@/features/layout/components/input'
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
        <div className="flex flex-col items-center justify-center h-full">
            <p>Password updated! You can now log in.</p>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Update Password</h2>
            <p className="mb-6">Enter your new password below:</p>
            <Form formAction={handleSubmit}
                contentButton='Update Password'
                successMessage='Password updated!'
                loadingMessage='Updating password...'
                className="flex flex-col gap-4"
            >
                <InputField name='password' label='New Password:' type='password' />
            </Form>
        </div>
    )
}