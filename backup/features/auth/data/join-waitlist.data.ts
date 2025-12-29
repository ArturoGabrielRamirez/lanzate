"use server"

import { JoinWaitlistFormPayload } from '@/features/auth/types'
import { formatErrorResponse, formatSuccessResponse } from '@/features/global/utils'
import { prisma } from '@/utils/prisma'


export async function joinWaitlistData({ email }: JoinWaitlistFormPayload) {

    const existingWaitlist = await prisma.waitlist.findFirst({
        where: {
            email: email
        }
    })

    if (existingWaitlist) {
        return formatErrorResponse("You are already on the waitlist")
    }

    const newWaitlist = await prisma.waitlist.create({
        data: {
            email: email
        }
    })

    return formatSuccessResponse("Joined waitlist successfully", newWaitlist)
}