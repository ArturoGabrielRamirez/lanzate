'use server'

import { createClient } from '@/utils/supabase/server-props'
import { redirect } from 'next/navigation'

export const handleSignup = async (formData: FormData): Promise<void> => {
    const supabase = await createClient()
    const email = formData.get('email')?.toString() || ''
    const password = formData.get('password')?.toString() || ''

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (signUpError) {
        console.log(signUpError)
        redirect('/error')
    }

    const user = signUpData?.user
    if (!user) {
        console.warn('No user returned')
        redirect('/error')
    }

    const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle()

    if (selectError) {
        console.error('Error selecting user:', selectError)
        redirect('/error')
    }

    if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert({
            email: user.email,
            password: "email",
            updated_at: new Date(),
            id: 3,
        })

        if (insertError) {
            console.error('Error inserting user into users:', insertError)
            redirect('/error')
        }
    }

    redirect('/check-email')
}