'use server'

import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createClient } from '@/utils/supabase/server-props'
import { insertUser } from '../data/insertUser'
import { ResponseType } from '@/features/layout/types'
import { formatErrorResponse } from '@/utils/lib'

export const handleSignup = async (payload: any): Promise<ResponseType<any>> => {
    try {

        const supabase = await createClient()

        const email = payload.email?.toString() || ''
        const password = payload.password?.toString() || ''

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) {
            throw new Error(signUpError.message)
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

        return {
            error: false,
            message: "User created successfully",
            payload: user
        }

    } catch (error) {
        return formatErrorResponse("Error creating user", error, null)
    }
}
