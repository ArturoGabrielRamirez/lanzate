"use client"
import { createStore } from "../actions/createStore"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { formatErrorResponse } from "@/utils/lib"
import { schema } from "../schemas/store-schema"
import InputField from "@/features/layout/components/input"
import { Plus } from "lucide-react"

type Props = {
    userId: number
    canCreate?: boolean
}

function CreateStoreButton({ userId, canCreate = true }: Props) {

    const handleCreateStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse("Name is required", null, null)
        if (!userId) return formatErrorResponse("User ID is required", null, null)
        return createStore(payload.name, userId)
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
        >
            <InputField name="name" label="Name" type="text" />
        </ButtonWithPopup>
    )
}
export default CreateStoreButton