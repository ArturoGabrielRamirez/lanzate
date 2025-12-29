'use client'

import { LockIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { UpdatePasswordPayload } from '@/features/auth/types'
import { Form } from '@/features/global/components/form/form'
import { InputField } from '@/features/global/components/form/input-field'
import { formatErrorResponse } from '@/features/global/utils'

export default function UpdatePasswordForm() {

    const [done, setDone] = useState(false)

    const t = useTranslations("auth.updatePassword.form");

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
                message: t("messages.success"),
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
                    <p>{t("messages.completed")}</p>
                </div>
            ) : (
                <Form
                    formAction={handleSubmit}
                    contentButton={t("actions.submit")}
                    successMessage={t("messages.success")}
                    loadingMessage={t("messages.loading")}
                    className="flex flex-col gap-4 w-full max-w-xl"
                >
                    <InputField name='password' label={t("fields.newPassword.label")} type='password' placeholder={t("fields.newPassword.placeholder")} startIcon={<LockIcon />} tooltip={t("fields.newPassword.tooltip")} isRequired />
                </Form>
            )}
        </>)
}