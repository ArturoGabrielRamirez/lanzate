import { NextResponse } from 'next/server'
import { getBannerOptionsAction } from '@/features/profile/actions/get-banner-options.action'

export async function GET() {
  try {
    const result = await getBannerOptionsAction()

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
    console.error('❌ Error en GET /api/banners:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}