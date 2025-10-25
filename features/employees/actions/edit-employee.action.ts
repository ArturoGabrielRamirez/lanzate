"use server"

import { EmployeeRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { canEditEmployee } from "@/features/employees/access/can-edit-employee.access"
import { updateEmployee as updateEmployeeInDb } from "@/features/employees/data/updateEmployee"
import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { actionWrapper } from "@/utils/lib"

type EditEmployeePayload = {
    role: EmployeeRole
    position: string
    department: string
    salary: string
    notes: string
    can_create_orders: boolean
    can_update_orders: boolean
    can_create_products: boolean
    can_update_products: boolean
    can_manage_stock: boolean
    can_process_refunds: boolean
    can_view_reports: boolean
    can_manage_employees: boolean
    can_manage_store: boolean
    is_active: boolean
}

export async function editEmployeeAction(employeeId: number, data: EditEmployeePayload, slug: string, userId: number) {
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