import { NextRequest, NextResponse } from 'next/server'

import { cancelDeletionAction } from '@/features/account/actions/cancel-deletion.action'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reason } = body

    const result = await cancelDeletionAction(reason)

    if (result.hasError) {
      return NextResponse.json(
        { error: result.message, details: result.payload },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      ...result.payload
    })
  } catch (error) {
    console.error('Error en cancel-deletion route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}