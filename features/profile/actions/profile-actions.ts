/* 'use server'

import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { getUserProfileData } from "../data/get-user-profile-data"

export async function getUserPublicProfile(username: string) {
  return actionWrapper(async () => {
    if (!username || typeof username !== 'string') {
      return formatErrorResponse("Username es requerido", null)
    }

    const profileData = await getUserProfileData(username)

    if (!profileData) {
      return formatErrorResponse("Usuario no encontrado o perfil no público", null)
    }

    return formatSuccessResponse("Perfil obtenido exitosamente", profileData)
  })
} */