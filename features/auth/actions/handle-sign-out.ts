'use server'

import { actionWrapper } from '@/features/global/utils'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleSignOut() {
    return actionWrapper(async () => {

        const supabase = createServerSideClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase.auth.signOut()
            console.log(error)
            if (error) {
                throw new Error(error.message)
            }
        }

        return {
            hasError: false,
            payload: null,
            message: 'Logged out successfully'
        }
    })
}