'use server'

import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createClient } from '@/utils/supabase/server-props'
import { insertUser } from '../data/insertUser'

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
        throw new Error('No user returned')
    }

    const { payload: existingUser } = await getUserByEmail(user.email ?? "")

    if (!existingUser) {

        const { error: insertError } = await insertUser(user.email ?? "", "email")

        if (insertError) {
            console.error('Error inserting user:', insertError)
            throw new Error('Error inserting user')
        }
    }


    return { success: true }
}
