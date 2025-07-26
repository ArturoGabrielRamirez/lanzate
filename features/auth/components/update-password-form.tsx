'use client'

import { Form, InputField } from '@/features/layout/components'
import { formatErrorResponse } from '@/utils/lib'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function UpdatePasswordForm() {
    const [done, setDone] = useState(false)

    const t = useTranslations("auth");

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
            <p>{t("reset-password.password-updated")}</p>
        </div>
    ) : (
        <Form
            formAction={handleSubmit}
            contentButton={t("buttons.update-password")}
            successMessage={t("toast-message.success-password-updated")}
            loadingMessage={t("toast-message.updating-password")}
            className="flex flex-col p-8 gap-4 sm:gap-6 w-full max-w-xl"
        >
            <InputField name='password' label={t("auth.reset-password.new-password")} type='password' />
        </Form>
    )
}