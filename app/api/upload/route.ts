// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/actions'
import { createServerSideClient } from '@/utils/supabase/server'
import { prisma } from '@/utils/prisma'
import { MediaType } from '@prisma/client'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Tipos de upload permitidos basados en tu schema
const UPLOAD_TYPES = {
  // Usuario
  AVATAR: 'avatar',
  BANNER: 'banner',
  
  // Producto
  PRODUCT_IMAGE: 'product-image',
  PRODUCT_VIDEO: 'product-video',
  
  // Store
  STORE_LOGO: 'store-logo',
  STORE_BANNER: 'store-banner',
  
  // General
  MEDIA: 'media'
} as const

type UploadType = typeof UPLOAD_TYPES[keyof typeof UPLOAD_TYPES]

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

// Función para obtener bucket y carpeta según el tipo
function getStoragePath(type: UploadType): { bucket: string; folder?: string } {
  switch (type) {
    case UPLOAD_TYPES.AVATAR:
      return { bucket: 'user-uploads', folder: 'avatars' }
    case UPLOAD_TYPES.BANNER:
      return { bucket: 'user-uploads', folder: 'banners' }
    case UPLOAD_TYPES.PRODUCT_IMAGE:
    case UPLOAD_TYPES.PRODUCT_VIDEO:
      return { bucket: 'product-images' } // Sin subcarpeta, como tu novio lo tiene
    case UPLOAD_TYPES.STORE_LOGO:
      return { bucket: 'store-logos' }
    case UPLOAD_TYPES.STORE_BANNER:
      return { bucket: 'store-banners' }
    case UPLOAD_TYPES.MEDIA:
      return { bucket: 'user-uploads', folder: 'media' }
    default:
      return { bucket: 'user-uploads', folder: 'misc' }
  }
}

// Validar si es tipo de media válido para ProductMedia
function getMediaType(uploadType: UploadType, fileType: string): MediaType | null {
  if (uploadType === UPLOAD_TYPES.PRODUCT_VIDEO || fileType.startsWith('video/')) {
    return MediaType.VIDEO
  }
  if (uploadType === UPLOAD_TYPES.PRODUCT_IMAGE || fileType.startsWith('image/')) {
    return MediaType.IMAGE
  }
  return null
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

    // MANEJO DE PRESETS (JSON) - Solo para avatar y banner de usuarios
    if (contentType?.includes('application/json')) {
      console.log('Procesando preset...')
      const { type, presetUrl } = await request.json()

      if (!presetUrl || !type) {
        return NextResponse.json(
          { error: "URL de preset y tipo son requeridos" },
          { status: 400 }
        )
      }

      // Los presets solo funcionan para avatar y banner de usuarios
      if (![UPLOAD_TYPES.AVATAR, UPLOAD_TYPES.BANNER].includes(type)) {
        return NextResponse.json(
          { error: "Presets solo disponibles para avatar y banner" },
          { status: 400 }
        )
      }

      const user = await getUserId(currentUserResponse)
      console.log('Usuario para preset:', user.username)

      const updateData = type === UPLOAD_TYPES.BANNER ? { banner: presetUrl } : { avatar: presetUrl }

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
        message: `${type === UPLOAD_TYPES.BANNER ? 'Banner' : 'Avatar'} actualizado correctamente`,
        url: presetUrl,
        username: user.username,
        user: updatedUser
      })
    }

    // MANEJO DE ARCHIVOS (FormData)
    console.log('Procesando archivo...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as UploadType
    const productId = formData.get('productId') ? parseInt(formData.get('productId') as string) : null
    const storeId = formData.get('storeId') ? parseInt(formData.get('storeId') as string) : null

    console.log('Archivo recibido:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      uploadType: type,
      productId,
      storeId
    })

    if (!file) {
      console.log('Error: No hay archivo')
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      )
    }

    const allowedTypes = Object.values(UPLOAD_TYPES) as string[]
    if (!type || !allowedTypes.includes(type)) {
      console.log('Error: Tipo inválido:', type)
      return NextResponse.json(
        { error: `Tipo debe ser uno de: ${allowedTypes.join(', ')}` },
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

    // Validación de tipo de archivo
    const isVideo = file.type.startsWith('video/')
    const isImage = ALLOWED_TYPES.includes(file.type)
    
    if (!isVideo && !isImage) {
      console.log('Error: Tipo no permitido:', file.type)
      return NextResponse.json(
        { error: `Tipo no permitido. Solo imágenes: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')} o videos` },
        { status: 400 }
      )
    }

    const user = await getUserId(currentUserResponse)
    console.log('Usuario para upload:', user.username)

    const supabase = await createServerSideClient()

    // Generar nombre único
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const fileName = `${type}-${user.id}-${timestamp}.${fileExtension}`
    const { bucket, folder } = getStoragePath(type)
    const filePath = folder ? `${folder}/${fileName}` : fileName

    console.log('Subiendo a Supabase:', { bucket, filePath })

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
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
      .from(bucket)
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

    // ACTUALIZAR BASE DE DATOS según el tipo
    let updatedEntity = null
    let mediaRecord = null

    try {
      if (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.BANNER) {
        // Eliminar archivo anterior si existe para usuarios
        const currentUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { avatar: true, banner: true }
        })

        const currentUrl = type === UPLOAD_TYPES.AVATAR ? currentUser?.avatar : currentUser?.banner

        if (currentUrl && currentUrl.includes('.supabase.')) {
          // Extraer bucket y path de la URL
          const urlParts = currentUrl.split('/')
          const bucketIndex = urlParts.findIndex(part => part === 'user-uploads')
          if (bucketIndex !== -1 && bucketIndex + 1 < urlParts.length) {
            const filePath = urlParts.slice(bucketIndex + 1).join('/')
            console.log('Eliminando de storage:', filePath)
            await supabase.storage.from('user-uploads').remove([filePath])
          }
        }

        // Actualizar usuario
        const updateData = type === UPLOAD_TYPES.BANNER ? { banner: publicUrl } : { avatar: publicUrl }

        updatedEntity = await prisma.user.update({
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

        console.log('Usuario actualizado en BD:', updatedEntity.username)

      } else if ((type === UPLOAD_TYPES.PRODUCT_IMAGE || type === UPLOAD_TYPES.PRODUCT_VIDEO) && productId) {
        // Verificar que el producto existe y pertenece al usuario o a su tienda
        const product = await prisma.product.findFirst({
          where: {
            id: productId,
            OR: [
              { owner_id: user.id },
              { store: { user_id: user.id } }
            ]
          }
        })

        if (!product) {
          return NextResponse.json(
            { error: "Producto no encontrado o sin permisos" },
            { status: 404 }
          )
        }

        // Crear registro en ProductMedia
        const mediaType = getMediaType(type, file.type)
        if (!mediaType) {
          return NextResponse.json(
            { error: "Tipo de media no válido" },
            { status: 400 }
          )
        }

        // Obtener el siguiente sort_order
        const lastMedia = await prisma.productMedia.findFirst({
          where: { product_id: productId },
          orderBy: { sort_order: 'desc' }
        })

        mediaRecord = await prisma.productMedia.create({
          data: {
            product_id: productId,
            type: mediaType,
            url: publicUrl,
            alt_text: file.name,
            sort_order: (lastMedia?.sort_order || 0) + 1
          }
        })

        console.log('Media de producto creada:', mediaRecord.id)

        // Si es la primera imagen, actualizar como imagen principal del producto
        if (mediaType === MediaType.IMAGE && !product.image) {
          await prisma.product.update({
            where: { id: productId },
            data: { 
              image: publicUrl,
              primary_media_id: mediaRecord.id,
              updated_at: new Date()
            }
          })
          console.log('Imagen principal de producto actualizada')
        }

      } else if ((type === UPLOAD_TYPES.STORE_LOGO || type === UPLOAD_TYPES.STORE_BANNER) && storeId) {
        // Verificar que la tienda pertenece al usuario
        const store = await prisma.store.findFirst({
          where: {
            id: storeId,
            user_id: user.id
          }
        })

        if (!store) {
          return NextResponse.json(
            { error: "Tienda no encontrada o sin permisos" },
            { status: 404 }
          )
        }

        // Actualizar tienda
        const updateData = type === UPLOAD_TYPES.STORE_BANNER ? { banner: publicUrl } : { logo: publicUrl }

        updatedEntity = await prisma.store.update({
          where: { id: storeId },
          data: {
            ...updateData,
            updated_at: new Date()
          },
          select: {
            id: true,
            name: true,
            logo: true,
            banner: true,
            slug: true
          }
        })

        console.log('Tienda actualizada:', updatedEntity.name)
      }

    } catch (dbError) {
      console.error('Error actualizando BD:', dbError)
      // El archivo ya se subió, pero falló la BD
      // Podrías decidir si eliminar el archivo o no
    }

    return NextResponse.json({
      message: `${type} subido correctamente`,
      url: publicUrl,
      filename: fileName,
      originalSize: file.size,
      username: user.username,
      user: type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.BANNER ? updatedEntity : null,
      store: type === UPLOAD_TYPES.STORE_LOGO || type === UPLOAD_TYPES.STORE_BANNER ? updatedEntity : null,
      media: mediaRecord,
      type: type
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

    const { type, mediaId,/*  productId, storeId  */} = await request.json()

    const user = await getUserId(currentUserResponse)
    const supabase = await createServerSideClient()

    if (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.BANNER) {
      // Lógica existente para avatar/banner
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { avatar: true, banner: true }
      })

      const currentUrl = type === UPLOAD_TYPES.AVATAR ? currentUser?.avatar : currentUser?.banner

      if (currentUrl && currentUrl.includes('user-uploads')) {
        const filePath = currentUrl.split('/user-uploads/').pop()
        if (filePath) {
          console.log('Eliminando de storage:', filePath)
          await supabase.storage.from('user-uploads').remove([filePath])
        }
      }

      const updateData = type === UPLOAD_TYPES.BANNER ? { banner: null } : { avatar: null }

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

      return NextResponse.json({
        message: `${type === UPLOAD_TYPES.BANNER ? 'Banner' : 'Avatar'} eliminado correctamente`,
        user: updatedUser,
        username: user.username
      })

    } else if (mediaId) {
      // Eliminar media de producto
      const media = await prisma.productMedia.findFirst({
        where: {
          id: mediaId,
          product: {
            OR: [
              { owner_id: user.id },
              { store: { user_id: user.id } }
            ]
          }
        }
      })

      if (!media) {
        return NextResponse.json(
          { error: "Media no encontrada o sin permisos" },
          { status: 404 }
        )
      }

      // Eliminar de storage
      if (media.url.includes('user-uploads')) {
        const filePath = media.url.split('/user-uploads/').pop()
        if (filePath) {
          await supabase.storage.from('user-uploads').remove([filePath])
        }
      }

      // Eliminar registro de BD
      await prisma.productMedia.delete({
        where: { id: mediaId }
      })

      return NextResponse.json({
        message: "Media eliminada correctamente"
      })
    }

    return NextResponse.json(
      { error: "Tipo de eliminación no válido" },
      { status: 400 }
    )

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