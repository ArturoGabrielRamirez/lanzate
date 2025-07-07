'use server'

import { createClient } from '@/utils/supabase/server-props'

export const handleSignup = async (formData: FormData) => {
    const supabase = await createClient()

    const email = formData.get('email')?.toString() || ''
    const password = formData.get('password')?.toString() || ''

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (signUpError) {
        console.error(signUpError)
        throw new Error('Failed to sign up')
    }

    const user = signUpData?.user
    if (!user) {
        console.warn('No user returned')
        throw new Error('No user returned from sign up')
    }

    const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle()

    if (selectError) {
        console.error('Error fetching user:', selectError)
        throw new Error('Error fetching user')
    }

    if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert({
            email: user.email,
            password: 'email',
            updated_at: new Date(),
        })

        if (insertError) {
            console.error('Error inserting user:', insertError)
            throw new Error('Error inserting user')
        }
    }

    return { success: true }
}
