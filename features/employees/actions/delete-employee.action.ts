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

        if (!canDelete) throw new Error("No tenés permisos para eliminar este empleado.")

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
            action_initiator: "Botón eliminar empleado presionado",
            details: "Empleado eliminado usando el botón eliminar empleado. Las órdenes relacionadas mantienen sus datos pero las referencias al empleado se establecen en NULL."
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear una entrada de registro para esto.")
        return {
            hasError: false,
            message: "Empleado eliminado correctamente",
            payload: payload
        }
    })
} 