'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { UpdatePasswordPayload } from '@/features/auth/types'
import { Form } from '@/features/global/components/form/form'
import { InputField } from '@/features/global/components/form/input-field'
import { formatErrorResponse } from '@/features/global/utils'

export default function UpdatePasswordForm() {

    const [done, setDone] = useState(false)

    const t = useTranslations("auth");

    const handleSubmit = async (payload: UpdatePasswordPayload) => {
        try {
            const password = Array.isArray(payload.password)
                ? payload.password[0]?.toString() || ''
                : payload.password?.toString() || ''
            const res = await fetch('/auth/update-password', {
                method: 'POST',
                body: new URLSearchParams({ password }),
            })
            if (res.ok) setDone(true)
            return {
                hasError: false,
                message: "Password updated",
                payload: null
            }
        } catch (error) {
            return formatErrorResponse("Error updating password")
        }
    }

    return (
        <>
            {done ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <p>{t("reset-password.description.password-updated")}</p>
                </div>
            ) : (
                <Form
                    formAction={handleSubmit}
                    contentButton={t("buttons.update-password")}
                    successMessage={t("toast-message.success-password-updated")}
                    loadingMessage={t("toast-message.updating-password")}
                    className="flex flex-col w-full max-w-xl gap-4 p-8 sm:gap-6"
                >
                    <InputField name='password' label={t("reset-password.new-password")} type='password' placeholder={t("reset-password.new-password")} />
                </Form>
            )}
        </>)
}