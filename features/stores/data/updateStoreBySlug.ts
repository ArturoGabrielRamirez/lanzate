"use server"

import { PrismaClient } from '@prisma/client'
import { formatErrorResponse } from "@/utils/lib"

export async function updateStoreBySlug(slug: string, data: any) {
    try {

        const client = new PrismaClient()

        const updatedStore = await client.store.update({
            where: {
                slug: slug
            },
            data: { ...data }
        })

        return {
            message: "Store updated successfully",
            payload: updatedStore,
            error: false
        }
        
    } catch (error) {
        return formatErrorResponse("Error updating store", error, null)
    }
}
