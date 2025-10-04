/* // features/layout/data/getUserByEmail.ts
// MODIFICAR tu función existente para incluir validación de usuarios anonimizados

import { prisma } from '@/utils/prisma'
import { ResponseType } from '@/features/layout/types'

export const getUserByEmail = async (email: string): Promise<ResponseType<any>> => {
  try {
    // ✨ CAMBIO: Solo buscar usuarios ACTIVOS (no anonimizados)
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        is_anonymized: false, // Solo usuarios activos
      }
    })

    if (!user) {
      return {
        error: true,
        message: 'User not found',
        payload: null
      }
    }

    return {
      error: false,
      message: 'User found successfully',
      payload: user
    }
  } catch (error) {
    console.error('Error getting user by email:', error)
    return {
      error: true,
      message: 'Database error',
      payload: null
    }
  }
}

// ✨ NUEVA FUNCIÓN: Para casos donde necesites buscar incluyendo usuarios anonimizados
export const getUserByEmailIncludingAnonymized = async (email: string): Promise<ResponseType<any>> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        // Sin filtro de is_anonymized - busca todos
      }
    })

    if (!user) {
      return {
        error: true,
        message: 'User not found',
        payload: null
      }
    }

    return {
      error: false,
      message: 'User found successfully',
      payload: user
    }
  } catch (error) {
    console.error('Error getting user by email:', error)
    return {
      error: true,
      message: 'Database error',
      payload: null
    }
  }
} */