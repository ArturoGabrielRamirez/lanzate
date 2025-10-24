"use server"

import { getUserData, getUserByEmailData, getUserBySupabaseIdData } from "@/features/auth/data"
import { actionWrapper } from "@/features/global/utils"

export async function getCurrentUserWithIdAndEmailAction() {
  return actionWrapper(async () => {

    const supabaseUser = await getUserData()
    const localUser = await getUserBySupabaseIdData({ supabaseUser: supabaseUser.payload! })

    if (!localUser.payload) {
      const { payload: backupUser } = await getUserByEmailData({ supabaseUser: supabaseUser.payload! })
      if (backupUser) {
        localUser.payload = backupUser
      }
    }

    if (localUser.hasError || !localUser.payload) {
      throw new Error(localUser.message)
    }

    return {
      hasError: false,
      payload: { ...supabaseUser.payload, ...localUser.payload },
      message: "Usuario obtenido exitosamente"
    }
  })
}