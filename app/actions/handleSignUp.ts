'use server'


import { createClient } from '@/utils/supabase/server-props'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const handleSignup = async (formData: FormData): Promise<void> => {
    const supabase = await createClient()
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })
    if (error) {
        console.log(error)
        return
    }
    if (data) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            const { user } = session
            if (user) {
                const { id, email, created_at } = user
                console.log(id, email, created_at)
                revalidatePath('/account', 'layout')
                redirect('/account')
            }
        }
    }
}