"use client"

import UnifiedCreateProductButton from "@/features/products/components/unified-create-product-button"
import { DashboardStore } from "../types/types"

type CreateProductForStoreButtonProps = {
    userId: number
    stores: DashboardStore[]
}

function CreateProductForStoreButton(props: CreateProductForStoreButtonProps) {
    return <UnifiedCreateProductButton {...props} />
}

export default CreateProductForStoreButton 