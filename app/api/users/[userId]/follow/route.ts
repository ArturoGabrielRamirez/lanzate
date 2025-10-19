import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/actions'
import { toggleFollowUser } from '@/features/profile/actions/toggle-follow-user-action'

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUserResponse = await getCurrentUser()

    if (!currentUserResponse || currentUserResponse.error) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para seguir usuarios' },
        { status: 401 }
      )
    }

    const targetUserId = parseInt(params.userId, 10)

    if (isNaN(targetUserId)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    const result = await toggleFollowUser(targetUserId)

    if (result.error) {
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
