"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function getUserStoreCount(userId: number) {
    return actionWrapper(async () => {

        const storeCount = await prisma.store.count({
            where: {
                OR: [
                    {
                        user_id: userId
                    },
                    {
                        employees: {
                            some: {
                                user_id: userId
                            }
                        }
                    }
                ]
            }
        })

        return {
            message: "User store count fetched successfully from db",
            payload: storeCount,
            error: false
        }

    })
} 