// app/api/users/banner/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/actions'
import { prisma } from '@/utils/prisma'
import { createServerSideClient } from '@/utils/supabase/server'

export async function PUT(request: NextRequest) {
  try {
    const currentUserResponse = await getCurrentUser()
    
    if (!currentUserResponse || currentUserResponse.error) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para actualizar tu banner" },
        { status: 401 }
      )
    }

    const { bannerUrl } = await request.json()

    if (!bannerUrl || typeof bannerUrl !== 'string') {
      return NextResponse.json(
        { error: "URL de banner inválida" },
        { status: 400 }
      )
    }

    let userId: number
    
    if (typeof currentUserResponse.payload.id === 'string') {
      const user = await prisma.user.findUnique({
        where: { supabase_user_id: currentUserResponse.payload.id },
        select: { id: true }
      })
      
      if (!user) {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 }
        )
      }
      
      userId = user.id
    } else {
      userId = currentUserResponse.payload.id
    }

    // Actualizar el banner del usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { banner: bannerUrl },
      select: {
        id: true,
        username: true,
        banner: true
      }
    })

    return NextResponse.json({
      message: "Banner actualizado correctamente",
      user: updatedUser
    })

  } catch (error) {
    console.error('Error actualizando banner:', error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}