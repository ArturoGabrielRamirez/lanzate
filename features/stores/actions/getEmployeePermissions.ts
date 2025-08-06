"use server"

import { formatErrorResponse } from "@/utils/lib"
import { getEmployeePermissions as getEmployeePermissionsData } from "../data/getEmployeePermissions"

export async function getEmployeePermissions(userId: number, slug: string) {
    try {
        const { payload, error, message } = await getEmployeePermissionsData(userId, slug)

        if (error) throw new Error(message)

        return {
            message: "Employee permissions fetched successfully",
            payload: payload,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error fetching employee permissions", error, null)
    }
} 