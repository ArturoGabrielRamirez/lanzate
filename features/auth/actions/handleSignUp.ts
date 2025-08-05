'use server'

import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createServerSideClient } from '@/utils/supabase/server'
import { insertUser } from '../data/insertUser'
import { ResponseType } from '@/features/layout/types'
import { actionWrapper } from '@/utils/lib'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'

export const handleSignup = async (payload: any): Promise<ResponseType<any>> => {
    return actionWrapper(async () => {

        const supabase = createServerSideClient()

        const { email, password } = payload
        const { payload: existingUser } = await getUserByEmail(email)

        if (existingUser) throw new Error('User already exists')
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) throw new Error(signUpError.message)
        if (!signUpData.user) throw new Error('No user returned')

        const { error: insertError, payload: user } = await insertUser(email, "email")
        if (insertError) throw new Error('Error inserting user')

        insertLogEntry({
            action: "CREATE",
            entity_type: "USER",
            entity_id: user.id,
            user_id: user.id,
            action_initiator: "Signup form",
            details: "User signed up using sign up form"
        }).catch(error => console.error('Log error after signup:', error))

        return {
            error: false,
            message: "User created successfully",
            payload: signUpData.user
        }
    })
}
