"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"

type UpdateAddressPayload = {
    is_physical_store: boolean
    address?: string
    city?: string
    province?: string
    country?: string
}

export async function updateStoreAddress(slug: string, payload: UpdateAddressPayload, userId: number) {
    return actionWrapper(async () => {
        // Verificar que la tienda existe y pertenece al usuario
        const existingStore = await prisma.store.findFirst({
            where: {
                slug,
                user_id: userId
            },
            include: {
                branches: {
                    where: {
                        is_main: true
                    }
                }
            }
        })
        
        if (!existingStore) {
            throw new Error("Store not found or you don't have permission to edit it")
        }
        
        const mainBranch = existingStore.branches[0]
        if (!mainBranch) {
            throw new Error("Main branch not found")
        }
        
        const updatedBranch = await prisma.branch.update({
            where: {
                id: mainBranch.id
            },
            data: {
                address: payload.address || null,
                city: payload.city || null,
                province: payload.province || null,
                country: payload.country || null,
                store : {
                    update : {
                        is_physical_store: payload.is_physical_store
                    }
                }
            }
        })

        revalidatePath(`/stores/${existingStore.slug}`, "page")

        return {
            message: "Address information updated successfully",
            payload: updatedBranch,
            error: false
        }
    })
}
