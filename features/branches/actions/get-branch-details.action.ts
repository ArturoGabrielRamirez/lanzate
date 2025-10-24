"use server"

import { selectBranchByIdData } from "@/features/branches/data"
import { actionWrapper } from "@/features/global/utils"

export async function getBranchDetailsAction(id: string) {
    return actionWrapper(async () => {
        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid branch id")

        const { payload: branch, hasError, message } = await selectBranchByIdData({ id: parsedId })

        if (hasError) throw new Error(message)

        return {
            payload: branch,
            hasError: false,
            message: "Branch details fetched successfully"
        }

    })
} 