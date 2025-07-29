"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { createStore } from "../actions/createStore"
import { formatErrorResponse } from "@/utils/lib"
import { schema } from "../schemas/store-schema"
import { generate } from "random-words"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateStoreButtonProps } from "@/features/stores/types"
import { useTranslations } from "next-intl"

function CreateStoreButton({ userId, canCreate = true }: CreateStoreButtonProps) {

    const [subdomain, setSubdomain] = useState(generate({ exactly: 1, minLength: 7, join: "" }))
    const t = useTranslations("store.create-store")

    const handleCreateStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse(t("messages.name-required"), null, null)
        if (!userId) return formatErrorResponse(t("messages.user-id-required"), null, null)
        return createStore({ ...payload, subdomain }, userId)
    }

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Plus />
                    {t("button")}
                </>
            )}
            title={t("title")}
            disabled={!canCreate}
            schema={schema}
            description={t("description")}
            action={handleCreateStore}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className="w-full"
        >
            <InputField name="name" label={t("name")} type="text" />
            <InputField name="description" label={t("description-field")} type="text" />
            <div className="relative grid grid-cols-[1fr_auto] gap-2 items-end">
                <InputField
                    name="subdomain"
                    label={t("subdomain")}
                    type="text"
                    onChange={handleSubdomainChange}
                    value={subdomain}
                />
                <span className="text-muted-foreground pointer-events-none select-none">
                    .lanzate.com
                </span>
            </div>
        </ButtonWithPopup>
    )
}
export default CreateStoreButton