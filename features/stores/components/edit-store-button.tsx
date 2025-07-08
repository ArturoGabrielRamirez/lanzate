"use client"
import { updateStore } from "../actions/updateStore"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { formatErrorResponse } from "@/utils/lib"
import { schema } from "../schemas/store-schema"
import InputField from "@/features/layout/components/input"

type Props = {
    userId: number
    canCreate?: boolean
}

function EditStoreButton({ userId, canCreate = true }: Props) {

    const handleCreateStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse("Name is required", null, null)
        if (!userId) return formatErrorResponse("User ID is required", null, null)
        return updateStore(payload.name, userId)
    }

    return (
        <ButtonWithPopup
            text="New store"
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
export default EditStoreButton