"use client"

import { CreateBranchButtonProps } from "../types"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { Plus } from "lucide-react"
import { branchCreateSchema } from "../schemas/branch-schema"
import { formatErrorResponse } from "@/utils/lib"
import { createBranch } from "../actions/createBranch"

function CreateBranchButton({ storeId }: CreateBranchButtonProps) {

    const handleCreateProduct = async (payload: any) => {
        try {

            const { error, message, payload: product } = await createBranch(payload, storeId)
            if (error) throw new Error(message)
            return {
                error: false,
                message: "Product created successfully",
                payload: product
            }
        } catch (error) {
            return formatErrorResponse("Error creating product", error, null)
        }
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Plus />
                    Create Branch
                </>
            )}
            schema={branchCreateSchema}
            title="Create new branch"
            description="Create a new branch to start selling your products! Choose a name for your branch and click on the button below, you can continue to add more details of the branch once it's created."
            action={handleCreateProduct}
            messages={{
                success: "Product created successfully!",
                error: "Failed to create product",
                loading: "Creating product..."
            }}
        >
            <InputField name="name" label="Name" type="text" />
            <InputField name="address" label="Address" type="text" />
            <InputField name="phone" label="Phone" type="text" />
            <InputField name="email" label="Email" type="text" />
        </ButtonWithPopup>
    )
}

export default CreateBranchButton