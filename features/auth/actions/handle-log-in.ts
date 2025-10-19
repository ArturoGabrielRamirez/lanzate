'use server'


import { getCurrentUser } from '@/features/auth/actions'
import { LoginFormPayload } from '@/features/auth/types'
import { insertLogEntry } from '@/features/layout/data'
import { actionWrapper } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'


export async function handleLogIn(formData: LoginFormPayload) {
  return actionWrapper(async () => {

    const supabase = createServerSideClient()

    const { error: signInError, data: { user: authUser } } = await (await supabase).auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })

    if (signInError || !authUser) {
      return {
        error: true,
        message: 'Invalid credentials',
        payload: null
      }
    }

    const { payload: localUser, error: localUserError } = await getCurrentUser()

    if (localUserError || !localUser) {
      return {
        error: true,
        message: "There was an error after logging in",
        payload: null
      }
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