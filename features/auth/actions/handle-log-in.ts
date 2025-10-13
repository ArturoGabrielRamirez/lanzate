'use server'

import { getLocalUser } from '@/features/auth/actions';
import { HandleLoginAction } from '@/features/auth/types'
import { actionWrapper } from '@/features/global/utils';
import { insertLogEntry } from '@/features/layout/data'
import { createServerSideClient } from '@/utils/supabase/server'

export async function handleLogIn(formData: HandleLoginAction) {
  return actionWrapper(async () => {

    const supabase = createServerSideClient()

    const { error: signInError, data: { user: authUser } } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })

    if (signInError) throw new Error(signInError.message)

    if (!authUser) throw new Error('User not found')

    const { payload: localUser, hasError: localUserError, message: localUserMessage } = await getLocalUser({ withAccount: false })

    if (localUserError) throw new Error(localUserMessage)

    if (!localUser) throw new Error('User not found')

    insertLogEntry({
      action: "LOGIN",
      entity_type: "USER",
      entity_id: localUser.id,
      user_id: localUser.id,
      action_initiator: "Signin form",
      details: "User signed in using sign in form"
    })

    return {
      hasError: false,
      message: "Logged in successfully",
      payload: localUser
    }
  })
}