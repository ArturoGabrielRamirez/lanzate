'use server'

import { headers } from 'next/headers'

import { createResetPasswordData } from '@/features/auth/data'
import { ChangeEmailFormData } from '@/features/auth/types'
import { extractSubdomainFromHost } from '@/features/auth/utils'
import { actionWrapper } from '@/features/global/utils'

export async function handleResetPasswordAction(payload: ChangeEmailFormData) {
    return actionWrapper(async () => {
        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host)
        const baseUrl = `${subdomain ?
            `https://${subdomain}.lanzate.app` :
            `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;
        const { hasError: resetPasswordError, message: resetPasswordMessage } = await createResetPasswordData({ baseUrl, email: payload.email })

        if (resetPasswordError) {
            throw new Error(resetPasswordMessage)
        }

        return {
            hasError: false,
            message: resetPasswordMessage,
            payload: null
        }

    })
}
