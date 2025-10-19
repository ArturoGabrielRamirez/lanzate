/* import { prisma } from "@/utils/prisma";

export async function findUserRegistrationData(userId: number) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: { created_at: true, username: true }
    })
} */