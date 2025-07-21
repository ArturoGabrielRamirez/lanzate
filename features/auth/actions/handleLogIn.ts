'use server'

import { actionWrapper, formatErrorResponse } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'
import { HandleLoginAction } from '../types'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'

/* 

### 1.2 Login de Usuario
**Pasos:**
1. Find user by email
2. Verify password hash
3. Update last_login timestamp
4. Generate session/token
5. Crear registro en action_logs ("login_user")

**Tablas involucradas:**
- `users` (READ, UPDATE)
- `action_logs` (CREATE)

**Manejo de errores:**
- Usuario no encontrado → Error 404
- Password incorrecto → Error 401
- Usuario inactivo → Error 403

*/

export async function handleLogIn(formData: HandleLoginAction) {
  return actionWrapper(async () => {

    const supabase = createServerSideClient()

    const email = formData.email
    const password = formData.password

    const { error: signInError, data: { user: authUser } } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !authUser) throw new Error('Invalid credentials')

    const { error, payload: user } = await getUserByEmail(authUser.email || "")

    if (error || !user) throw new Error("There was an error after logging in")

    // Create action log
    const { error: logError } = await insertLogEntry({
      action: "LOGIN",
      entity_type: "USER",
      entity_id: user.id,
      user_id: user.id,
      action_initiator: "Signin form",
      details: "User signed in using sign in form"
    })

    if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

    return {
      error: false,
      message: "Logged in successfully",
      payload: user
    }

  })
}
