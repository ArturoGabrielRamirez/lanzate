'use server'

import { createServerSideClient } from '@/utils/supabase/server'
import { getUserByEmail, insertLogEntry } from '@/features/layout/data'
import { insertUser } from '@/features/auth/data'
import { actionWrapper } from '@/utils/lib'
import { ResponseType } from '@/features/layout/types'

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

        const { error: insertError, payload: user } = await insertUser(
            email,
            "email",
            signUpData.user.id
        )
        
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