"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { deleteBranch } from "../actions/deleteBranch"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"
import { DeleteBranchButtonProps } from "../types"
import { useTranslations } from "next-intl"

function DeleteBranchButton({ branchId, slug, onComplete, userId }: DeleteBranchButtonProps) {
    
    const t = useTranslations("store.delete-branch")
    
    const handleDeleteBranch = async () => {
        try {
            const { error, message, payload } = await deleteBranch(branchId, slug, userId)
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
        redirect(`/stores/${slug}/branches`)
    }

    return (
        <ButtonWithPopup
            title={t("title")}
            description={t("description")}
            action={handleDeleteBranch}
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
export default DeleteBranchButton 