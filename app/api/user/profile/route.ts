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

      if (trimmedUsername && trimmedUsername.length < 3) {
        return NextResponse.json({
          field: 'username',
          message: 'El nombre de usuario debe tener al menos 3 caracteres'
        }, { status: 400 })
      }

      if (trimmedUsername && trimmedUsername.length > 30) {
        return NextResponse.json({
          field: 'username',
          message: 'El nombre de usuario debe tener máximo 30 caracteres'
        }, { status: 400 })
      }

      if (trimmedUsername && !/^[a-zA-Z0-9_.-]+$/.test(trimmedUsername)) {
        return NextResponse.json({
          field: 'username',
          message: 'Solo se permiten letras, números, puntos, guiones y guiones bajos'
        }, { status: 400 })
      }

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

    if (firstName && firstName.trim().length > 50) {
      return NextResponse.json({
        field: 'firstName',
        message: 'El nombre debe tener máximo 50 caracteres'
      }, { status: 400 })
    }

    if (lastName && lastName.trim().length > 50) {
      return NextResponse.json({
        field: 'lastName',
        message: 'El apellido debe tener máximo 50 caracteres'
      }, { status: 400 })
    }

    if (phone !== null && phone !== undefined) {
      const trimmedPhone = phone.trim()
      if (trimmedPhone) {
        const cleanPhone = trimmedPhone.replace(/[\s\-\(\)\+]/g, '')
        if (!/^\d{8,15}$/.test(cleanPhone)) {
          return NextResponse.json({
            field: 'phone',
            message: 'El teléfono debe tener entre 8 y 15 dígitos'
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
      data: updateData
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}