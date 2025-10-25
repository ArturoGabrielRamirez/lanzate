"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { deleteEmployeeAction } from "../actions/delete-employee.action"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"
import { DeleteEmployeeButtonProps } from "@/features/employees/types"
import { useTranslations } from "next-intl"

function DeleteEmployeeButton({ employeeId, slug, onComplete, userId }: DeleteEmployeeButtonProps) {
    
    const t = useTranslations("store.delete-employee")
    
    const handleDeleteEmployee = async () => {
        try {
            const { error, message, payload } = await deleteEmployeeAction(employeeId, slug, userId)
            if (error) throw new Error(message)
            return {
                error: false,
                message: t("messages.success"),
                payload: payload
            }
        } catch (error) {
            return formatErrorResponse(t("messages.error"), error, null)
        }
    }

    const handleComplete = () => {
        if (onComplete) return onComplete()
        redirect(`/stores/${slug}/employees`)
    }

    return (
        <ButtonWithPopup
            title={t("title")}
            description={t("description")}
            action={handleDeleteEmployee}
            onComplete={handleComplete}
            text={(
                <>
                    <Trash2 className="text-muted-foreground size-4" />
                    {t("button")}
                </>
            )}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className="bg-transparent w-full justify-start"
        />
    )
}
export default DeleteEmployeeButton 