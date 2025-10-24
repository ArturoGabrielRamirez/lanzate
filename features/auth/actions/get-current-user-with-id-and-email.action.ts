"use server"

import { getUserData, getUserByEmailData, getUserBySupabaseIdData } from "@/features/auth/data"
import { actionWrapper } from "@/features/global/utils"

export async function getCurrentUserWithIdAndEmailAction() {
  return actionWrapper(async () => {

    const { payload: supabaseUser } = await getUserData()

    if (!supabaseUser) throw new Error("Usuario no autenticado")

    const localUser = await getUserBySupabaseIdData({ supabaseUserId: supabaseUser.id })

    if (!localUser.payload) {
      const { payload: backupUser } = await getUserByEmailData({ supabaseUserEmail: supabaseUser.email! })

      if (backupUser) {
        localUser.payload = backupUser
      }

    }

    if (localUser.hasError || !localUser.payload) {
      throw new Error(localUser.message)
    }

    return {
      hasError: false,
      payload: { ...supabaseUser, ...localUser.payload },
      message: "Usuario obtenido exitosamente"
    }
  })
}