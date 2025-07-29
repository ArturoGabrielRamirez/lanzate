"use client"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { updateStore } from "../actions/updateStore"
import { editSchema } from "../schemas/store-schema"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { EditStoreButtonProps } from "@/features/stores/types"
import { useTranslations } from "next-intl"

function EditStoreButton({ userId, slug, store }: EditStoreButtonProps) {

    const [subdomain, setSubdomain] = useState(store.subdomain)
    const t = useTranslations("store.edit-store")

    const handleEditStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse(t("messages.name-required"), null, null)
        if (!userId) return formatErrorResponse(t("messages.user-id-required"), null, null)
        return updateStore(slug, { ...payload, subdomain }, userId)
    }

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil />
                    {t("button")}
                </>
            )}
            title={t("title")}
            schema={editSchema}
            description={t("description")}
            action={handleEditStore}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
        >
            <InputField name="name" label={t("name")} type="text" defaultValue={store.name} />
            <InputField name="description" label={t("description-field")} type="text" defaultValue={store.description || ""} />
            <div className="relative grid grid-cols-[1fr_auto] gap-2 items-end">
                <InputField name="subdomain" label={t("subdomain")} type="text" onChange={handleSubdomainChange} value={subdomain} />
                <span className="text-muted-foreground pointer-events-none select-none">
                    .lanzate.com
                </span>
            </div>
        </ButtonWithPopup>
    )
}
export default EditStoreButton