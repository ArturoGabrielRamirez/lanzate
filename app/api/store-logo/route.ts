import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/actions'
import { createServerSideClient } from '@/utils/supabase/server'
import { prisma } from '@/utils/prisma'
import { SupabaseClient } from '@supabase/supabase-js'


export async function POST(request: NextRequest) {
  try {
    const { payload: user } = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Buscar usuario en la DB (Prisma)
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado en DB' }, { status: 404 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = (data.get('type') as string) || 'avatar'

    if (!file) {
      return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo muy grande. Máximo 5MB' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const fileExtension =
      file.type.split('/')[1] || file.name.split('.').pop() || 'jpg'

    // 🔑 Usamos SIEMPRE el dbUser.id en el nombre
    const fileName = `${dbUser.id}-${type}-${Date.now()}.${fileExtension}`

    const supabase = await createServerSideClient()

    const { error: uploadError } = await supabase.storage
      .from('store-logos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      return NextResponse.json({ error: 'Error subiendo archivo', details: uploadError.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage
      .from('store-logos')
      .getPublicUrl(fileName)

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json({ error: 'No se pudo generar URL pública' }, { status: 500 })
    }

    // Opcional: limpieza de archivos viejos
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
      .from('store-logos')
      .list('', { search: `${userId}-${type}`, sortBy: { column: 'updated_at', order: 'desc' } })

    if (!files) return

    const filesToDelete = files.slice(3)
    if (filesToDelete.length > 0) {
      const pathsToDelete = filesToDelete.map((f: { name: string }) => f.name)
      await supabase.storage.from('store-logos').remove(pathsToDelete)
    }
  } catch (err) {
    console.error('Error limpiando uploads antiguos:', err)
  }
}
