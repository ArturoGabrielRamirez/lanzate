'use server'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { getLogInPermissionData } from '@/features/auth/data'
import { LoginFormPayload } from '@/features/auth/types'
import { actionWrapper } from '@/features/global/utils'
import { insertLogEntry } from '@/features/layout/data'


export async function handleLogInAction(formData: LoginFormPayload) {
  return actionWrapper(async () => {
    const signInError = await getLogInPermissionData({
      email: typeof formData.email === 'string' ? formData.email : (formData.email)?.email,
      password: typeof formData.password === 'string' ? formData.password : (formData.password)?.password
    })

    if (signInError) throw new Error(signInError.message)

    const { payload: localUser, hasError: localUserError } = await getCurrentUserWithIdAndEmailAction()

    if (localUserError) throw new Error('User not found')
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