/* 'use server'

import { getCurrentUser } from "@/features/auth/actions"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getDefaultBannerForUser } from "../utils/get-default-banner-for-user"


export async function removeUserBanner() {
  return actionWrapper(async () => {
    const currentUserResponse = await getCurrentUser()

    if (!currentUserResponse || currentUserResponse.error) {
      return formatErrorResponse("Debes iniciar sesión para remover tu banner", null)
    }

    let userId: number

    if (typeof currentUserResponse.payload.id === 'string') {
      const user = await prisma.user.findUnique({
        where: { supabase_user_id: currentUserResponse.payload.id },
        select: { id: true }
      })

      if (!user) {
        return formatErrorResponse("Usuario no encontrado", null)
      }

      userId = user.id
    } else {
      userId = currentUserResponse.payload.id
    }

    // Asignar banner por defecto en lugar de null
    const defaultBanner = getDefaultBannerForUser(userId)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        banner: defaultBanner,
        updated_at: new Date()
      },
      select: {
        id: true,
        username: true,
        banner: true
      }
    })

    return formatSuccessResponse("Banner restablecido al predeterminado", {
      user: updatedUser,
      banner: defaultBanner
    })
  })
} */