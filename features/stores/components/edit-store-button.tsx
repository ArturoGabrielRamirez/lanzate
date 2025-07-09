"use client"
import { updateStore } from "../actions/updateStore"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { formatErrorResponse } from "@/utils/lib"
import { editSchema } from "../schemas/store-schema"
import InputField from "@/features/layout/components/input"
import { Store } from "@/prisma/generated/prisma"
import { Pencil } from "lucide-react"
import { useState } from "react"

type Props = {
    userId: number
    slug: string
    store: Store
}

function EditStoreButton({ userId, slug, store }: Props) {

    const [subdomain, setSubdomain] = useState(store.subdomain)

    const handleEditStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse("Name is required", null, null)
        if (!userId) return formatErrorResponse("User ID is required", null, null)
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
                    Edit store
                </>
            )}
            title="Edit store"
            schema={editSchema}
            description="Edit the details of your store"
            action={handleEditStore}
            messages={{
                success: "Store updated successfully!",
                error: "Failed to update store",
                loading: "Updating store..."
            }}
        >
            <InputField name="name" label="Name" type="text" defaultValue={store.name} />
            <InputField name="description" label="Description" type="text" defaultValue={store.description || ""} />
            <div className="relative grid grid-cols-[1fr_auto] gap-2 items-end">
                <InputField name="subdomain" label="Subdomain" type="text" onChange={handleSubdomainChange} value={subdomain} />
                <span className="text-muted-foreground pointer-events-none select-none">
                    .lanzate.com
                </span>
            </div>
        </ButtonWithPopup>
    )
}
export default EditStoreButton