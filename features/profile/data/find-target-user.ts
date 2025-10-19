/* import { prisma } from "@/utils/prisma"

export async function findTargetUser(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true, 
      username: true, 
      profile_is_public: true,
      first_name: true,
      last_name: true
    }
  })
} */