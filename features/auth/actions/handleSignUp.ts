'use server'

/* 

### 1.1 Registro de Usuario
**Pasos:**
1. Check if email already exists
2. Hash password
3. Create user record
4. Create default account (FREE)
5. Send welcome notification
6. Crear registro en action_logs ("register_user")

**Tablas involucradas:**
- `users` (CREATE)
- `accounts` (CREATE)
- `notifications` (CREATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Email duplicado → Rollback completo
- Error en hash → No crear usuario
- Error en account → Rollback user creation

*/

import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { createServerSideClient } from '@/utils/supabase/server'
import { insertUser } from '../data/insertUser'
import { ResponseType } from '@/features/layout/types'
import { actionWrapper } from '@/utils/lib'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'

export const handleSignup = async (payload: any): Promise<ResponseType<any>> => {
    return actionWrapper(async () => {
        const supabase = createServerSideClient()
        const email = payload.email?.toString() || ''
        const password = payload.password?.toString() || ''

        // Check if user already exists
        const { payload: existingUser } = await getUserByEmail(email)

        // If user already exists, throw error
        if (existingUser) throw new Error('User already exists')

        // Create user in Auth table
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        // If there is an error, throw error
        if (signUpError) throw new Error(signUpError.message)

        // If no user is returned, throw error
        if (!signUpData.user) throw new Error('No user returned')

        // Insert user in database and create default FREE account
        const { error: insertError, payload: user } = await insertUser(email, "email")

        // If there is an error, throw error
        if (insertError) throw new Error('Error inserting user')

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "USER",
            entity_id: user.id,
            user_id: user.id,
            action_initiator: "Signup form",
            details: "User signed up using sign up form"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            error: false,
            message: "User created successfully",
            payload: signUpData.user
        }
    })
}
