"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
/* import { UpdateBasicInfoPayload } from "@/features/stores/types" */
import { BasicInfoFormType } from "@/features/stores/schemas"
import { prisma } from "@/utils/prisma"

export async function updateStoreBasicInfoAction(slug: string, payload: BasicInfoFormType/* , userId: number */) {
    return actionWrapper(async () => {
        // Verificar que la tienda existe y pertenece al usuario
        /* const existingStore = await prisma.store.findFirst({
            where: {
                slug,
                user_id: userId
            }
        })

        if (!existingStore) {
            throw new Error("Tienda no encontrada o no tenés permiso para interactuar con ella")
        } */

        // Verificar que el subdomain no esté en uso por otra tienda
        /* if (payload.basic_info.subdomain !== existingStore.subdomain) { */
        const existingSubdomain = await prisma.store.findUnique({
            where: {
                subdomain: payload.basic_info.subdomain
            }
        })

        if (existingSubdomain) {
            throw new Error("El subdominio de la tienda (URL pública) ya existe. Intenta con otro.")
        }
        /* } */

        // Actualizar la tienda
        const updatedStore = await prisma.store.update({
            where: {
                slug
            },
            data: {
                name: payload.basic_info.name,
                description: payload.basic_info.description,
                subdomain: payload.basic_info.subdomain,
            }
        })

        revalidatePath(`/store/${slug}`)

        return {
            message: "Información básica actualizada con éxito",
            payload: updatedStore,
            hasError: false
        }
    })
}
