"use server"

import { prisma } from "@/utils/prisma"

export async function insertBranch(payload: any, storeId: number) {

    const existingBranches = await prisma.branch.count({
        where: {
            store_id: storeId
        }
    })

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
}
