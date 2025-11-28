import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { toggleFollowUserAction } from '@/features/profile/actions/toggle-follow-user.action'

export async function POST(request: NextRequest) {
  try {
    const currentUserResponse = await getCurrentUserWithIdAndEmailAction()

    if (!currentUserResponse || currentUserResponse.hasError) {
      return NextResponse.json(
        { error: 'Tenés que iniciar sesión para poder seguir a otros usuarios' },
        { status: 401 }
      )
    }

    // ✅ Obtener userId desde la URL
    const url = new URL(request.url)
    const userId = url.pathname.split('/').at(-2) // /users/[userId]/follow → penúltimo segmento
    const targetUserId = parseInt(userId || '', 10)

    if (isNaN(targetUserId)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    const result = await toggleFollowUserAction(targetUserId)

    if (result.hasError) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: result.message,
      data: result.payload
    })
  } catch (error) {
    console.error('Error en follow endpoint:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined
      },
      { status: 500 }
    )
  }
}
