"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { UpdateAddressPayload } from "@/features/stores/types"
import { prisma } from "@/utils/prisma"

export async function updateStoreAddressAction(slug: string, payload: UpdateAddressPayload, userId: number) {
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
            throw new Error("Tienda no encontrada o no tenés permiso para interactuar con ella")
        }

        const mainBranch = existingStore.branches.find((branch) => branch.is_main)

        if (!mainBranch) {
            throw new Error("Sucursal principal no encontrada")
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
                store: {
                    update: {
                        is_physical_store: payload.is_physical_store
                    }
                }
            }
        })

        revalidatePath(`/stores/${existingStore.slug}`, "page")

        return {
            message: "Información de la dirección actualizada con éxito",
            payload: updatedBranch,
            hasError: false
        }
    })
}
