/* import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await params para obtener los valores en Next.js 15
    const { userId: userIdString } = await params;
    const userId = parseInt(userIdString)

    const { searchParams } = new URL(request.url)

    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Validar que el userId sea válido
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe y su configuración de privacidad
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profile_is_public: true,
        show_liked_products: true,
        username: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos: perfil público Y mostrar productos gustados habilitado
    if (!user.profile_is_public || !user.show_liked_products) {
      return NextResponse.json(
        { error: 'Los productos gustados de este usuario son privados' },
        { status: 403 }
      )
    }

    // Obtener productos gustados con información completa
    const likedProducts = await prisma.product_likes.findMany({
      where: {
        user_id: userId,
        // Solo productos activos y publicados
        products: {
          is_active: true,
          is_published: true,
          is_deleted: false
        }
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            slug: true,
            is_active: true,
            is_featured: true,
            created_at: true,
            store: {
              select: {
                id: true,
                name: true,
                logo: true,
                slug: true,
                subdomain: true,
                is_active: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Contar total para paginación
    const totalLiked = await prisma.product_likes.count({
      where: {
        user_id: userId,
        products: {
          is_active: true,
          is_published: true,
          is_deleted: false
        }
      }
    })

    // Formatear respuesta
    const formattedLikedProducts = likedProducts.map(like => ({
      created_at: like.created_at,
      product: {
        ...like.products,
        // Asegurar que el precio sea un número
        price: Number(like.products.price)
      }
    }))

    return NextResponse.json({
      likedProducts: formattedLikedProducts,
      user: {
        username: user.username,
        id: user.id
      },
      pagination: {
        total: totalLiked,
        limit,
        offset,
        hasMore: offset + limit < totalLiked,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalLiked / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching liked products:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
} */

export async function GET() { }