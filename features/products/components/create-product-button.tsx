"use client"

import UnifiedCreateProductButton from "./unified-create-product-button"
import { CreateProductButtonProps } from "@/features/products/type"

function CreateProductButton(props: CreateProductButtonProps) {
    return <UnifiedCreateProductButton {...props} />
}

export default CreateProductButton