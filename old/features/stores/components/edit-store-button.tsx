"use client"

import { updateStore } from "../actions/updateStore"
import { editSchema } from "../schemas/store-schema"
import { EditStoreButtonProps } from "@/features/stores/types"
import { useTranslations } from "next-intl"
import StoreFormButton from "./store-form-button"

type EditStorePayload = {
    name: string
    description?: string
    subdomain: string
    contact_phone?: string
    contact_whatsapp?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
    is_physical_store?: boolean
    address?: string
    city?: string
    province?: string
    country?: string
}

function EditStoreButton({ userId, slug, store }: EditStoreButtonProps) {

    const t = useTranslations("store.edit-store")

    const handleEditStore = async (payload: EditStorePayload) => {
        return updateStore(slug, {
            ...payload,
            subdomain: payload.subdomain,
            contact_phone: payload.contact_phone || "",
            contact_whatsapp: payload.contact_whatsapp || "",
            facebook_url: payload.facebook_url || "",
            instagram_url: payload.instagram_url || "",
            x_url: payload.x_url || "",
            is_physical_store: payload.is_physical_store || false,
            address: payload.address || "",
            city: payload.city || "",
            province: payload.province || "",
            country: payload.country || "",
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

export default EditStoreButton