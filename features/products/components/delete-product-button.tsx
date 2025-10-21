"use client"
import { ButtonWithPopup } from "@/features/layout/components"
import { deleteProductAction } from "../actions/delete-product.action"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"
import { DeleteProductButtonProps } from "@/features/products/type"
import { useTranslations } from "next-intl"

function DeleteProductButton({ productId, slug, onComplete, userId }: DeleteProductButtonProps) {
    
    const t = useTranslations("store.delete-product")
    
    const handleDeleteProduct = async () => {
        try {
            const { error, message, payload } = await deleteProductAction(productId, slug, userId)
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
        redirect(`/stores/${slug}/products`)
    }

    return (
        <ButtonWithPopup
            title={t("title")}
            description={t("description")}
            action={handleDeleteProduct}
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
export default DeleteProductButton 