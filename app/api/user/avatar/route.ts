import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { getCurrentUser } from '@/features/auth/actions'

export async function PATCH(request: NextRequest) {
  try {
    const { payload: user, error: userError} = await getCurrentUser()

    if (userError || !user) {
      return NextResponse.json({ error: userError || 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { avatarUrl } = body

    if (!avatarUrl) {
      return NextResponse.json({ error: 'URL del avatar requerido' }, { status: 400 })
    }

    try {
      new URL(avatarUrl)
    } catch {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { supabase_user_id: user.id },
      data: { 
        avatar: avatarUrl,
        updated_at: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      avatar: updatedUser.avatar
    })

  } catch (error) {
    console.error('Error updating avatar:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

export async function DELETE(/* request: NextRequest */) {
  try {
    const { payload: user, error: userError } = await getCurrentUser()

    if (userError || !user) {
      return NextResponse.json({ error: userError || 'No autenticado' }, { status: 401 })
    }

    await prisma.user.update({
      where: { supabase_user_id: user.id },
      data: { 
        avatar: null,
        updated_at: new Date()
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error removing avatar:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}