'use server'

import { actionWrapper } from '@/utils/lib'
import { ResponseType } from '@/features/layout/types'
import { createServerSideClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { extractSubdomainFromHost } from '../utils'

export async function handleResetPassword(payload: any): Promise<ResponseType<any>> {
    return actionWrapper(async () => {

        const supabase = createServerSideClient()
        const headersList = await headers()
        const host = headersList.get('host') || ''
        const subdomain = extractSubdomainFromHost(host)

        const baseUrl = `${subdomain ?
            `https://${subdomain}.lanzate.app` :
            `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

        const { error } = await (await supabase).auth.resetPasswordForEmail(payload, {
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
