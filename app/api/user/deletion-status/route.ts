import { /* NextRequest, */ NextResponse } from 'next/server'

import { getDeletionStatusAction } from '@/features/account/actions/get-deletion-status.action'

export async function GET(/* request: NextRequest */) {
  try {
    const result = await getDeletionStatusAction()

    if (result.hasError) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json(result.payload)
  } catch (error) {
    console.error('Error en deletion-status route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}