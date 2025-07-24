"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { createStore } from "../actions/createStore"
import { formatErrorResponse } from "@/utils/lib"
import { schema } from "../schemas/store-schema"
import { generate } from "random-words"
import { Plus } from "lucide-react"
import { useState } from "react"

import { CreateStoreButtonProps } from "@/features/stores/types"

function CreateStoreButton({ userId, canCreate = true }: CreateStoreButtonProps) {

    const [subdomain, setSubdomain] = useState(generate({ exactly: 1, minLength: 7, join: "" }))

    const handleCreateStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse("Name is required", null, null)
        if (!userId) return formatErrorResponse("User ID is required", null, null)
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
                    New store
                </>
            )}
            title="Create new store"
            disabled={!canCreate}
            schema={schema}
            description="Create a new store to start selling your products! Choose a name for your store and click on the button below, you can continue to add more details of the store once it's created."
            action={handleCreateStore}
            messages={{
                success: "Store created successfully!",
                error: "Failed to create store",
                loading: "Creating store..."
            }}
            className="w-full"
        >
            <InputField name="name" label="Name" type="text" />
            <InputField name="description" label="Description" type="text" />
            <div className="relative grid grid-cols-[1fr_auto] gap-2 items-end">
                <InputField
                    name="subdomain"
                    label="Subdomain"
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