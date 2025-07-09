'use server'

import { formatErrorResponse } from '@/utils/lib'
import { ResponseType } from '@/features/layout/types/response-type'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleResetPassword(payload: any): Promise<ResponseType<any>> {

    try {

        const email = payload.email?.toString() || ''

        const supabase = await createServerSideClient()

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

    } catch (error) {
        return formatErrorResponse("Error sending reset password email", error, null)
    }
}
