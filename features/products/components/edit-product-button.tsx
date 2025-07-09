"use client"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { editSchema } from "../schemas/product-schema"
import { editProduct } from "../actions/editProduct"
import { Product } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil } from "lucide-react"

type Props = {
    product: Product
    slug: string
    onComplete?: () => void
}

function EditProductButton({ product, slug, onComplete }: Props) {
    const handleEditProduct = async (payload: any) => {
        if (!payload.name) return formatErrorResponse("Name is required", null, null)
        if (payload.price == null) return formatErrorResponse("Price is required", null, null)
        if (payload.stock == null) return formatErrorResponse("Stock is required", null, null)
        return editProduct(product.id, payload, slug)
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
            schema={editSchema}
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
        </ButtonWithPopup>
    )
}
export default EditProductButton 