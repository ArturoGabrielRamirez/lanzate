"use server"

import { getUser, getUserByEmail, getUserBySupabaseId } from "@/features/auth/data"
import { actionWrapper } from "@/features/global/utils"

export async function getCurrentUser() {
  return actionWrapper(async () => {

    const supabaseUser = await getUser()
    const localUser = await getUserBySupabaseId(supabaseUser.payload!)

    if (!localUser.payload) {
      const { payload: backupUser } = await getUserByEmail(supabaseUser.payload!)
      if (backupUser) {
        localUser.payload = backupUser
      }
    }

    return {
      hasError: false,
      payload: { ...supabaseUser.payload, ...localUser.payload },
      message: "Usuario obtenido exitosamente"
    }
  })
}