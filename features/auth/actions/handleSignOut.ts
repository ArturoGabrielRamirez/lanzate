'use server'

import { createServerSideClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signOut() {
    const supabase = await createServerSideClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { error } = await supabase.auth.signOut()
        if (error) {
            return
        }
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}