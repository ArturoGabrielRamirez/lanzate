"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { createProduct } from "../actions/createProduct"
import { productCreateSchema } from "../schemas/product-schema"
import { formatErrorResponse } from "@/utils/lib"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateProductButtonProps } from "@/features/products/type"
import CategorySelect from "@/features/store-landing/components/category-select-"

function CreateProductButton({ storeId }: CreateProductButtonProps) {

    const [categories, setCategories] = useState<string[]>([])

    const handleAddCategory = (value: any) => {
        setCategories(value)
    }

    const handleCreateProduct = async (payload: any) => {
        try {

            const data = {
                ...payload,
                categories
            }

            const { error, message, payload: product } = await createProduct(data, storeId)
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
            schema={productCreateSchema}
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
            <InputField name="price" label="Price" type="number" defaultValue="0" />
            <InputField name="stock" label="Stock" type="number" defaultValue="0" />
            <InputField name="description" label="Description" type="text" />
            <CategorySelect onChange={handleAddCategory} />
        </ButtonWithPopup>
    )
}
export default CreateProductButton