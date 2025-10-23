"use client"

import { Trash2 } from "lucide-react"
import { redirect } from "next/navigation"
import { useTranslations } from "next-intl"

import { ButtonWithPopup } from "@/features/layout/components"
import { deleteProductVariantAction } from "@/features/products/actions/delete-product-variant.action"
import type { DeleteVariantButtonProps } from "@/features/products/types"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { formatErrorResponse } from "@/utils/lib"

function DeleteVariantButton({ variantId, slug, productId, onlyIcon = false }: DeleteVariantButtonProps) {
    const t = useTranslations("store.delete-variant")

    const action = async () => {
        try {
            const { hasError, message } = await deleteProductVariantAction(variantId, slug)
            if (hasError) throw new Error(message)
            return { error: false, message: t("messages.success"), payload: null }
        } catch (error) {
            return formatErrorResponse(t("messages.error"), error, null)
        }
    }

    return (
        <ButtonWithPopup
            title={t("title")}
            description={t("description")}
            action={action}
            onComplete={() => redirect(`/stores/${slug}/products/${productId}`)}
            text={
                onlyIcon ? (
                    <IconButton
                        icon={Trash2}
                        color={[239, 68, 68]} // color red del tema
                        className="opacity-0 group-hover/variant-basic-info-display:opacity-100 transition-opacity duration-300"
                    />
                ) : (
                    <><Trash2 className="size-4 text-muted-foreground" />{t("button")}</>
                )
            }
            messages={{ success: t("messages.success"), error: t("messages.error"), loading: t("messages.loading") }}
            className={cn("bg-transparent", {
                "w-full justify-start": !onlyIcon,
                "p-0": onlyIcon
            })}
        />
    )
}

export { DeleteVariantButton }


