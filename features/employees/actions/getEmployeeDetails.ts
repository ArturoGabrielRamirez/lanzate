"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectEmployeeById } from "../data/selectEmployeeById"

export async function getEmployeeDetails(id: string) {
    try {
        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid employee id")

        const { payload: employee, error, message } = await selectEmployeeById(parsedId)

        if (error) throw new Error(message)

        return {
            payload: employee,
            error: false,
            message: "Employee details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching employee details", error)
    }
} 