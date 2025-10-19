/* import { prisma } from "@/utils/prisma"

export async function findUserFollow(followerId: number, followingId: number) {
  return prisma.userFollow.findUnique({
    where: {
      follower_id_following_id: {
        follower_id: followerId,
        following_id: followingId
      }
    }
  })
} */