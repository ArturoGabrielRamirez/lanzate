import { prisma } from "@/utils/prisma";

export async function findAnonymizedUserByEmailHash(emailHash: string) {
    return await prisma.user.findFirst({
        where: {
            original_email_hash: emailHash,
            is_anonymized: true,
        },
        select: {
            anonymized_at: true,
            account_locked_until: true
        },
    })
}