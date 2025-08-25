"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"

type UpdateBasicInfoPayload = {
    name: string
    description?: string
    subdomain: string
}

export async function updateStoreBasicInfo(slug: string, payload: UpdateBasicInfoPayload, userId: number) {
    return actionWrapper(async () => {
        // Verificar que la tienda existe y pertenece al usuario
        const existingStore = await prisma.store.findFirst({
            where: {
                slug,
                user_id: userId
            }
        })

        if (!existingStore) {
            throw new Error("Store not found or you don't have permission to edit it")
        }

        // Verificar que el subdomain no esté en uso por otra tienda
        if (payload.subdomain !== existingStore.subdomain) {
            const existingSubdomain = await prisma.store.findUnique({
                where: {
                    subdomain: payload.subdomain
                }
            })

            if (existingSubdomain) {
                throw new Error("The store subdomain (Public URL) already exists. Try another one.")
            }
        }

        // Actualizar la tienda
        const updatedStore = await prisma.store.update({
            where: {
                slug
            },
            data: {
                name: payload.name,
                description: payload.description,
                subdomain: payload.subdomain,
            }
        })

        revalidatePath(`/store/${slug}`)

        return {
            message: "Basic information updated successfully",
            payload: updatedStore,
            error: false
        }
    })
}
