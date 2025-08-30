"use server"
import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper } from "@/utils/lib"

export async function handleSetupPassword(newPassword: string) {
  return actionWrapper(async () => {
    const supabase = await createServerSideClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return {
        error: true,
        message: "Usuario no autenticado",
        payload: null
      }
    }

    // Configurar contraseña y marcar que se estableció
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
      data: {
        password_set: true
      }
    })

    if (error) {
      return {
        error: true,
        message: error.message || "Error al configurar la contraseña",
        payload: null
      }
    }

    return {
      error: false,
      message: "Contraseña configurada exitosamente",
      payload: data
    }
  })
}