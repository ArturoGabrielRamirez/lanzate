"use client"
import { updateStore } from "../actions/updateStore"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { formatErrorResponse } from "@/utils/lib"
import { editSchema } from "../schemas/store-schema"
import InputField from "@/features/layout/components/input"
import { Store } from "@/prisma/generated/prisma"

type Props = {
    userId: number
    slug: string
    store: Store
}

function EditStoreButton({ userId, slug, store }: Props) {

    const handleEditStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse("Name is required", null, null)
        if (!userId) return formatErrorResponse("User ID is required", null, null)
        return updateStore(slug, payload, userId)
    }

    return (
        <ButtonWithPopup
            text="Edit store"
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
            <InputField name="description" label="Description" type="text" defaultValue={store.description} />
        </ButtonWithPopup>
    )
}
export default EditStoreButton