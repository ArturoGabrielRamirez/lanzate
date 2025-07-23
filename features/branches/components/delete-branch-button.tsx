"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { deleteBranch } from "../actions/deleteBranch"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"
import { DeleteBranchButtonProps } from "../types"

function DeleteBranchButton({ branchId, slug, onComplete, userId }: DeleteBranchButtonProps) {
    const handleDeleteBranch = async () => {
        try {
            const { error, message, payload } = await deleteBranch(branchId, slug, userId)
            if (error) throw new Error(message)
            return {
                error: false,
                message: "Branch deleted successfully",
                payload: payload
            }
        } catch (error) {
            return formatErrorResponse("Error deleting branch", error, null)
        }
    }

    const handleComplete = () => {
        if (onComplete) return onComplete()
        redirect(`/stores/${slug}/branches`)
    }

    return (
        <ButtonWithPopup
            title="Delete Branch"
            description="Are you sure you want to delete this branch? This action is irreversible. Orders associated with this branch will be preserved but the branch reference will be removed."
            action={handleDeleteBranch}
            onComplete={handleComplete}
            text={(
                <>
                    <Trash2 className="text-muted-foreground size-4" />
                    Delete Branch
                </>
            )}
            messages={{
                success: "Branch deleted successfully",
                error: "Failed to delete branch",
                loading: "Deleting branch..."
            }}
            className="bg-transparent w-full justify-start"
        />
    )
}

export default DeleteBranchButton 