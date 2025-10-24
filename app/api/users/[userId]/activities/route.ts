import { NextRequest, NextResponse } from 'next/server'

import { getUserActivitiesAction } from '@/features/profile/actions/get-user-activities.action'

export const revalidate = 60 // ✅ Cache por 60 segundos

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: userIdString } = await params
    const userId = parseInt(userIdString)

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5') // ✅ Reducir a 5
    const offset = parseInt(searchParams.get('offset') || '0')
    const includePrivate = searchParams.get('includePrivate') === 'true'

    const result = await getUserActivitiesAction({
      userId,
      limit,
      offset,
      includePrivate
    })

    if (result.error) {
      const statusMap: Record<string, number> = {
        'ID de usuario inválido': 400,
        'Usuario no encontrado': 404,
        'No autorizado para ver actividades privadas': 401,
        'No tienes permisos para ver actividades privadas': 403,
        'Perfil privado': 403
      }

      const status = statusMap[result.message] || 500

      return NextResponse.json(
        { error: result.message },
        { status }
      )
    }

    return NextResponse.json(result.payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    })

  } catch (error) {
    console.error('Error fetching user activities:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}