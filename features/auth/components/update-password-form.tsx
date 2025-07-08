'use client'


import Form from '@/features/layout/components/form'
import InputField from '@/features/layout/components/input'
import { formatErrorResponse } from '@/utils/lib'
import { useState } from 'react'

export default function UpdatePasswordPage() {
    const [done, setDone] = useState(false)

    const handleSubmit = async (payload: any) => {
        try {
            const password = payload.password?.toString() || ''
            const res = await fetch('/auth/update-password', {
                method: 'POST',
                body: new URLSearchParams({ password }),
            })
            if (res.ok) setDone(true)
            return {
                error: false,
                message: "Password updated",
                payload: null
            }
        } catch (error) {
            return formatErrorResponse("Error updating password", error, null)
        }
    }

    return done ? (
        <div className="flex flex-col items-center justify-center h-full">
            <p>Password updated! You can now log in.</p>
        </div>
    ) : (
        <Form
            formAction={handleSubmit}
            contentButton='Update Password'
            successMessage='Password updated!'
            loadingMessage='Updating password...'
            className="flex flex-col p-8 gap-4 sm:gap-6 w-full max-w-xl"
        >
            <InputField name='password' label='New Password:' type='password' />
        </Form>
    )
}