"use client"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { Plus } from "lucide-react"
import { createProduct } from "../actions/createProduct"
import InputField from "@/features/layout/components/input"
import { formatErrorResponse } from "@/utils/lib"
import { yupResolver } from "@hookform/resolvers/yup"
import { schema } from "../schemas/product-schema"

type Props = {
    storeId: number
}

function CreateProductButton({ storeId }: Props) {

    const handleCreateProduct = async (payload: any) => {
        try {

            const { error, message, payload: product } = await createProduct(payload, storeId)
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
                    Create Product
                </>
            )}
            schema={schema}
            title="Create new product"
            description="Create a new product to start selling your products! Choose a name for your product and click on the button below, you can continue to add more details of the product once it's created."
            action={handleCreateProduct}
            messages={{
                success: "Product created successfully!",
                error: "Failed to create product",
                loading: "Creating product..."
            }}
        >
            <InputField name="name" label="Name" type="text" />
            <InputField name="price" label="Price" type="number" />
            <InputField name="stock" label="Stock" type="number" />
        </ButtonWithPopup>
    )
}
export default CreateProductButton