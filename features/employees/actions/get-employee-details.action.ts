"use server"

import { selectEmployeeByIdData } from "@/features/employees/data/select-employee-by-id.data"
import { actionWrapper } from "@/features/global/utils"

export async function getEmployeeDetailsAction(id: string) {
    return actionWrapper(async () => {
        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid employee id")

        const { payload: employee, hasError, message } = await selectEmployeeByIdData(parsedId)

        if (hasError) throw new Error(message)

        return {
            payload: employee,
            hasError: false,
            message: "Employee details fetched successfully"
        }

    })
} 