"use server"

import { EditEmailParams } from "@/features/auth/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function getLogInPermissionData(formData: EditEmailParams) {
    const supabase = createServerSideClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
    })
    if (signInError) {
        return {
            hasError: true,
            message: signInError.message,
            payload: null
        }
    }

}
