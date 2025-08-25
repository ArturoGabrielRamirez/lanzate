"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { Edit, StoreIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { useState } from "react"
import { Store } from "@prisma/client"
import { editBasicInfoSchema } from "@/features/stores/schemas/basic-info-schema"
import { updateStoreBasicInfo } from "@/features/stores/actions/updateStoreBasicInfo"

interface EditBasicInfoButtonProps {
    store: Store
    userId: number
    className?: string
}

const EditBasicInfoButton = ({ store, userId, className }: EditBasicInfoButtonProps) => {
    const t = useTranslations("store.edit-store")
    const [subdomain, setSubdomain] = useState(store.subdomain)

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
    }

    const handleSubmit = async (payload: { name: string; description?: string; subdomain: string }) => {
        return updateStoreBasicInfo(store.slug, {
            ...payload,
            subdomain,
        }, userId)
    }

    return (
        <ButtonWithPopup
            text={
                <>
                    <Edit />
                </>
            }
            title="Edit Basic Information"
            schema={editBasicInfoSchema}
            description="Update your store's basic information"
            action={handleSubmit}
            messages={{
                success: "Basic information updated successfully!",
                error: "Failed to update basic information",
                loading: "Updating basic information..."
            }}
            className={className}
            onlyIcon
            contentButton={(
                <>
                    <Edit />
                    Edit
                </>
            )}
        >
            <div className="space-y-4">
                <InputField
                    name="name"
                    label={t("name")}
                    type="text"
                    defaultValue={store.name}
                />
                <InputField
                    name="description"
                    label={t("description-field")}
                    type="text"
                    defaultValue={store.description || ""}
                />
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
            </div>
        </ButtonWithPopup>
    )
}

export default EditBasicInfoButton
