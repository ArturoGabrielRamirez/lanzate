"use server"

import { actionWrapper } from "@/utils/lib"
import { selectBranchById } from "@/features/branches/data"

export async function getBranchDetails(id: string) {
    return actionWrapper(async () => {
        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid branch id")

        const { payload: branch, error, message } = await selectBranchById(parsedId)

        if (error) throw new Error(message)

        return {
            payload: branch,
            error: false,
            message: "Branch details fetched successfully"
        }

    })
} 