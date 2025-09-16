import { NextRequest, NextResponse } from 'next/server'
import { Prisma, PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/features/auth/actions'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId)
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includePrivate = searchParams.get('includePrivate') === 'true'

    if (includePrivate) {
  const currentUserResponse = await getCurrentUser()
  
  if (!currentUserResponse?.payload) {
    return NextResponse.json(
      { error: 'No autorizado para ver actividades privadas' },
      { status: 401 }
    )
  }

  // Verificar si es el mismo usuario
  const currentUser = currentUserResponse.payload
  let currentUserId: number | null = null
  
  if (typeof currentUser.id === 'string') {
    // Si getCurrentUser devuelve UUID, buscar el usuario
    const dbUser = await prisma.user.findUnique({
      where: { supabase_user_id: currentUser.id },
      select: { id: true }
    })
    currentUserId = dbUser?.id || null
  } else {
    // Si getCurrentUser devuelve ID numérico
    currentUserId = currentUser.id
  }
  
  if (currentUserId !== userId) {
    return NextResponse.json(
      { error: 'No tienes permisos para ver actividades privadas' },
      { status: 403 }
    )
  }
}

    // Validar que el userId sea válido
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, profile_is_public: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Si el perfil no es público y no se incluyen actividades privadas, denegar acceso
    if (!user.profile_is_public && !includePrivate) {
      return NextResponse.json(
        { error: 'Perfil privado' },
        { status: 403 }
      )
    }

    // Construir filtros de consulta
    const whereClause: Prisma.SocialActivityWhereInput = {
      user_id: userId
    }

    // Si no se incluyen actividades privadas, solo mostrar las públicas
    if (!includePrivate) {
      whereClause.is_public = true
    }

    // Obtener actividades con relaciones
    const activities = await prisma.socialActivity.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true
          }
        },
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            slug: true
          }
        },
        order: {
          select: {
            id: true,
            total_price: true,
            status: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Contar total de actividades para paginación
    const totalActivities = await prisma.socialActivity.count({
      where: whereClause
    })

    // Generar algunas actividades mock basadas en datos reales del usuario
    // mientras se implementa el sistema completo de actividades
    const mockActivitiesFromUserData = await generateMockActivities(userId, limit)

    // Combinar actividades reales con mock (para demostración)
    const combinedActivities = [
      ...activities,
      ...mockActivitiesFromUserData.slice(0, Math.max(0, limit - activities.length))
    ]

    return NextResponse.json({
      activities: combinedActivities.slice(0, limit),
      pagination: {
        total: totalActivities + mockActivitiesFromUserData.length,
        limit,
        offset,
        hasMore: offset + limit < (totalActivities + mockActivitiesFromUserData.length)
      }
    })

  } catch (error) {
    console.error('Error fetching user activities:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para generar actividades mock basadas en datos reales del usuario
async function generateMockActivities(userId: number, limit: number) {
  try {
    const mockActivities = []

    // Obtener likes del usuario para crear actividades PRODUCT_LIKE
    const userLikes = await prisma.product_likes.findMany({
      where: { user_id: userId },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: Math.floor(limit / 2)
    })

    // Convertir likes a actividades mock
    for (const like of userLikes) {
      mockActivities.push({
        id: `mock-like-${like.user_id}-${like.product_id}`,
        user_id: userId,
        activity_type: 'PRODUCT_LIKE',
        entity_type: 'PRODUCT',
        entity_id: like.product_id,
        title: `Le gustó "${like.products.name}"`,
        description: 'Le gustó este producto',
        is_public: true,
        is_featured: false,
        created_at: like.created_at,
        updated_at: like.created_at,
        product: like.products,
        store: null,
        order: null,
        metadata: null,
        store_id: null,
        employee_id: null,
        product_id: like.product_id,
        order_id: null
      })
    }

    // Obtener comentarios del usuario
    const userComments = await prisma.product_comments.findMany({
      where: { user_id: userId, is_active: true },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: Math.floor(limit / 3)
    })

    // Convertir comentarios a actividades mock
    for (const comment of userComments) {
      mockActivities.push({
        id: `mock-comment-${comment.id}`,
        user_id: userId,
        activity_type: 'PRODUCT_COMMENT',
        entity_type: 'PRODUCT',
        entity_id: comment.product_id,
        title: `Comentó en "${comment.products.name}"`,
        description: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : ''),
        is_public: true,
        is_featured: false,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        product: comment.products,
        store: null,
        order: null,
        metadata: null,
        store_id: null,
        employee_id: null,
        product_id: comment.product_id,
        order_id: null
      })
    }

    // Obtener información del registro del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { created_at: true, username: true }
    })

    if (user) {
      mockActivities.push({
        id: `mock-register-${userId}`,
        user_id: userId,
        activity_type: 'USER_REGISTERED',
        entity_type: 'USER',
        entity_id: userId,
        title: 'Se unió a la plataforma',
        description: `@${user.username} se registró en la plataforma`,
        is_public: true,
        is_featured: true,
        created_at: user.created_at,
        updated_at: user.created_at,
        product: null,
        store: null,
        order: null,
        metadata: null,
        store_id: null,
        employee_id: null,
        product_id: null,
        order_id: null
      })
    }

    // Ordenar por fecha más reciente
    return mockActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  } catch (error) {
    console.error('Error generating mock activities:', error)
    return []
  }
}