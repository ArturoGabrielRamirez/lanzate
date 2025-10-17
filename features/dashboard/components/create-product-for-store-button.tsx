"use client"

import { CreateProductForStoreButtonProps } from "@/features/dashboard/types"
import UnifiedCreateProductButton from "@/features/products/components/unified-create-product-button"

function CreateProductForStoreButton(props: CreateProductForStoreButtonProps) {
    return <UnifiedCreateProductButton {...props} />
}

export { CreateProductForStoreButton }