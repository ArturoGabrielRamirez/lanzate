import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { prisma } from '@/utils/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const { payload: user, hasError: userError } = await getCurrentUserWithIdAndEmailAction()

    if (userError || !user) {
      return NextResponse.json({ error: userError || 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { username, firstName, lastName, phone } = body

    if (username !== null && username !== undefined) {
      const trimmedUsername = username.trim()

      if (trimmedUsername) {
        const existingUser = await prisma.user.findFirst({
          where: {
            username: trimmedUsername,
            NOT: {
              supabase_user_id: user.supabase_user_id
            }
          }
        })

        if (existingUser) {
          return NextResponse.json({
            field: 'username',
            message: 'Este nombre de usuario ya está en uso'
          }, { status: 400 })
        }
      }
    }

    const updateData: Prisma.UserUpdateInput = {
      updated_at: new Date()
    }

    if (username !== undefined) {
      updateData.username = username?.trim() || null
    }

    if (firstName !== undefined) {
      updateData.first_name = firstName?.trim() || null
    }

    if (lastName !== undefined) {
      updateData.last_name = lastName?.trim() || null
    }

    if (phone !== undefined) {
      updateData.phone = phone?.trim() || null
    }

    if (!user.supabase_user_id) {
      throw new Error("No se encontró el usuario en la base de datos")
    }
    await prisma.user.update({
      where: {
        supabase_user_id: user.supabase_user_id
      },
      data: updateData //TODO: Migrar esto a DATA
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}