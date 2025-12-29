"use server"

import { PrismaUserId } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function getNewEmailStatusData({ userId }: PrismaUserId) {
    await prisma.email_change_requests.update({
        where: { id: userId },
        data: {
            new_email_confirmed: true,
            new_email_confirmed_at: new Date()
        }
    })
}