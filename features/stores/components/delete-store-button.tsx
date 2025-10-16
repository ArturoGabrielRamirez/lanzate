"use client"

import { Trash2 } from "lucide-react"
import { redirect } from "next/navigation"
import { useTranslations } from "next-intl"

import { ButtonWithPopup } from "@/features/layout/components"
import { deleteStoreAction } from "@/features/stores/actions"
import { DeleteStoreButtonProps } from "@/features/stores/types"
import { formatErrorResponse } from "@/utils/lib"

function DeleteStoreButton({ storeId, userId }: DeleteStoreButtonProps) {

    const t = useTranslations("store.delete-store")

    const handleDeleteStore = async () => {
        try {
            const { hasError, message } = await deleteStoreAction(storeId, userId)

            if (hasError) throw new Error(message)

            return {
                error: false,
                message: t("messages.success"),
                payload: null
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