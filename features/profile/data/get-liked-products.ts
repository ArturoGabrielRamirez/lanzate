import { prisma } from "@/utils/prisma"

export async function getUserLikedProductsData(
  userId: number,
  limit: number = 20,
  offset: number = 0
) {
  const likedProducts = await prisma.product_likes.findMany({
    where: {
      user_id: userId,
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

  return { likedProducts, totalLiked }
}
