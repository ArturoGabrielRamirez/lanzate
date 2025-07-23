"use server"

import { actionWrapper } from "@/utils/lib"
import { selectEmployeeById } from "../data/selectEmployeeById"

export async function getEmployeeDetails(id: string) {
    return actionWrapper(async () => {
        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid employee id")

        const { payload: employee, error, message } = await selectEmployeeById(parsedId)

        if (error) throw new Error(message)

        return {
            payload: employee,
            error: false,
            message: "Employee details fetched successfully"
        }

    })
} 