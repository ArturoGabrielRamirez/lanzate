import { /* NextRequest, */ NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { createServerSideClient } from '@/utils/supabase/server'

export async function POST(/* request: NextRequest */) {
  try {
    const supabase = await createServerSideClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture

    if (!avatarUrl) {
      return NextResponse.json({ error: 'No hay avatar disponible en Google' }, { status: 404 })
    }

    await prisma.user.update({
      where: {
        supabase_user_id: user.id
      },
      data: {
        avatar: avatarUrl,
        updated_at: new Date()
      }
    })

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Error getting Google avatar:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}