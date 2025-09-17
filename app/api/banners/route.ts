import { NextResponse } from 'next/server'
import { createServerSideClient } from '@/utils/supabase/server'
import { prisma } from '@/utils/prisma'

interface BannerOption {
  id: string
  url: string
  provider: string
  label: string
  icon: string
  isCurrentlyUsed?: boolean
  fileName?: string
  size?: number
  uploadedAt?: string
}

export async function GET() {
  try {
    const supabase = await createServerSideClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Usuario en DB
    const dbUser = await prisma.user.findFirst({
      where: { supabase_user_id: user.id },
      select: { id: true, email: true, banner: true }
    })
    
    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const options: BannerOption[] = []

    // --- 1. Banners predefinidos (los que ya tienes en PRESET_BANNERS) ---
    const presetBanners = [
      {
        id: "preset-1",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Montañas al amanecer"
      },
      {
        id: "preset-2", 
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Bosque brumoso"
      },
      {
        id: "preset-3",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=400&fit=crop&auto=format&q=80", 
        name: "Lago sereno"
      },
      {
        id: "preset-4",
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Océano al atardecer"
      },
      {
        id: "preset-5",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Colinas verdes"
      },
      {
        id: "preset-6",
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Desierto dorado"
      },
      {
        id: "preset-7",
        url: "https://images.unsplash.com/photo-1464822759356-8d6106e78f86?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Montañas nevadas"
      },
      {
        id: "preset-8",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Bosque otoñal"
      }
    ]

    for (const preset of presetBanners) {
      options.push({
        id: preset.id,
        url: preset.url,
        provider: 'Predefinido',
        label: preset.name,
        icon: '🖼️'
      })
    }

    // --- 2. Banners personalizados subidos por el usuario ---
    const { data: files } = await supabase.storage
      .from('user-uploads')
      .list('banners', { limit: 50, sortBy: { column: 'updated_at', order: 'desc' } })

    if (files?.length) {
      const userFiles = files.filter(file =>
        file.name.includes(user.id) || file.name.includes(dbUser.id.toString())
      )

      for (const file of userFiles) {
        const { data: publicUrlData } = supabase.storage
          .from('user-uploads')
          .getPublicUrl(`banners/${file.name}`)

        if (publicUrlData?.publicUrl) {
          options.push({
            id: `storage-${file.name}`,
            url: publicUrlData.publicUrl,
            provider: 'Personalizado',
            label: 'Banner Subido',
            icon: '📸',
            fileName: file.name,
            size: file.metadata?.size,
            uploadedAt: file.updated_at || file.created_at
          })
        }
      }
    }

    // --- 3. Normalizar y marcar el banner actual ---
    const uniqueOptions = options.filter(
      (opt, i, arr) => i === arr.findIndex(o => o.url === opt.url)
    )

    const optionsWithStatus = uniqueOptions.map(opt => ({
      ...opt,
      isCurrentlyUsed: dbUser.banner === opt.url
    }))

    // Ordenar: banner actual primero, luego personalizados, luego predefinidos
    optionsWithStatus.sort((a, b) => {
      if (a.isCurrentlyUsed && !b.isCurrentlyUsed) return -1
      if (!a.isCurrentlyUsed && b.isCurrentlyUsed) return 1
      const order = ['Personalizado', 'Predefinido']
      return order.indexOf(a.provider) - order.indexOf(b.provider)
    })

    return NextResponse.json({
      success: true,
      options: optionsWithStatus,
      total: optionsWithStatus.length,
      currentBanner: dbUser.banner
    })
  } catch (error) {
    console.error('❌ Error en GET /api/banners:', error)
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}