'use server'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { getLogInPermissionData } from '@/features/auth/data'
import { LoginFormPayload } from '@/features/auth/types'
import { insertLogEntry } from '@/features/global/data/insert-log-entry.data'
import { actionWrapper } from '@/features/global/utils'


export async function handleLogInAction(formData: LoginFormPayload) {
  return actionWrapper(async () => {
    const signInError = await getLogInPermissionData({
      email: typeof formData.email === 'string' ? formData.email : formData.email,
      password: typeof formData.password === 'string' ? formData.password : formData.password
    })

    if (signInError) throw new Error(signInError.message)

    const { payload: localUser, hasError: localUserError } = await getCurrentUserWithIdAndEmailAction()

    if (localUserError) throw new Error('El usuario no existe')
    if (!localUser) throw new Error('El usuario no existe')

    insertLogEntry({
      action: "LOGIN",
      entity_type: "USER",
      entity_id: localUser.id,
      user_id: localUser.id,
      action_initiator: "Formulario de inicio de sesión",
      details: "Usuario inició sesión usando el formulario de inicio de sesión"
    })

    return {
      hasError: false,
      message: "Logged in successfully",
      payload: localUser
    }
  })
}