"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createStore } from "../actions/createStore"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { formatErrorResponse } from "@/utils/lib"

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
            text="New store"
            title="Create new store"
            disabled={!canCreate}
            description="Create a new store to start selling your products! Choose a name for your store and click on the button below, you can continue to add more details of the store once it's created."
            action={handleCreateStore}
            messages={{
                success: "Store created successfully!",
                error: "Failed to create store",
                loading: "Creating store..."
            }}
        >
            <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input type="text" name="name" />
            </div>
        </ButtonWithPopup>
    )
}
export default CreateStoreButton