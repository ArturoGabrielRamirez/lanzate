'use server'

import { actionWrapper } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'
import { HandleLoginAction } from '@/features/auth/types'
import { insertLogEntry } from '@/features/layout/data'
import { getLocalUser } from '@/features/auth/actions/get-locale-user' // 👈 CAMBIO

export async function handleLogIn(formData: HandleLoginAction) {
  return actionWrapper(async () => {

    const supabase = createServerSideClient()

    const { error: signInError, data: { user: authUser } } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })

    if (signInError || !authUser) {
      throw new Error('Invalid credentials')
    }

    // 👈 USAR getLocalUser EN LUGAR DE getUserByEmail
    const { localUser, error } = await getLocalUser()

    if (error || !localUser) {
      throw new Error("There was an error after logging in")
    }

    insertLogEntry({
      action: "LOGIN",
      entity_type: "USER",
      entity_id: localUser.id,
      user_id: localUser.id,
      action_initiator: "Signin form",
      details: "User signed in using sign in form"
    })

    return {
      error: false,
      message: "Logged in successfully",
      payload: localUser
    }
  })
}