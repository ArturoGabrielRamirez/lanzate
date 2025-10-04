"use client"
import { ButtonWithPopup } from "@/features/layout/components"
import { deleteStore } from "../actions/deleteStore"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"
import { DeleteStoreButtonProps } from "@/features/stores/types"
import { useTranslations } from "next-intl"

function DeleteStoreButton({ storeId, userId }: DeleteStoreButtonProps) {

    const t = useTranslations("store.delete-store")

    const handleDeleteStore = async () => {
        try {
            const { error, message, payload } = await deleteStore(storeId,userId)

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
        redirect("/stores")
    }

    return (
        <ButtonWithPopup
            title={t("title")}
            description={t("description")}
            action={handleDeleteStore}
            onComplete={handleComplete}
            variant="destructive"
            text={(
                <>
                    <Trash2 />
                    {t("button")}
                </>
            )}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
        />
    )
}
export default DeleteStoreButton