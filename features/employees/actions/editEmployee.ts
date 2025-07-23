"use server"

import { actionWrapper } from "@/utils/lib"
import { updateEmployee as updateEmployeeInDb } from "../data/updateEmployee"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
import { canEditEmployee } from "../access/canEditEmployee"

export async function editEmployee(employeeId: number, data: any, slug: string, userId: number) {
    return actionWrapper(async () => {

        // Check user can edit employee (must be store owner)
        const canEdit = await canEditEmployee(employeeId, userId)

        if (!canEdit) throw new Error("User does not have permission to edit this employee")

        // Update employee in database
        const { error, payload, message } = await updateEmployeeInDb(employeeId, data)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { error: logError } = await insertLogEntry({
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
            error: false
        }

    })
} 