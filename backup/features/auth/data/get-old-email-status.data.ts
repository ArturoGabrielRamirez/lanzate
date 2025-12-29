"use server"

import { PrismaUserId } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function getOldEmailStatusData({ userId }: PrismaUserId) {
    await prisma.email_change_requests.update({
        where: { id: userId },
        data: {
            old_email_confirmed: true,
            old_email_confirmed_at: new Date()
        }
    })
}