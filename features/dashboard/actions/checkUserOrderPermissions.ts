"use server"

import { formatErrorResponse } from "@/utils/lib"
import { checkUserOrderPermissions as checkUserOrderPermissionsData } from "../data/checkUserOrderPermissions"

export async function checkUserOrderPermissions(userId: number) {
    try {
        const { payload, error, message } = await checkUserOrderPermissionsData(userId)

        if (error) throw new Error(message)

        return {
            message: "User order permissions checked successfully",
            payload: payload,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error checking user order permissions", error, false)
    }
} 