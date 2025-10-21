"use client"

import { UnifiedCreateProductButton } from "@/features/products/components/unified-create-product-button"
import { CreateProductButtonProps } from "@/features/products/type"

function CreateProductButton(props: CreateProductButtonProps) {
    return <UnifiedCreateProductButton {...props} />
}

export { CreateProductButton }