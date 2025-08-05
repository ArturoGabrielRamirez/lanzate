'use server'

import { actionWrapper } from '@/utils/lib'
import { type ResponseType } from '@/features/layout/types'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleResetPassword(payload: any): Promise<ResponseType<any>> {
    return actionWrapper(async () => {

        const email = payload.email?.toString() || ''

        const supabase = createServerSideClient()

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXTAUTH_URL}auth/confirm?next=/update-password`,
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
