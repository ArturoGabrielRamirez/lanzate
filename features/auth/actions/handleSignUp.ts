'use server'

import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createClient } from '@/utils/supabase/server-props'
import { redirect } from 'next/navigation'
import { insertUser } from '../data/insertUser'

export const handleSignup = async (formData: FormData): Promise<void> => {
    const supabase = await createClient()
    const email = formData.get('email')?.toString() || ''
    const password = formData.get('password')?.toString() || ''

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (signUpError) {
        redirect('/error')
    }

    const user = signUpData?.user


    if (!user) {
        redirect('/error')
    }

    const { payload: existingUser } = await getUserByEmail(user.email ?? "")

    if (!existingUser) {

        const { error: insertError } = await insertUser(user.email ?? "", "email")

        if (insertError) {
            console.error('Error inserting user into users:', insertError)
            redirect('/error')
        }
    }

    redirect('/check-email')
}