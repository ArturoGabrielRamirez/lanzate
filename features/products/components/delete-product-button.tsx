"use client"
import { ButtonWithPopup } from "@/features/layout/components"
import { deleteProduct } from "../actions/deleteProduct"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"

import { DeleteProductButtonProps } from "@/features/products/type"

function DeleteProductButton({ productId, slug, onComplete, userId }: DeleteProductButtonProps) {
    const handleDeleteProduct = async () => {
        try {
            const { error, message, payload } = await deleteProduct(productId, slug, userId)
            if (error) throw new Error(message)
            return {
                error: false,
                message: "Product deleted successfully",
                payload: payload
            }
        } catch (error) {
            return formatErrorResponse("Error deleting product", error, null)
        }
    }

    const handleComplete = () => {
        if (onComplete) return onComplete()
        redirect(`/stores/${slug}/products`)
    }

    return (
        <ButtonWithPopup
            title="Delete Product"
            description="Are you sure you want to delete this product? This action is irreversible."
            action={handleDeleteProduct}
            onComplete={handleComplete}
            text={(
                <>
                    <Trash2 className="text-muted-foreground size-4" />
                    Delete Product
                </>
            )}
            messages={{
                success: "Product deleted successfully",
                error: "Failed to delete product",
                loading: "Deleting product..."
            }}
            className="bg-transparent w-full justify-start"
        />
    )
}
export default DeleteProductButton 