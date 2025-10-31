"use client"

import { Trash2 } from "lucide-react"
import { redirect } from "next/navigation"
import { useTranslations } from "next-intl"

import { deleteEmployeeAction } from "@/features/employees/actions/delete-employee.action"
import { DeleteEmployeeButtonProps } from "@/features/employees/types"
import { ButtonWithPopup } from "@/features/global/components/button-with-popup"
import { formatErrorResponse } from "@/features/global/utils"


function DeleteEmployeeButton({ employeeId, slug, onComplete, userId }: DeleteEmployeeButtonProps) {

    const t = useTranslations("store.delete-employee")

    const handleDeleteEmployee = async () => {
        try {
            const { hasError, message, payload } = await deleteEmployeeAction(employeeId, slug, userId)
            if (hasError) throw new Error(message)
            return {
                hasError: false,
                message: t("messages.success"),
                payload: payload
            }
        } catch (error) {
            return formatErrorResponse(t("messages.error"))
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

export { DeleteEmployeeButton }