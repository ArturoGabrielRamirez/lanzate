"use server"

import { createPasswordData, getCurrentUserData } from "@/features/auth/data"
import { NewPassword } from "@/features/auth/types"
import { actionWrapper } from "@/features/global/utils"

export async function handleSetupPasswordAction({ newPassword, confirmNewPassword }: NewPassword) {
  return actionWrapper(async () => {
    const { user, error: userError } = await getCurrentUserData()

    if (newPassword !== confirmNewPassword) {
      return {
        hasError: true,
        message: "Las contraseñas no coinciden",
        payload: null
      }
    }

    if (userError || !user) {
      return {
        hasError: true,
        message: "Usuario no autenticado",
        payload: null
      }
    }

    const { payload: passwordData, hasError: passwordError, message: passwordMessage } = await createPasswordData({ newPassword })

    if (passwordError) {
      return {
        hasError: true,
        message: passwordMessage || "Error al configurar la contraseña",
        payload: null
      }
    }

    return {
      hasError: false,
      message: "Contraseña configurada exitosamente",
      payload: passwordData
    }
  })

}