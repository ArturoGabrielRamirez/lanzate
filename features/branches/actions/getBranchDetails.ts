"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectBranchById } from "../data/selectBranchById"

export async function getBranchDetails(id: string) {
    try {
        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid branch id")

        const { payload: branch, error, message } = await selectBranchById(parsedId)

        if (error) throw new Error(message)

        return {
            payload: branch,
            error: false,
            message: "Branch details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching branch details", error)
    }
} 