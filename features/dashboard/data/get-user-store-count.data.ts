"use server"

import { prisma } from "@/utils/prisma"

export async function getUserStoreCountData(userId: number) {
    
    const storeCount = await prisma.store.count({
        where: {
            OR: [
                { user_id: userId },
                { employees: { some: { user_id: userId } } }
            ]
        }
    })

    return {
        message: "User store count fetched successfully from db",
        payload: storeCount,
        hasError: false
    }

} 