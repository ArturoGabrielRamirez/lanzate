import { /* NextRequest, */ NextResponse } from 'next/server'
import { createServerSideClient } from '@/utils/supabase/server'
import { prisma } from '@/utils/prisma'

export async function GET(/* request: NextRequest */) {
  try {
    const supabase = await createServerSideClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener usuario de la base de datos
    const dbUser = await prisma.user.findFirst({
      where: { supabase_user_id: user.id },
      select: { id: true, email: true, avatar: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const options = []

    // 1. Avatar desde user_metadata (Google, etc.)
    const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture
    if (googleAvatar) {
      options.push({
        id: 'google-original',
        url: googleAvatar,
        provider: 'Google',
        label: 'Avatar de Google (Original)',
        icon: '🟦',
        isExternal: true
      })
    }

    // 2. Avatares de identities OAuth
    if (user.identities && user.identities.length > 0) {
      for (const identity of user.identities) {
        
        let avatarUrl = null
        let label = ''
        let icon = ''

        switch (identity.provider) {
          case 'google':
            avatarUrl = identity.identity_data?.avatar_url || identity.identity_data?.picture
            label = 'Avatar de Google'
            icon = '🟦'
            break
          case 'facebook':
            avatarUrl = identity.identity_data?.avatar_url
            label = 'Avatar de Facebook'
            icon = '📘'
            break
        /*   case 'github':
            avatarUrl = identity.identity_data?.avatar_url
            label = 'Avatar de GitHub'
            icon = '🐙'
            break
          case 'discord':
            avatarUrl = identity.identity_data?.avatar_url
            label = 'Avatar de Discord'
            icon = '🎮'
            break
          case 'twitter':
            avatarUrl = identity.identity_data?.avatar_url
            label = 'Avatar de Twitter'
            icon = '🐦'
            break */
        }

        if (avatarUrl) {
          options.push({
            id: identity.provider,
            url: avatarUrl,
            provider: identity.provider.charAt(0).toUpperCase() + identity.provider.slice(1),
            label,
            icon,
            isExternal: true
          })
        }
      }
    }

    // 3. Avatares generados con DiceBear
   const diceBearStyles = [
  { style: 'adventurer', label: 'Aventurero', icon: '⚔️' },
  { style: 'adventurer-neutral', label: 'Aventurero Neutral', icon: '🛡️' },
  { style: 'avataaars', label: 'Avataaars', icon: '👤' },
  { style: 'avataaars-neutral', label: 'Avataaars Neutral', icon: '🧍‍♂️' },
  { style: 'big-ears', label: 'Orejas Grandes', icon: '👂' },
  { style: 'big-ears-neutral', label: 'Orejas Grandes Neutro', icon: '👂' },
  { style: 'big-smile', label: 'Gran Sonrisa', icon: '😁' },
  { style: 'bottts', label: 'Robot', icon: '🤖' },
  { style: 'bottts-neutral', label: 'Robot Neutro', icon: '🤖' },
  { style: 'croodles', label: 'Croodles', icon: '🎨' },
  { style: 'croodles-neutral', label: 'Croodles Neutro', icon: '🎨' },
  { style: 'dylan', label: 'Dylan', icon: '👨‍🎨' },
  { style: 'fun-emoji', label: 'Emoji Divertido', icon: '😄' },
  { style: 'glass', label: 'Vidrio', icon: '🥽' },
  { style: 'icons', label: 'Iconos', icon: '🔰' },
  { style: 'identicon', label: 'Identicon', icon: '🔷' },
  { style: 'initials', label: 'Iniciales', icon: '🔤' },
  { style: 'lorelei', label: 'Lorelei', icon: '🧝‍♀️' },
  { style: 'lorelei-neutral', label: 'Lorelei Neutro', icon: '🧝‍♀️' },
  { style: 'micah', label: 'Micah', icon: '🧑' },
  { style: 'miniavs', label: 'Mini Avatar', icon: '🎭' },
  { style: 'notionists', label: 'Notionists', icon: '🧠' },
  { style: 'notionists-neutral', label: 'Notionists Neutro', icon: '🧠' },
  { style: 'open-peeps', label: 'Open Peeps', icon: '🖊️' },
  { style: 'personas', label: 'Personas', icon: '👨' },
  { style: 'pixel-art', label: 'Pixel Art', icon: '🎮' },
  { style: 'pixel-art-neutral', label: 'Pixel Art Neutro', icon: '🟦' },
  { style: 'rings', label: 'Anillos', icon: '💍' },
  { style: 'shapes', label: 'Formas', icon: '🔵' },
  { style: 'thumbs', label: 'Pulgar', icon: '👍' }
];

for (const { style, label, icon } of diceBearStyles) {
  const diceBearUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(dbUser.email)}&backgroundColor=transparent`;
  
  options.push({
    id: `dicebear-${style}`,
    url: diceBearUrl,
    provider: 'DiceBear',
    label: `${label} Generado`,
    icon,
    isExternal: false
  });
}

    // 4. Buscar avatares subidos a Supabase Storage
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('user-uploads')
        .list('avatars', {
          search: `${dbUser.id}`,
          sortBy: { column: 'updated_at', order: 'desc' }
        })

      if (!listError && files && files.length > 0) {
        for (const file of files) {
          const { data: publicUrlData } = supabase.storage
            .from('user-uploads')
            .getPublicUrl(`avatars/${file.name}`)

          if (publicUrlData?.publicUrl) {
            options.push({
              id: `storage-${file.name}`,
              url: publicUrlData.publicUrl,
              provider: 'Subido',
              label: 'Avatar Personalizado',
              icon: '📸',
              isExternal: false,
              fileName: file.name,
              uploadedAt: file.updated_at
            })
          }
        }
      } else if (listError) {
        console.error('❌ Error listando archivos de storage:', listError)
      }
    } catch (storageError) {
      console.error('❌ Error accediendo a storage:', storageError)
    }

    // 5. Marcar cuál está actualmente en uso
    const optionsWithStatus = options.map(option => ({
      ...option,
      isCurrentlyUsed: dbUser.avatar === option.url
    }))

    return NextResponse.json({ 
      options: optionsWithStatus,
      total: optionsWithStatus.length,
      currentAvatar: dbUser.avatar
    })

  } catch (error) {
    console.error('❌ Error getting avatar options:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}