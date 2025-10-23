"use client"

import { Trash2 } from "lucide-react"
import { redirect } from "next/navigation"
import { useTranslations } from "next-intl"

import { ButtonWithPopup } from "@/features/layout/components"
import { deleteProductAction } from "@/features/products/actions/delete-product.action"
import { DeleteProductButtonProps } from "@/features/products/types"
import { formatErrorResponse } from "@/utils/lib"

function DeleteProductButton({ productId, slug, onComplete, userId }: DeleteProductButtonProps) {
    
    const t = useTranslations("store.delete-product")
    
    const handleDeleteProduct = async () => {
        try {
            const { hasError, message, payload } = await deleteProductAction(productId, slug, userId)
            if (hasError) throw new Error(message)
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
export { DeleteProductButton } 