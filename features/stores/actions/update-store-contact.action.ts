"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { EditContactData } from "@/features/stores/types"
import { prisma } from "@/utils/prisma"

export async function updateStoreContactAction(storeId: number, data: EditContactData) {
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
                            phone: data.contact_phone,
                            email: data.contact_email
                        }
                    }
                }
            }
        })

        revalidatePath(`/stores/${store.slug}`, "page")

        return {
            message: "Contact information updated successfully",
            hasError: false,
            payload: data
        }
    })
}
