'use server'

import { headers } from 'next/headers'

import { ChangeEmailFormData } from '@/features/auth/types'
import { extractSubdomainFromHost } from '@/features/auth/utils'
import { actionWrapper } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleResetPassword(payload: ChangeEmailFormData) {
    return actionWrapper(async () => {

        const supabase = createServerSideClient()
        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host)

        const baseUrl = `${subdomain ?
            `https://${subdomain}.lanzate.app` :
            `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

        const { error } = await supabase.auth.resetPasswordForEmail(payload.email, {
            redirectTo: `${baseUrl}/update-password`,
        })

        if (error) {
            throw new Error(error.message)
        }

        return {
            error: false,
            message: "Reset password email sent",
            payload: null
        }

    })
}
