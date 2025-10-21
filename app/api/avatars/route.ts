import { NextResponse } from 'next/server'
import { getAvatarOptionsAction } from '@/features/profile/actions/get-avatar-options.action'

export async function GET() {
  try {
    const result = await getAvatarOptionsAction()

    if (result.error) {
      const statusCode = result.message === 'No autenticado' ? 401 : 404
      return NextResponse.json(
        { error: result.message },
        { status: statusCode }
      )
    }

    return NextResponse.json({
      success: true,
      ...result.payload
    })
  } catch (error) {
    console.error('❌ Error en GET /api/avatars:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}