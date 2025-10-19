/* import { prisma } from "@/utils/prisma";

export async function getFullUserProfile(
    username: string,
    currentUserId?: number
) {
    return prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            email: true,
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
            // JOIN condicional
            ...(currentUserId && {
                user_follows_following: {
                    where: { follower_id: currentUserId },
                    select: { id: true }
                }
            }),
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