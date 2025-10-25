"use server"

import { insertEmployee } from "@/features/employees/data/insert-employee.data"
import { insertLogEntry } from "@/features/global/data"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"

export async function createEmployeeAction(userId: number, storeId: number, role: string = "EMPLOYEE") {

    return actionWrapper(async () => {
        const { payload: employee, error: employeeError, message: employeeMessage } = await insertEmployee(userId, storeId, role)
        if (employeeError || !employee) throw new Error(employeeMessage)

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "EMPLOYEE",
            entity_id: employee.id,
            user_id: userId,
            action_initiator: "Employee creation",
            details: `Employee created with role ${role}`
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return formatSuccessResponse("Employee created successfully", employee)
    })
} 