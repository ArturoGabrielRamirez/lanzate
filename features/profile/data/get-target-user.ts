/* import { prisma } from "@/utils/prisma";
import { CurrentUser } from "../types";

export async function getTargetUser(targetUserId: number, currentUser: CurrentUser) {
    return prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
            id: true,
            username: true,
            profile_is_public: true,
            first_name: true,
            last_name: true,
            // ✅ JOIN para verificar follow existente
            user_follows_following: {
                where: {
                    follower_id: currentUser.id
                },
                select: { id: true }
            }
        }
    })
} */