'use server'

import { createClient } from '@/utils/supabase/server-props'

export async function handleResetPassword(formData: FormData) {
    const email = formData.get('email') as string

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.AUTH_URL}auth/confirm?next=/update-password`,
    })

    if (error) {
        console.error('Reset password error:', error)
        throw new Error('Failed to send reset email')
    }

    return { success: true }
}
