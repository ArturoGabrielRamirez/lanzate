'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { actionWrapper } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleSignOut() {
    return actionWrapper(async () => {

        const supabase = createServerSideClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase.auth.signOut()
            if (error) {
                throw new Error(error.message)
            }
        }

        revalidatePath('/', 'layout')
        redirect('/login')
    })
}