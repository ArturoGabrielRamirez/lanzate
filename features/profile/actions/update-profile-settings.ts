'use server'

import { prisma } from "@/utils/prisma"

import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { UpdateProfileData } from "../types"
import { getCurrentUser } from "@/features/auth/actions"


export async function updateProfileSettings(data: UpdateProfileData) {
  return actionWrapper(async () => {
    const { payload: currentUser, error } = await getCurrentUser()

    if (error || !currentUser) {
      return formatErrorResponse("Usuario no autenticado", null)
    }

    try {
      // Sanitizar y validar datos
      const sanitizedData: Partial<UpdateProfileData> = {}

      // Campos de texto con validación de longitud
      if (data.first_name !== undefined) {
        sanitizedData.first_name = data.first_name?.trim().substring(0, 50) || null
      }

      if (data.last_name !== undefined) {
        sanitizedData.last_name = data.last_name?.trim().substring(0, 50) || null
      }

      if (data.profile_bio !== undefined) {
        sanitizedData.profile_bio = data.profile_bio?.trim().substring(0, 500) || null
      }

      if (data.location !== undefined) {
        sanitizedData.location = data.location?.trim().substring(0, 100) || null
      }

      // Campos booleanos
      if (data.profile_is_public !== undefined) {
        sanitizedData.profile_is_public = Boolean(data.profile_is_public)
      }

      if (data.show_liked_products !== undefined) {
        sanitizedData.show_liked_products = Boolean(data.show_liked_products)
      }

      if (data.show_comments !== undefined) {
        sanitizedData.show_comments = Boolean(data.show_comments)
      }

      if (data.show_activity !== undefined) {
        sanitizedData.show_activity = Boolean(data.show_activity)
      }

      if (data.show_location !== undefined) {
        sanitizedData.show_location = Boolean(data.show_location)
      }

      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          ...sanitizedData,
          updated_at: new Date()
        },
        include: {
          _count: {
            select: {
              user_follows: true,
              user_follows_following: true,
              product_likes: true
            }
          }
        }
      })

      return formatSuccessResponse("Perfil actualizado correctamente", updatedUser)
    } catch (error) {
      console.error('Error updating profile:', error)
      return formatErrorResponse("Error al actualizar el perfil", null)
    }
  })
}