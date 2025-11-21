"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { EditSocialMediaData } from "@/features/stores/types"
import { prisma } from "@/utils/prisma"

export async function updateStoreSocialMediaAction(storeId: number, data: EditSocialMediaData) {
    return actionWrapper(async () => {
        const mainBranch = await prisma.branch.findFirst({
            where: {
                store_id: storeId,
                is_main: true
            }
        })

        const store = await prisma.store.update({
            where: {
                id: storeId
            },
            data: {
                branches: {
                    update: {
                        where: {
                            id: mainBranch?.id
                        },
                        data: {
                            facebook_url: data.facebook_url || null,
                            instagram_url: data.instagram_url || null,
                            x_url: data.x_url || null
                        }
                    }
                }
            }
        })

        revalidatePath(`/stores/${store.slug}`, "page")

        return {
            message: "Información de redes sociales actualizada con éxito",
            hasError: false,
            payload: data
        }
    })
}
