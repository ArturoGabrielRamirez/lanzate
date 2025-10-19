/* import { prisma } from "@/utils/prisma"

export async function getUserProfileData(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      first_name: true,
      last_name: true,
      avatar: true,
      banner: true,
      profile_bio: true,
      location: true,
      profile_is_public: true,
      show_liked_products: true,
      show_comments: true,
      show_activity: true,
      show_location: true,
      supabase_user_id: true,
      created_at: true,
      _count: {
        select: {
          user_follows: true,
          user_follows_following: true,
          product_likes: true
        }
      }
    }
  })

  return user
} */