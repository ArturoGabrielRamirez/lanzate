import { prisma } from "@/utils/prisma";

export async function getUserForDeletion(userId: number) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            deletion_requested_at: true,
            deletion_scheduled_at: true,
            deletion_reason: true,
            is_deletion_cancelled: true,
            is_anonymized: true,
            anonymized_at: true,
            account_locked_until: true,
        },
    })
}