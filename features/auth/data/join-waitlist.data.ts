"use server"

import { JoinWaitlistFormPayload } from '@/features/auth/types'
/* import { prisma } from '@/utils/prisma' */


export async function joinWaitlistData({ email }: JoinWaitlistFormPayload) {

    await new Promise(resolve => setTimeout(resolve, 5000))

    return {
        hasError: false,
        message: "Joined waitlist successfully",
        payload: {
            email: email
        }
    }
}