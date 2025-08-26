import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/actions'
import { createServerSideClient } from '@/utils/supabase/server'
import { prisma } from '@/utils/prisma'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { email: user.email }, select: { id: true } })
    if (!dbUser) return NextResponse.json({ error: 'Usuario no encontrado en DB' }, { status: 404 })

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = (data.get('type') as string) || 'store-banner'

    if (!file) return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 })

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo muy grande. Máximo 8MB' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const fileExtension = file.type.split('/')[1] || file.name.split('.').pop() || 'jpg'
    const fileName = `${dbUser.id}-${type}-${Date.now()}.${fileExtension}`

    const supabase = await createServerSideClient()

    const { error: uploadError } = await supabase.storage
      .from('store-banners')
      .upload(fileName, buffer, { contentType: file.type, upsert: true })

      if (uploadError) {
      console.log("🚀 ~ POST ~ uploadError:", uploadError)
      return NextResponse.json({ error: 'Error subiendo archivo', details: uploadError.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage
      .from('store-banners')
      .getPublicUrl(fileName)

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json({ error: 'No se pudo generar URL pública' }, { status: 500 })
    }

    cleanupOldUploads(supabase, dbUser.id.toString(), type).catch(console.error)

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      fileName,
      size: file.size,
      type: file.type,
      path: fileName
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

async function cleanupOldUploads(supabase: SupabaseClient, userId: string, type: string) {
  try {
    const { data: files } = await supabase.storage
      .from('store-banners')
      .list('', { search: `${userId}-${type}`, sortBy: { column: 'updated_at', order: 'desc' } })

    if (!files) return

    const filesToDelete = files.slice(5)
    if (filesToDelete.length > 0) {
      const pathsToDelete = filesToDelete.map((f: { name: string }) => f.name)
      await supabase.storage.from('store-banners').remove(pathsToDelete)
    }
  } catch (err) {
    console.error('Error limpiando uploads antiguos:', err)
  }
}


