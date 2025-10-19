import { prisma } from "@/utils/prisma"

/**
 * ✅ Query única optimizada: user + follow status + contadores
 */
/* export async function getUserWithFollowStatus(
  targetUserId: number,
  currentUserId?: number
) {
  return prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      username: true,
      first_name: true,
      last_name: true,
      profile_is_public: true,
      show_activity: true,
      // JOIN condicional para follow status
      ...(currentUserId && {
        user_follows_following: {
          where: { follower_id: currentUserId },
          select: { id: true }
        }
      }),
      // Contadores en la misma query
      _count: {
        select: {
          user_follows_following: true,
          user_follows: true,
          product_likes: true
        }
      }
    }
  })
} */