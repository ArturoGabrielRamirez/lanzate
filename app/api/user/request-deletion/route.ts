import { NextRequest, NextResponse } from 'next/server'

import { requestDeletionAction } from '@/features/account/actions'



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reason, confirmPassword } = body

    const result = await requestDeletionAction(reason, confirmPassword)

    if (result.error) {
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
    console.error('Error en request-deletion route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}