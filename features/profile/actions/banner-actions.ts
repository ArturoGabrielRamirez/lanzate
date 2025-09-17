'use server'

import { getCurrentUser } from "@/features/auth/actions"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getDefaultBannerForUser } from "../data/get-user-profile"

export async function updateUserBanner(bannerUrl: string) {
  return actionWrapper(async () => {
    const currentUserResponse = await getCurrentUser()
    
    if (!currentUserResponse || currentUserResponse.error) {
      return formatErrorResponse("Debes iniciar sesión para actualizar tu banner", null)
    }

    if (!bannerUrl || typeof bannerUrl !== 'string') {
      return formatErrorResponse("URL de banner inválida", null)
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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        banner: bannerUrl,
        updated_at: new Date()
      },
      select: {
        id: true,
        username: true,
        banner: true,
        first_name: true,
        last_name: true
      }
    })

    return formatSuccessResponse("Banner actualizado correctamente", {
      user: updatedUser,
      bannerUrl: bannerUrl
    })
  })
}

export async function assignDefaultBannerToUser(userId: number | string) {
  return actionWrapper(async () => {
    const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId
    
    if (isNaN(userIdAsNumber)) {
      return formatErrorResponse("ID de usuario inválido para asignar banner por defecto", null)
    }
    
    const defaultBanner = getDefaultBannerForUser(userIdAsNumber)
    
    const updatedUser = await prisma.user.update({
      where: { id: userIdAsNumber },
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

    return formatSuccessResponse("Banner por defecto asignado exitosamente", {
      user: updatedUser,
      banner: defaultBanner
    })
  })
}

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
}