'use server'

import { createServerSideClient } from '@/utils/supabase/server'
import {/*  getUserByEmail, */ insertLogEntry } from '@/features/layout/data'
import { insertUser } from '@/features/auth/data'
import { actionWrapper } from '@/utils/lib'
import { ResponseType } from '@/features/layout/types'
import { prisma } from '@/utils/prisma'
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system'

export const handleSignup = async (payload: any): Promise<ResponseType<any>> => {
    return actionWrapper(async () => {

        const supabase = createServerSideClient()
        const { email, password, name, lastname, phone, username } = payload

        try {
            const validation = await UserDeletionSystem.validateNewUserCreation(email)

            if (!validation.canCreate && validation.conflict) {
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

        if (activeUser) {
            throw new Error('User already exists')
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) throw new Error(signUpError.message)
        if (!signUpData.user) throw new Error('No user returned')

        const { error: insertError, payload: user } = await insertUser(
            email,
            "email",
            signUpData.user.id,
            undefined,
            username,
            name,
            lastname,
            phone
        )

        if (insertError) throw new Error('Error inserting user')

        insertLogEntry({
            action: "CREATE",
            entity_type: "USER",
            entity_id: user.id,
            user_id: user.id,
            action_initiator: "Signup form",
            details: `User signed up using sign up form${activeUser ? ' (email previously anonymized)' : ''}`
        }).catch(error => console.error('Log error after signup:', error))

        return {
            error: false,
            message: "User created successfully",
            payload: signUpData.user
        }
    })
}