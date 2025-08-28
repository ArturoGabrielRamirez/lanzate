"use client"
import { ButtonWithPopup } from "@/features/layout/components"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { deleteProductVariant } from "@/features/products/actions/deleteProductVariant"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"

type Props = { variantId: number; slug: string; productId: number }

export default function DeleteVariantButton({ variantId, slug, productId }: Props) {
    const t = useTranslations("store.delete-variant")

    const action = async () => {
        try {
            const { error, message } = await deleteProductVariant(variantId, slug)
            if (error) throw new Error(message)
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
            text={<><Trash2 className="size-4 text-muted-foreground" />{t("button")}</>}
            messages={{ success: t("messages.success"), error: t("messages.error"), loading: t("messages.loading") }}
            className="bg-transparent w-full justify-start"
        />
    )
}


