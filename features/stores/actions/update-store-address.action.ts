"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { updateStoreAddressData } from "@/features/stores/data/update-store-address.data"
import { UpdateAddressPayload } from "@/features/stores/types"

export async function updateStoreAddressAction(slug: string, payload: UpdateAddressPayload) {
    return actionWrapper(async () => {
        const updatedBranch = await updateStoreAddressData(slug, payload)

        revalidatePath(`/stores/${slug}`, "page")

        return {
            message: "Información de la dirección actualizada con éxito",
            payload: updatedBranch,
            hasError: false
        }
    })
}
