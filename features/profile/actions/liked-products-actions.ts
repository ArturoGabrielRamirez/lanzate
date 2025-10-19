/* 'use server'

import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { getUserLikedProductsData } from "../data/get-liked-products"
import { prisma } from "@/utils/prisma"

export async function getUserLikedProducts(
  userId: number,
  limit: number = 20,
  offset: number = 0
) {
  return actionWrapper(async () => {
    if (!userId || typeof userId !== 'number') {
      return formatErrorResponse("ID de usuario inválido", null)
    }

    // Verificar que el usuario existe y su configuración de privacidad
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        profile_is_public: true,
        show_liked_products: true,
        username: true 
      }
    })

    if (!user) {
      return formatErrorResponse("Usuario no encontrado", null)
    }

    // Verificar permisos: perfil público Y mostrar productos gustados habilitado
    if (!user.profile_is_public || !user.show_liked_products) {
      return formatErrorResponse("Los productos gustados de este usuario son privados", null)
    }

    const { likedProducts, totalLiked } = await getUserLikedProductsData(
      userId,
      limit,
      offset
    )

    // Formatear respuesta
    const formattedLikedProducts = likedProducts.map(like => ({
      created_at: like.created_at,
      product: {
        ...like.products,
        price: Number(like.products.price)
      }
    }))

    return formatSuccessResponse("Productos gustados obtenidos exitosamente", {
      likedProducts: formattedLikedProducts,
      user: {
        username: user.username,
        id: user.id
      },
      pagination: {
        total: totalLiked,
        limit,
        offset,
        hasMore: offset + limit < totalLiked,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalLiked / limit)
      }
    })
  })
} */