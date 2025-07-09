"use client"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { formatErrorResponse } from "@/utils/lib"
import { Trash2 } from "lucide-react"
import { deleteStore } from "../actions/deleteStore"
import { redirect } from "next/navigation"

type Props = {
    storeId: number
}
function DeleteStoreButton({ storeId }: Props) {

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