"use server"

import { createServerSideClient } from "@/utils/supabase/server"

export async function getSignOutData() {
    const supabase = createServerSideClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        return {
            hasError: true,
            message: error.message,
            payload: null
        }
    }
}