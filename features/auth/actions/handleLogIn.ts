'use server'

import { actionWrapper } from '@/utils/lib'
import { createServerSideClient } from '@/utils/supabase/server'
import { HandleLoginAction } from '../types'
import { insertLogEntry } from '@/features/layout/data/insertLogEntry'
import { getUserByEmail } from '@/features/layout/data/getUserByEmail'


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

    const { error, payload: user } = await getUserByEmail(authUser.email || "")

    if (error || !user) {
      throw new Error("There was an error after logging in")
    }

    insertLogEntry({
      action: "LOGIN",
      entity_type: "USER",
      entity_id: user.id,
      user_id: user.id,
      action_initiator: "Signin form",
      details: "User signed in using sign in form"
    })

    return {
      error: false,
      message: "Logged in successfully",
      payload: user
    }
  })
}
