"use server"

import { actionWrapper } from "@/utils/lib"
import { selectMaterials } from "../data/selectMaterials"

export async function getMaterials({ store_id }: { store_id: number }) {
    return actionWrapper(async () => {

        const { payload, error, message } = await selectMaterials({ store_id })

        if (error) throw new Error(message)

        return {
            payload,
            error: false,
            message: "Materials fetched successfully"
        }

    })
}