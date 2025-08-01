"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function insertBranch(payload: any, storeId: number) {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        // Check if this is the first branch for the store
        const existingBranches = await prisma.branch.count({
            where: {
                store_id: storeId
            }
        })

        // If this is the first branch, make it the main branch
        const isFirstBranch = existingBranches === 0

        const branch = await prisma.branch.create({
            data: {
                store_id: storeId,
                name: payload.name,
                address: payload.address,
                email: payload.email,
                phone: payload.phone,
                is_main: isFirstBranch
            }
        })

        return {
            error: false,
            message: "Branch created successfully",
            payload: branch
        }
    })
}
