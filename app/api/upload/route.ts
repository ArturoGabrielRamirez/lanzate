// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/actions'
import { createServerSideClient } from '@/utils/supabase/server'
import { prisma } from '@/utils/prisma'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Función auxiliar para obtener userId
async function getUserId(currentUserResponse: { payload: { id: string } }): Promise<{ id: number; username: string }> {
  if (typeof currentUserResponse.payload.id === 'string') {
    const user = await prisma.user.findUnique({
      where: { supabase_user_id: currentUserResponse.payload.id },
      select: { id: true, username: true }
    })

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    return user
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUserResponse.payload.id },
    select: { id: true, username: true }
  })

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  return user
}

export async function POST(request: NextRequest) {
  try {
    console.log('API Upload llamada')

    const currentUserResponse = await getCurrentUser()

    if (!currentUserResponse || currentUserResponse.error) {
      console.log('Error de autenticación:', currentUserResponse?.error)
      return NextResponse.json(
        { error: "Debes iniciar sesión para subir archivos" },
        { status: 401 }
      )
    }

    const contentType = request.headers.get('content-type')
    console.log('Content-Type:', contentType)

    // MANEJO DE PRESETS (JSON)
    if (contentType?.includes('application/json')) {
      console.log('Procesando preset...')
      const { type, presetUrl } = await request.json()

      if (!presetUrl || !type) {
        return NextResponse.json(
          { error: "URL de preset y tipo son requeridos" },
          { status: 400 }
        )
      }

      if (!['avatar', 'banner'].includes(type)) {
        return NextResponse.json(
          { error: "Tipo debe ser 'avatar' o 'banner'" },
          { status: 400 }
        )
      }

      const user = await getUserId(currentUserResponse)
      console.log('Usuario para preset:', user.username)

      const updateData = type === 'banner' ? { banner: presetUrl } : { avatar: presetUrl }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...updateData,
          updated_at: new Date()
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          banner: true
        }
      })

      console.log('Preset actualizado correctamente')

      return NextResponse.json({
        message: `${type === 'banner' ? 'Banner' : 'Avatar'} actualizado correctamente`,
        url: presetUrl,
        username: user.username,
        user: updatedUser
      })
    }

    // MANEJO DE ARCHIVOS (FormData)
    console.log('Procesando archivo...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    console.log('Archivo recibido:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      uploadType: type
    })

    if (!file) {
      console.log('Error: No hay archivo')
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      )
    }

    if (!type || !['avatar', 'banner'].includes(type)) {
      console.log('Error: Tipo inválido:', type)
      return NextResponse.json(
        { error: "Tipo debe ser 'avatar' o 'banner'" },
        { status: 400 }
      )
    }

    // Validación de tamaño
    if (file.size > MAX_FILE_SIZE) {
      console.log('Error: Archivo muy grande:', file.size)
      return NextResponse.json(
        { error: `Archivo muy grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validación de tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('Error: Tipo no permitido:', file.type)
      return NextResponse.json(
        { error: `Tipo no permitido. Solo: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}` },
        { status: 400 }
      )
    }

    const user = await getUserId(currentUserResponse)
    console.log('Usuario para upload:', user.username)

    const supabase = await createServerSideClient()

    // Generar nombre único
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${type}-${user.id}-${Date.now()}.${fileExtension}`
    const filePath = `${type}s/${fileName}`

    console.log('Subiendo a Supabase:', filePath)

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600' // Cache por 1 hora
      })

    if (error) {
      console.error('Error Supabase Storage:', error)
      return NextResponse.json(
        {
          error: `Error subiendo archivo: ${error.message}`,
          details: error
        },
        { status: 500 }
      )
    }

    console.log('Archivo subido exitosamente:', data.path)

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath)

    if (!publicUrlData?.publicUrl) {
      console.error('Error: No se pudo obtener URL pública')
      return NextResponse.json(
        { error: "No se pudo obtener la URL pública del archivo" },
        { status: 500 }
      )
    }

    const publicUrl = publicUrlData.publicUrl
    console.log('URL pública generada:', publicUrl)

    // Eliminar archivo anterior si existe
    try {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { avatar: true, banner: true }
      })

      const currentUrl = type === 'avatar' ? currentUser?.avatar : currentUser?.banner

      if (currentUrl && currentUrl.includes('user-uploads')) {
        const oldFilePath = currentUrl.split('/user-uploads/').pop()
        if (oldFilePath) {
          console.log('Eliminando archivo anterior:', oldFilePath)
          await supabase.storage.from('user-uploads').remove([oldFilePath])
        }
      }
    } catch (cleanupError) {
      console.warn('Error limpiando archivo anterior:', cleanupError)
    }

    // Actualizar base de datos
    const updateData = type === 'banner' ? { banner: publicUrl } : { avatar: publicUrl }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...updateData,
        updated_at: new Date()
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        banner: true
      }
    })

    console.log('Usuario actualizado en BD:', updatedUser.username)

    return NextResponse.json({
      message: `${type === 'banner' ? 'Banner' : 'Avatar'} subido correctamente`,
      url: publicUrl,
      filename: fileName,
      originalSize: file.size,
      username: user.username,
      user: updatedUser
    })

  } catch (error) {
    console.error('Error crítico en API:', error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}

// MANEJO DE ELIMINACIÓN
export async function DELETE(request: NextRequest) {
  try {
    console.log('API Delete llamada')

    const currentUserResponse = await getCurrentUser()

    if (!currentUserResponse || currentUserResponse.error) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para eliminar archivos" },
        { status: 401 }
      )
    }

    const { type } = await request.json()

    if (!type || !['avatar', 'banner'].includes(type)) {
      return NextResponse.json(
        { error: "Tipo debe ser 'avatar' o 'banner'" },
        { status: 400 }
      )
    }

    const user = await getUserId(currentUserResponse)
    const supabase = await createServerSideClient()

    // Obtener URL actual antes de eliminar
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatar: true, banner: true }
    })

    const currentUrl = type === 'avatar' ? currentUser?.avatar : currentUser?.banner

    // Eliminar de storage si es un archivo subido
    if (currentUrl && currentUrl.includes('user-uploads')) {
      try {
        const filePath = currentUrl.split('/user-uploads/').pop()
        if (filePath) {
          console.log('Eliminando de storage:', filePath)
          await supabase.storage.from('user-uploads').remove([filePath])
        }
      } catch (storageError) {
        console.warn('Error eliminando de storage:', storageError)
      }
    }

    // Remover de la base de datos
    const updateData = type === 'banner' ? { banner: null } : { avatar: null }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...updateData,
        updated_at: new Date()
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        banner: true
      }
    })

    console.log('Eliminación completada')

    return NextResponse.json({
      message: `${type === 'banner' ? 'Banner' : 'Avatar'} eliminado correctamente`,
      user: updatedUser,
      username: user.username
    })

  } catch (error) {
    console.error('Error en eliminación:', error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}