"use server"

import { getEmployeePermissionsData } from "@/features/employees/data/get-employee-permissions.data"
import { actionWrapper } from "@/features/global/utils"

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