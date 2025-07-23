"use server"
import { actionWrapper } from "@/utils/lib"
import { insertEmployee } from "../data/insertEmployee"

export async function createEmployee(userId: number, storeId: number, role: string = "EMPLOYEE") {
    return actionWrapper(async () => {
        const { payload: employee, error: employeeError, message: employeeMessage } = await insertEmployee(userId, storeId, role)
        if (employeeError || !employee) throw new Error(employeeMessage)
        return {
            message: "Employee created successfully",
            payload: employee,
            error: false
        }
    })
} 