"use server"

import { actionWrapper } from "@/features/global/utils"
import { getEmployeePermissions as getEmployeePermissionsData } from "@/features/stores/data/getEmployeePermissions"

export async function getEmployeePermissionsAction(userId: number, slug: string) {
    return actionWrapper(async () => {

        const { payload, error, message } = await getEmployeePermissionsData(userId, slug)

        if (error) throw new Error(message)

        return {
            hasError: false,
            message: "Employee permissions fetched successfully",
            payload: payload
        }
    })
} 