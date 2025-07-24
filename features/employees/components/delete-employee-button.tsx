"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { deleteEmployee } from "../actions/deleteEmployee"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"

import { DeleteEmployeeButtonProps } from "@/features/employees/types"

function DeleteEmployeeButton({ employeeId, slug, onComplete, userId }: DeleteEmployeeButtonProps) {
    const handleDeleteEmployee = async () => {
        try {
            const { error, message, payload } = await deleteEmployee(employeeId, slug, userId)
            if (error) throw new Error(message)
            return {
                error: false,
                message: "Employee deleted successfully",
                payload: payload
            }
        } catch (error) {
            return formatErrorResponse("Error deleting employee", error, null)
        }
    }

    const handleComplete = () => {
        if (onComplete) return onComplete()
        redirect(`/stores/${slug}/employees`)
    }

    return (
        <ButtonWithPopup
            title="Delete Employee"
            description="Are you sure you want to delete this employee? This action is irreversible. Orders created by this employee will be preserved but the employee reference will be removed."
            action={handleDeleteEmployee}
            onComplete={handleComplete}
            text={(
                <>
                    <Trash2 className="text-muted-foreground size-4" />
                    Delete Employee
                </>
            )}
            messages={{
                success: "Employee deleted successfully",
                error: "Failed to delete employee",
                loading: "Deleting employee..."
            }}
            className="bg-transparent w-full justify-start"
        />
    )
}

export default DeleteEmployeeButton 