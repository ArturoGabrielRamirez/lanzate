"use server"

import { revalidatePath } from "next/cache"

import { canDeleteEmployee } from "@/features/employees/access/can-delete-employee.access"
import { deleteEmployeeData as deleteEmployeeFromDb } from "@/features/employees/data/delete-employee.data"
import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { actionWrapper } from "@/features/global/utils"

export async function deleteEmployeeAction(employeeId: number, slug: string, userId: number) {
    return actionWrapper(async () => {

        // Check user can delete employee (must be store owner)
        const canDelete = await canDeleteEmployee(employeeId, userId)

        if (!canDelete) throw new Error("User does not have permission to delete this employee")

        // Delete employee from database
        const { hasError, message, payload } = await deleteEmployeeFromDb(employeeId)
        if (hasError) throw new Error(message)

        // Revalidate path
        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { hasError: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "EMPLOYEE",
            entity_id: employeeId,
            user_id: userId,
            action_initiator: "Delete employee button",
            details: "Employee deleted using delete employee button. Related orders maintain their data but employee references are set to NULL."
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            hasError: false,
            message: "Employee deleted successfully",
            payload: payload
        }
    })
} 