"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function insertBranch(payload: any, storeId: number) {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        const branch = await client.branch.create({
            data: {
                store_id: storeId,
                name: payload.name,
                address: payload.address,
                email: payload.email,
                phone: payload.phone
            }
        })

        return {
            error: false,
            message: "Branch created successfully",
            payload: branch
        }
    })
}
