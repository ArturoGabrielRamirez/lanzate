import { prisma } from "@/utils/prisma"

export async function getStatsFromData() {
    const [pendingDeletions, anonymizedAccounts, expiredRetention] = await Promise.all([
        prisma.user.count({
            where: {
                deletion_scheduled_at: { not: null },
                is_deletion_cancelled: false,
                is_anonymized: false,
            },
        }),
        prisma.user.count({
            where: { is_anonymized: true }
        }),
        prisma.user.count({
            where: {
                is_anonymized: true,
                account_locked_until: { lte: new Date() },
            },
        }),
    ])

    return {
        pendingDeletions,
        anonymizedAccounts,
        expiredLegalRetention: expiredRetention,
    }
}