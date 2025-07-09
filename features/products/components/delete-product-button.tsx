"use client"
import { ButtonWithPopup } from "@/features/layout/components"
import { deleteProduct } from "../actions/deleteProduct"
import { formatErrorResponse } from "@/utils/lib"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"

type Props = {
    productId: number
    slug: string
    onComplete?: () => void
}

function DeleteProductButton({ productId, slug, onComplete }: Props) {
    const handleDeleteProduct = async () => {
        try {
            const { error, message, payload } = await deleteProduct(productId, slug)
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
            variant="destructive"
            text={(
                <>
                    <Trash2 />
                    Delete Product
                </>
            )}
            messages={{
                success: "Product deleted successfully",
                error: "Failed to delete product",
                loading: "Deleting product..."
            }}
        />
    )
}
export default DeleteProductButton 