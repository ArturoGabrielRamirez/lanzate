'use server'

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

import { actionWrapper } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'
import { HandleLoginAction } from '../types'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'
import { headers } from 'next/headers'


export async function handleLogIn(formData: HandleLoginAction) {
  return actionWrapper(async () => {

    const supabase = createServerSideClient()

    const email = formData.email
    const password = formData.password

    const { error: signInError, data: { user: authUser } } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !authUser) {
      console.error('Login error:', signInError)
      throw new Error('Invalid credentials')
    }

    const { error, payload: user } = await getUserByEmail(authUser.email || "")

    if (error || !user) {
      console.error('User fetch error after login:', error)
      throw new Error("There was an error after logging in")
    }

    // Create action log
    const { error: logError } = await insertLogEntry({
      action: "LOGIN",
      entity_type: "USER",
      entity_id: user.id,
      user_id: user.id,
      action_initiator: "Signin form",
      details: "User signed in using sign in form"
    })

    if (logError) {
      console.error('Log error after login:', logError)
      // No lanzar error aquí, solo loggear
    }

    // MEJORA: Determinar redirección basada en el hostname
    const headersList = headers()
    const host = (await headersList).get('host') || ''
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'
    
    console.log('Login successful:', { 
      userEmail: user.email, 
      host, 
      rootDomain 
    })

    return {
      error: false,
      message: "Logged in successfully",
      payload: user,
      // Añadir información para el redirect
      redirectInfo: {
        host,
        isSubdomain: host !== rootDomain && host.endsWith(`.${rootDomain}`)
      }
    }

  })
}
