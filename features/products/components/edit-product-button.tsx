"use client"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { productUpdateSchema } from "../schemas/product-schema"
import { editProduct } from "../actions/editProduct"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil } from "lucide-react"

import { EditProductButtonProps } from "@/features/products/type"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { useState } from "react"

function EditProductButton({ product, slug, onComplete }: EditProductButtonProps) {

    const [categories, setCategories] = useState<string[]>([])

    const handleAddCategory = (value: any) => {
        setCategories(value)
    }

    const handleEditProduct = async (payload: any) => {

        const data = {
            ...payload,
            categories
        }

        if (!payload.name) return formatErrorResponse("Name is required", null, null)
        if (payload.price == null) return formatErrorResponse("Price is required", null, null)
        if (payload.stock == null) return formatErrorResponse("Stock is required", null, null)
        return editProduct(product.id, data, slug)
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil />
                    Edit Product
                </>
            )}
            title="Edit product"
            schema={productUpdateSchema}
            description="Edit the details of your product"
            action={handleEditProduct}
            onComplete={onComplete}
            messages={{
                success: "Product updated successfully!",
                error: "Failed to update product",
                loading: "Updating product..."
            }}
        >
            <InputField name="name" label="Name" type="text" defaultValue={product.name} />
            <InputField name="price" label="Price" type="number" defaultValue={String(product.price)} />
            <InputField name="stock" label="Stock" type="number" defaultValue={String(product.stock)} />
            <InputField name="description" label="Description" type="text" defaultValue={product.description || ""} />
            <CategorySelect onChange={handleAddCategory} defaultValue={product.categories.map((category: any) => ({ label: category.name, value: category.id }))} />
        </ButtonWithPopup>
    )
}
export default EditProductButton 