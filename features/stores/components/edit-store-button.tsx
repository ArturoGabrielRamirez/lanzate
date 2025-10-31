"use client"

import { useTranslations } from "next-intl"

import { updateStoreAction } from "@/features/stores/actions"
import { StoreFormButton } from "@/features/stores/components"
import { editSchema } from "@/features/stores/schemas"
import { EditStoreButtonProps, EditStorePayload } from "@/features/stores/types"

function EditStoreButton({ userId, slug, store }: EditStoreButtonProps) {

    const t = useTranslations("store.edit-store")

    const handleEditStore = async (payload: EditStorePayload) => {
        return updateStoreAction(slug, {
            ...payload,
            subdomain: payload.subdomain,
            contact_phone: payload.contact_phone || "",
            contact_whatsapp: payload.contact_whatsapp || "",
            facebook_url: payload.facebook_url || "",
            instagram_url: payload.instagram_url || "",
            x_url: payload.x_url || "",
            /* is_physical_store: payload.is_physical_store || false, */
            /* address: payload.address || "",
            city: payload.city || "",
            province: payload.province || "",
            country: payload.country || "", */
        }, userId)
    }

    return (
        <StoreFormButton
            mode="edit"
            userId={userId}
            slug={slug}
            store={store}
            schema={editSchema}
            action={handleEditStore}
            className="w-fit"
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
        />
    )
}

export { EditStoreButton }