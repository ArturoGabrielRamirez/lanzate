"use client"

import { createStore } from "../actions/createStore"
import { schema } from "../schemas/store-schema"
import { CreateStoreButtonProps } from "@/features/stores/types"
import { useTranslations } from "next-intl"
import StoreFormButton from "./store-form-button"

type CreateStorePayload = {
    name: string
    description?: string
    subdomain: string
}

function CreateStoreButton({ userId, canCreate = true, className }: CreateStoreButtonProps) {

    const t = useTranslations("store.create-store")

    const handleCreateStore = async (payload: CreateStorePayload) => {
        return createStore({ ...payload, subdomain: payload.subdomain }, userId)
    }

    return (
        <StoreFormButton
            mode="create"
            userId={userId}
            canCreate={canCreate}
            className={className}
            schema={schema}
            action={handleCreateStore}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
        />
    )
}

export default CreateStoreButton