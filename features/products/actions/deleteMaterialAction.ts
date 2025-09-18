"use server"

import { actionWrapper } from "@/utils/lib"
import { deleteMaterial } from "../data/deleteMaterial"

export async function deleteMaterialAction(materialLabel: string, storeId: number) {

    return actionWrapper(async () => {
        const { error, message, payload } = await deleteMaterial(materialLabel, storeId)

        if (error) throw new Error(message)

        return { error: false, message: "Material deleted successfully", payload }
    })

}
