"use server"

import { actionWrapper } from "@/utils/lib"
import { deleteMaterial } from "../data/deleteMaterial"

export async function deleteMaterialAction(materialId: number, storeId: number) {

    return actionWrapper(async () => {
        const { error, message, payload } = await deleteMaterial(materialId, storeId)

        if (error) throw new Error(message)

        return { error: false, message: "Material deleted successfully", payload }
    })

}
