/* import { prisma } from "@/utils/prisma"

export async function deleteUserFollow(followerId: number, followingId: number) {
    return prisma.userFollow.delete({
        where: {
            follower_id_following_id: {
                follower_id: followerId,
                following_id: followingId
            }
        }
    })
} */