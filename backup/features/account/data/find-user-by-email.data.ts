import { prisma } from "@/utils/prisma";

export async function findUserByEmail(email: string) {
    return await prisma.user.findFirst({
        where: {
            email: email,
            is_anonymized: false
        },
        select: { id: true },
    })
}