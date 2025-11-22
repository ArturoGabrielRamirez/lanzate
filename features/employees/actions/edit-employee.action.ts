"use server"

import { revalidatePath } from "next/cache"

import { canEditEmployee } from "@/features/employees/access/can-edit-employee.access"
import { updateEmployeeData as updateEmployeeInDb } from "@/features/employees/data/update-employee.data"
import { EditEmployeePayload } from "@/features/employees/types/types"
import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { actionWrapper } from "@/features/global/utils"

export async function editEmployeeAction(employeeId: number, data: EditEmployeePayload, slug: string, userId: number) {
    return actionWrapper(async () => {

        // Check user can edit employee (must be store owner)
        const canEdit = await canEditEmployee(employeeId, userId)

        if (!canEdit) throw new Error("No tenés permisos para editar este empleado.")

        // Update employee in database
        const { hasError, payload, message } = await updateEmployeeInDb(employeeId, data)

        if (hasError) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { hasError: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "EMPLOYEE",
            entity_id: employeeId,
            user_id: userId,
            action_initiator: "Edit employee form",
            details: "Employee updated using edit employee form"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            message: "Employee updated successfully",
            payload: payload,
            hasError: false
        }

    })
} 