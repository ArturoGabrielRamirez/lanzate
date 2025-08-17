import { /* NextRequest, */ NextResponse } from 'next/server'
import { createServerSideClient } from '@/utils/supabase/server'
import { prisma } from '@/utils/prisma'
import { AvatarStorageUtils } from '@/features/auth/components/avatar/avatar-storage-utils'


export async function GET(/* request: NextRequest */) {
  try {
    const supabase = await createServerSideClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const dbUser = await prisma.user.findFirst({
      where: { supabase_user_id: user.id },
      select: { id: true, email: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const options = []

    if (user.identities && user.identities.length > 0) {
      const oauthAvatars = await AvatarStorageUtils.processOAuthAvatars(
        user.identities,
        dbUser.id.toString()
      )
      options.push(...oauthAvatars)
    }

    const presetAvatars = await AvatarStorageUtils.generatePresetAvatars(
      dbUser.email,
      dbUser.id.toString()
    )
    options.push(...presetAvatars)

    AvatarStorageUtils.cleanupOldAvatars(dbUser.id.toString()).catch(console.error)

    const optionsWithStatus = options.map(option => ({
      ...option,
      isCurrentlyUsed: false
    }))

    return NextResponse.json({ 
      options: optionsWithStatus,
      total: optionsWithStatus.length
    })

  } catch (error) {
    console.error('Error getting avatar options:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}