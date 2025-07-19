"use server"

import { actionWrapper } from "@/utils/lib"
import { insertBranch } from "../data/insertBranch"
import { revalidatePath } from "next/cache"
export async function createBranch(payload: any, storeId: number) {
    return actionWrapper(async () => {

        const { error, message, payload: branch } = await insertBranch(payload, storeId)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${storeId}`)

        return {
            error: false,
            message: "Branch created successfully",
            payload: branch
        }

    })
}
