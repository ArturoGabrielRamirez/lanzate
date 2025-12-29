"use server"

import { insertEmployeeData } from "@/features/employees/data/insert-employee.data"
import { insertLogEntry } from "@/features/global/data"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"

export async function createEmployeeAction(userId: number, storeId: number, role: string = "EMPLOYEE") {

    return actionWrapper(async () => {
        const { payload: employee, hasError: employeeError, message: employeeMessage } = await insertEmployeeData(userId, storeId, role)
        if (employeeError || !employee) throw new Error(employeeMessage)

        // Create action log
        const { hasError: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "EMPLOYEE",
            entity_id: employee.id,
            user_id: userId,
            action_initiator: "Creación de empleado",
            details: `Empleado creado con el rol de ${role}`
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear una entrada de registro para esto.")

        return formatSuccessResponse("Empleado creado correctamente", employee)
    })
} 