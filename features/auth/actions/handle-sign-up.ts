'use server'

import { validateNewUserCreationAction } from '@/features/account/actions'
import { insertUser } from '@/features/auth/data'
import { SignupFormPayload } from '@/features/auth/types'
import { actionWrapper } from '@/features/global/utils'
import { insertLogEntry } from '@/features/layout/data'
import { prisma } from '@/utils/prisma'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleSignup(payload: SignupFormPayload) {
    return actionWrapper(async () => {

        const { email, password, username } = payload

        try {
            const validation = await validateNewUserCreationAction(email)

            if (!validation.payload.canCreate && validation.payload.conflict) {
                throw new Error('User already exists')
            }

        } catch (validationError) {
            console.error('❌ Error en validación:', validationError)
            if (validationError instanceof Error && validationError.message.includes('User already exists')) {
                throw validationError
            }
        }

        const activeUser = await prisma.user.findFirst({
            where: {
                email: email,
                is_anonymized: false,
            }
        })

        if (activeUser) throw new Error('User already exists')

        const supabase = createServerSideClient()

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) throw new Error(signUpError.message)
        if (!signUpData.user) throw new Error('No user returned')

        const { hasError: insertError, payload: user } = await insertUser({
            email,
            provider: "email",
            supabaseUserId: signUpData.user.id,
            username,
        })

        if (insertError) throw new Error('Error inserting user')

        await insertLogEntry({
            action: "CREATE",
            entity_type: "USER",
            entity_id: user.id,
            user_id: user.id,
            action_initiator: "Signup form",
            details: `User signed up using sign up form${activeUser ? ' (email previously anonymized)' : ''}`
        })

        return {
            hasError: false,
            message: "User created successfully",
            payload: signUpData.user
        }
    })
}