"use client"

import { DashboardStore } from "@/features/dashboard/types"
import UnifiedCreateProductButton from "@/features/products/components/unified-create-product-button"

type CreateProductForStoreButtonProps = {
    userId: number
    stores: DashboardStore[]
}

function CreateProductForStoreButton(props: CreateProductForStoreButtonProps) {
    return <UnifiedCreateProductButton {...props} />
}

export default CreateProductForStoreButton 