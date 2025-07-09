"use client"
import { ButtonWithPopup } from "@/features/layout/components"
import { deleteStore } from "../actions/deleteStore"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"

import { DeleteStoreButtonProps } from "@/features/stores/types"

function DeleteStoreButton({ storeId }: DeleteStoreButtonProps) {

    const handleDeleteStore = async () => {
        try {
            const { error, message, payload } = await deleteStore(storeId)

            if (error) throw new Error(message)

            return {
                error: false,
                message: "Store deleted successfully",
                payload: payload
            }

        } catch (error) {
            return formatErrorResponse("Error deleting store", error, null)
        }
    }

    const handleComplete = () => {
        redirect("/stores")
    }

    return (
        <ButtonWithPopup
            title="Delete Store"
            description="You can delete your store by clicking the button below. Keep in mind that this action is irreversible and it will delete all the data associated with your store."
            action={handleDeleteStore}
            onComplete={handleComplete}
            variant="destructive"
            text={(
                <>
                    <Trash2 />
                    Delete Store
                </>
            )}
            messages={{
                success: "Store deleted successfully",
                error: "Error deleting store",
                loading: "Deleting store..."
            }}
        />
    )
}
export default DeleteStoreButton